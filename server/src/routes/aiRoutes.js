const express = require('express');
const router = express.Router();
const {
  chat,
  processVoice,
  speechToText,
  textToSpeech,
  translate,
} = require('../controllers/aiController');
const { optionalProtect } = require('../middleware/authMiddleware');
const { uploadAudio } = require('../middleware/uploadMiddleware');
const { voiceUploadLimiter } = require('../middleware/rateLimiter');

router.post('/chat', optionalProtect, chat);
router.post('/voice', voiceUploadLimiter, optionalProtect, uploadAudio.single('audio'), processVoice);
router.post('/speech-to-text', uploadAudio.single('audio'), speechToText);
router.post('/text-to-speech', textToSpeech);
router.post('/translate', translate);

module.exports = router;
