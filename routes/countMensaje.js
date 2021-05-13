const { Router } = require('express');
const { check } = require('express-validator');
const { peticionCountMjs } = require('../controllers/socket.controllers');

const router = Router();

router.get('/:id', peticionCountMjs);

module.exports = router;