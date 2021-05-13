const { Router } = require('express');
const { check } = require('express-validator');
const { guardarSubscriptionUser, obtenerUserSubscrito } = require('../controllers/pushSubscription');


const router = Router();

router.post('/guardar-subscripcion', guardarSubscriptionUser);

// Obtener usuario suscrito
router.get('/:id', obtenerUserSubscrito);


module.exports = router;