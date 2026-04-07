const multer = require('multer');
const ApiError = require('../utils/ApiError');

// Allowed MIME types for image upload
const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const CHAT_ALLOWED_MIMES = [
  ...ALLOWED_MIMES,
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'audio/webm',
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/ogg',
  'audio/mp4',
  'audio/x-m4a',
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_CHAT_FILE_SIZE = 25 * 1024 * 1024; // 25MB

const storage = multer.memoryStorage();

const buildFileFilter = (allowedMimes) => (_req, file, cb) => {
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(ApiError.badRequest(`Invalid file type: ${file.mimetype}. Allowed: ${allowedMimes.join(', ')}`), false);
  }
};

const fileFilter = buildFileFilter(ALLOWED_MIMES);
const chatFileFilter = buildFileFilter(CHAT_ALLOWED_MIMES);

/**
 * Single image upload middleware
 */
const uploadSingle = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
}).single('image');

/**
 * Multiple images upload middleware (max 6)
 */
const uploadMultiple = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
}).array('images', 6);

/**
 * Chat attachments upload middleware (images, videos, audio)
 */
const uploadChatAttachments = multer({
  storage,
  fileFilter: chatFileFilter,
  limits: { fileSize: MAX_CHAT_FILE_SIZE },
}).array('attachments', 5);

module.exports = { uploadSingle, uploadMultiple, uploadChatAttachments };
