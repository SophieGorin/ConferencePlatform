const express = require('express');
const router = express.Router();
const { createOrder, getOrders } = require('../controllers/orderController');
const verifyToken = require('../utils/validate');

// Создание заявки
router.post('/orders', verifyToken, createOrder);

// История заявок пользователя
router.get('/orders', verifyToken, getOrders);

module.exports = router;
