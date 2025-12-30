/**
 * Constants Index
 * Central export point for all application constants
 */

const HTTP_STATUS = require('./httpStatus');
const ERROR_MESSAGES = require('./errorMessages');
const VALIDATION_MESSAGES = require('./validationMessages');
const RESPONSE_MESSAGES = require('./responseMessages');
const AUTH_CONSTANTS = require('./authConstants');
const USER_CONSTANTS = require('./userConstants');
const COMMON_CONSTANTS = require('./commonConstants');
const TAG_CONSTANTS = require('./tagConstants');

module.exports = {
  HTTP_STATUS,
  ERROR_MESSAGES,
  VALIDATION_MESSAGES,
  RESPONSE_MESSAGES,
  AUTH_CONSTANTS,
  USER_CONSTANTS,
  COMMON_CONSTANTS,
  TAG_CONSTANTS
};
