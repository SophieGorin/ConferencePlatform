const express = require('express');
const router = express.Router();
const { getServices } = require('../controllers/serviceController');

// Получение списка услуг
router.get('/services', getServices);

module.exports = router;
