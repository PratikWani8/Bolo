const express = require('express');
const router = express.Router();
const {
  getKnowledgeDocuments,
  uploadKnowledgeDocument,
  deleteKnowledgeDocument,
  reprocessKnowledgeDocument,
} = require('../controllers/knowledgeController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { uploadDocument } = require('../middleware/uploadMiddleware');

router.get('/', getKnowledgeDocuments);

// Admin-only endpoints
router.post('/upload', protect, authorize('admin'), uploadDocument.single('file'), uploadKnowledgeDocument);
router.delete('/:id', protect, authorize('admin'), deleteKnowledgeDocument);
router.post('/:id/reprocess', protect, authorize('admin'), reprocessKnowledgeDocument);

module.exports = router;
