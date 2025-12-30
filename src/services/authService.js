const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/UserRepository');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const { JWT_SECRET, JWT_EXPIRY, REFRESH_TOKEN_EXPIRY } = require('../config');

class AuthService {
  async register(userData) {
    const { email, password, firstName, lastName } = userData;

    // Check if user exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError('Email already registered', 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName
    });

    const createdUser = await userRepository.create(user);

    // Generate tokens
    const { accessToken, refreshToken } = this.generateTokens(createdUser);

    return {
      user: new User(createdUser).toJSON(),
      accessToken,
      refreshToken
    };
  }

  async login(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new AppError('Invalid credentials', 401);
    }

    if (!user.isActive) {
      throw new AppError('Account is deactivated', 403);
    }

    // Update last login
    await userRepository.updateById(user._id, {
      lastLogin: new Date().toISOString()
    });

    const { accessToken, refreshToken } = this.generateTokens(user);

    return {
      user: new User(user).toJSON(),
      accessToken,
      refreshToken
    };
  }

  generateTokens(user) {
    const payload = {
      userId: user._id,
      email: user.email
    };

    const accessToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRY
    });

    const refreshToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRY
    });

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, JWT_SECRET);
      const user = await userRepository.findById(decoded.userId);

      if (!user || !user.isActive) {
        throw new AppError('Invalid token', 401);
      }

      const { accessToken, refreshToken: newRefreshToken } =
        this.generateTokens(user);

      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Invalid or expired refresh token', 401);
    }
  }

  async getCurrentUser(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return new User(user).toJSON();
  }
}

module.exports = new AuthService();
