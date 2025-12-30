const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/UserRepository');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const { JWT_SECRET, JWT_EXPIRY, REFRESH_TOKEN_EXPIRY, BCRYPT_ROUNDS } = require('../config');
const {
  ERROR_MESSAGES,
  RESPONSE_MESSAGES,
  HTTP_STATUS,
  AUTH_CONSTANTS
} = require('../constants');

class AuthService {
  async register(userData) {
    const { email, password, firstName, lastName } = userData;

    // Check if user exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError(
        ERROR_MESSAGES.AUTH.EMAIL_ALREADY_REGISTERED,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);

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
      throw new AppError(
        ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new AppError(
        ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS,
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    if (!user.isActive) {
      throw new AppError(
        ERROR_MESSAGES.AUTH.ACCOUNT_DEACTIVATED,
        HTTP_STATUS.FORBIDDEN
      );
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
        throw new AppError(
          ERROR_MESSAGES.AUTH.INVALID_TOKEN,
          HTTP_STATUS.UNAUTHORIZED
        );
      }

      const { accessToken, refreshToken: newRefreshToken } =
        this.generateTokens(user);

      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        ERROR_MESSAGES.AUTH.INVALID_REFRESH_TOKEN,
        HTTP_STATUS.UNAUTHORIZED
      );
    }
  }

  async getCurrentUser(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError(
        ERROR_MESSAGES.AUTH.USER_NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }
    return new User(user).toJSON();
  }
}

module.exports = new AuthService();
