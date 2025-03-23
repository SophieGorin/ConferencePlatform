const express = require('express');
const router = express.Router();
const { getAllOrders, updateOrderStatus } = require('../controllers/adminController');
const verifyToken = require('../utils/validate');

// Получение всех заявок (только для администраторов)
router.get('/admin', verifyToken, getAllOrders);

// Обновление статуса заявки
router.put('/admin/:orderId/status', verifyToken, updateOrderStatus);

module.exports = router;
