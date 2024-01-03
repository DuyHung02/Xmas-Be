const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message')

router.post('/conversations', messageController.getListConversations);
router.post('/send', messageController.createMessage);

module.exports = router;