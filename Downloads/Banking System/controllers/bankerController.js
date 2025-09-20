const accountModel = require('../models/accountModel');

async function listAccounts(req, res) {
  const accounts = await accountModel.getAllAccounts();
  res.json({ accounts });
}

async function getUserTransactions(req, res) {
  const { userId } = req.params;
  const tx = await accountModel.getAllTransactionsForUser(userId);
  const balance = await accountModel.getLatestBalance(userId);
  res.json({ transactions: tx, balance });
}

module.exports = { listAccounts, getUserTransactions };
