const express = require('express');
const router = express.Router();
const bankerCtrl = require('../controllers/bankerController');
const { authenticateBanker } = require('../middleware/authMiddleware');

router.get('/accounts', authenticateBanker, bankerCtrl.listAccounts);
router.get('/accounts/:userId/transactions', authenticateBanker, bankerCtrl.getUserTransactions);

module.exports = router;
