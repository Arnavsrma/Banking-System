const accountModel = require('../models/accountModel');

async function getTransactions(req, res) {
  const user = req.user; // set by authMiddleware
  const transactions = await accountModel.getAllTransactionsForUser(user.id);
  const balance = await accountModel.getLatestBalance(user.id);
  res.json({ transactions, balance });
}

async function deposit(req, res) {
  const user = req.user;
  const { amount } = req.body;
  const num = parseFloat(amount);
  if (isNaN(num) || num <= 0) return res.status(400).json({ error: 'Invalid amount' });

  const prev = await accountModel.getLatestBalance(user.id);
  const newBalance = prev + num;
  const id = await accountModel.addTransaction(user.id, 'deposit', num, newBalance, 'Deposit by customer');
  res.json({ success: true, transactionId: id, balance: newBalance });
}

async function withdraw(req, res) {
  const user = req.user;
  const { amount } = req.body;
  const num = parseFloat(amount);
  if (isNaN(num) || num <= 0) return res.status(400).json({ error: 'Invalid amount' });

  const prev = await accountModel.getLatestBalance(user.id);
  if (num > prev) return res.status(400).json({ error: 'Insufficient Funds' });

  const newBalance = prev - num;
  const id = await accountModel.addTransaction(user.id, 'withdraw', num, newBalance, 'Withdrawal by customer');
  res.json({ success: true, transactionId: id, balance: newBalance });
}

module.exports = { getTransactions, deposit, withdraw };
