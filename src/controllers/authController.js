const authService = require('../services/authService');
const {
  HTTP_STATUS,
  RESPONSE_MESSAGES,
  COMMON_CONSTANTS
} = require('../constants');

class AuthController {
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);
      res.status(HTTP_STATUS.CREATED).json({
        success: COMMON_CONSTANTS.RESPONSE_STATUS.SUCCESS,
        message: RESPONSE_MESSAGES.AUTH.REGISTRATION_SUCCESS,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.status(HTTP_STATUS.OK).json({
        success: COMMON_CONSTANTS.RESPONSE_STATUS.SUCCESS,
        message: RESPONSE_MESSAGES.AUTH.LOGIN_SUCCESS,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const result = await authService.refreshToken(refreshToken);
      res.status(HTTP_STATUS.OK).json({
        success: COMMON_CONSTANTS.RESPONSE_STATUS.SUCCESS,
        message: RESPONSE_MESSAGES.AUTH.TOKEN_REFRESHED,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async getCurrentUser(req, res, next) {
    try {
      const user = await authService.getCurrentUser(req.user.userId);
      res.status(HTTP_STATUS.OK).json({
        success: COMMON_CONSTANTS.RESPONSE_STATUS.SUCCESS,
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      // For JWT, logout is handled client-side by removing the token
      // But we can track it on server side if needed
      res.status(HTTP_STATUS.OK).json({
        success: COMMON_CONSTANTS.RESPONSE_STATUS.SUCCESS,
        message: RESPONSE_MESSAGES.AUTH.LOGOUT_SUCCESS
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
