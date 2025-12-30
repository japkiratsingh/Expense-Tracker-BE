/**
 * Error Messages
 * Centralized error messages for consistent error handling
 */

module.exports = {
  // Authentication Errors
  AUTH: {
    EMAIL_ALREADY_REGISTERED: "Email already registered",
    INVALID_CREDENTIALS: "Invalid credentials",
    ACCOUNT_DEACTIVATED: "Account is deactivated",
    NO_TOKEN_PROVIDED: "No token provided",
    INVALID_TOKEN: "Invalid token",
    TOKEN_EXPIRED: "Token expired",
    INVALID_REFRESH_TOKEN: "Invalid or expired refresh token",
    USER_NOT_FOUND: "User not found",
  },

  // Validation Errors
  VALIDATION: {
    FAILED: "Validation failed",
  },

  // General Errors
  GENERAL: {
    ROUTE_NOT_FOUND: "Route {{route}} not found",
    INTERNAL_SERVER_ERROR: "Internal Server Error",
  },

  // Expense Errors
  EXPENSE: {
    NOT_FOUND: "Expense not found",
    UNAUTHORIZED_ACCESS: "Unauthorized to access this expense",
    CATEGORY_NOT_FOUND: "Category not found",
    INVALID_CATEGORY: "Invalid category",
    INVALID_TAG: "Invalid tag",
    TAG_NOT_FOUND: "Tag not found",
    INVALID_AMOUNT: "Invalid amount",
    INVALID_DATE: "Invalid date",
    INVALID_PAYMENT_METHOD: "Invalid payment method",
    INVALID_EXPORT_FORMAT: "Invalid export format",
    IMPORT_FAILED: "Failed to import expenses",
    INVALID_IMPORT_DATA: "Invalid import data format",
  },

  // Category Errors
  CATEGORY: {
    NOT_FOUND: "Category not found",
    UNAUTHORIZED_ACCESS: "Unauthorized to access this category",
  },

  // Tag Errors
  TAG: {
    NOT_FOUND: "Tag not found",
    UNAUTHORIZED_ACCESS: "Unauthorized to access this tag",
    NAME_ALREADY_EXISTS: "A tag with this name already exists",
    MAX_TAGS_REACHED: "Maximum number of tags reached",
    INVALID_COLOR: "Invalid color format",
    CANNOT_DELETE_IN_USE: "Cannot delete tag that is in use by expenses",
    MERGE_TARGET_NOT_FOUND: "Target tag for merge not found",
    CANNOT_MERGE_SAME_TAG: "Cannot merge a tag with itself",
  },

  // Recurring Expense Errors
  RECURRING: {
    NOT_FOUND: "Recurring expense not found",
    UNAUTHORIZED_ACCESS: "Unauthorized to access this recurring expense",
    INVALID_FREQUENCY: "Invalid frequency",
    INVALID_START_DATE: "Invalid start date",
    INVALID_END_DATE: "Invalid end date or end date must be after start date",
    ALREADY_PAUSED: "Recurring expense is already paused",
    ALREADY_ACTIVE: "Recurring expense is already active",
    GENERATION_FAILED: "Failed to generate expense from recurring template",
  },

  // Attachment Errors
  ATTACHMENT: {
    NOT_FOUND: "Attachment not found",
    UNAUTHORIZED_ACCESS: "Unauthorized to access this attachment",
    FILE_NOT_FOUND: "File not found on server",
    UPLOAD_FAILED: "File upload failed",
    INVALID_FILE_TYPE:
      "Invalid file type. Allowed types: images (JPEG, PNG, GIF, WebP) and documents (PDF, DOC, DOCX, XLS, XLSX, TXT, CSV)",
    FILE_TOO_LARGE: "File size exceeds maximum limit",
    MAX_FILES_EXCEEDED: "Maximum number of attachments per expense exceeded",
    THUMBNAIL_GENERATION_FAILED: "Thumbnail generation failed",
    DELETE_FAILED: "Failed to delete attachment",
  },
};
