const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const AppError = require('../utils/AppError');
const {
  ATTACHMENT_CONSTANTS,
  ERROR_MESSAGES,
  HTTP_STATUS
} = require('../constants');

// Ensure upload directories exist
const ensureUploadDirs = () => {
  const dirs = [
    ATTACHMENT_CONSTANTS.PATHS.UPLOADS,
    ATTACHMENT_CONSTANTS.PATHS.RECEIPTS,
    ATTACHMENT_CONSTANTS.PATHS.THUMBNAILS,
    ATTACHMENT_CONSTANTS.PATHS.TEMP
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureUploadDirs();
    cb(null, ATTACHMENT_CONSTANTS.PATHS.RECEIPTS);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp-uuid-originalname
    const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    const sanitizedBasename = basename.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50);
    cb(null, `${uniqueSuffix}-${sanitizedBasename}${ext}`);
  }
});

// File filter to validate file types
const fileFilter = (req, file, cb) => {
  const allAllowedTypes = [
    ...ATTACHMENT_CONSTANTS.ALLOWED_MIME_TYPES.IMAGES,
    ...ATTACHMENT_CONSTANTS.ALLOWED_MIME_TYPES.DOCUMENTS
  ];

  if (allAllowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        ERROR_MESSAGES.ATTACHMENT.INVALID_FILE_TYPE,
        HTTP_STATUS.BAD_REQUEST
      ),
      false
    );
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: ATTACHMENT_CONSTANTS.FILE_SIZE.MAX_FILE,
    files: ATTACHMENT_CONSTANTS.LIMITS.MAX_FILES_PER_EXPENSE
  }
});

// Error handler for multer errors
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(
        new AppError(
          ERROR_MESSAGES.ATTACHMENT.FILE_TOO_LARGE,
          HTTP_STATUS.BAD_REQUEST
        )
      );
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return next(
        new AppError(
          ERROR_MESSAGES.ATTACHMENT.MAX_FILES_EXCEEDED,
          HTTP_STATUS.BAD_REQUEST
        )
      );
    }
    return next(
      new AppError(
        err.message || ERROR_MESSAGES.ATTACHMENT.UPLOAD_FAILED,
        HTTP_STATUS.BAD_REQUEST
      )
    );
  }
  next(err);
};

module.exports = {
  upload,
  handleMulterError,
  ensureUploadDirs
};
