const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/customer/login', authController.customerLogin);
router.post('/banker/login', authController.bankerLogin);

module.exports = router;
