const { Router } = require('express');
const { newMessage } = require('../controllers/webpush');

const router = Router();

// Notificacion de un nuevo mensaje
router.post('/new-message', newMessage);

module.exports = router;