const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.resolve(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

// Audio filter
const audioFileFilter = (req, file, cb) => {
  const allowedMimes = [
    'audio/wav',
    'audio/x-wav',
    'audio/webm',
    'audio/ogg',
    'audio/mpeg',
    'audio/mp3',
    'audio/mp4',
    'audio/m4a',
    'audio/aac',
    'audio/flac',
  ];

  if (allowedMimes.includes(file.mimetype) || file.originalname.match(/\.(wav|mp3|ogg|webm|m4a|aac)$/i)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid audio format. Supported formats: WAV, WebM, MP3, OGG, M4A.'), false);
  }
};

// Document filter
const documentFileFilter = (req, file, cb) => {
  const allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'image/jpeg',
    'image/png',
  ];

  if (allowedMimes.includes(file.mimetype) || file.originalname.match(/\.(pdf|doc|docx|txt|jpg|jpeg|png)$/i)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid document format. Allowed: PDF, DOC, DOCX, TXT, JPG, PNG.'), false);
  }
};

const uploadAudio = multer({
  storage,
  fileFilter: audioFileFilter,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB
});

const uploadDocument = multer({
  storage,
  fileFilter: documentFileFilter,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB
});

module.exports = { uploadAudio, uploadDocument };
