const express = require('express');
const router = express.Router();
const custCtrl = require('../controllers/customerController');
const { authenticateCustomer } = require('../middleware/authMiddleware');

router.get('/transactions', authenticateCustomer, custCtrl.getTransactions);
router.post('/deposit', authenticateCustomer, custCtrl.deposit);
router.post('/withdraw', authenticateCustomer, custCtrl.withdraw);

module.exports = router;
