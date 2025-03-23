const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// Маршрут для регистрации
router.post('/register', register);

// Маршрут для входа
router.post('/login', login);

module.exports = router;
