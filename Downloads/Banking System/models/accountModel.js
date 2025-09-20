const db = require('../config/db');

async function getAllTransactionsForUser(userId) {
  const [rows] = await db.query('SELECT * FROM Accounts WHERE user_id = ? ORDER BY created_at DESC', [userId]);
  return rows;
}

async function getLatestBalance(userId) {
  const [rows] = await db.query('SELECT balance_after FROM Accounts WHERE user_id = ? ORDER BY id DESC LIMIT 1', [userId]);
  if (rows.length === 0) return 0.00;
  return parseFloat(rows[0].balance_after);
}

async function addTransaction(userId, type, amount, balanceAfter, note = null) {
  const [result] = await db.query(
    'INSERT INTO Accounts (user_id, type, amount, balance_after, note) VALUES (?, ?, ?, ?, ?)',
    [userId, type, amount, balanceAfter, note]
  );
  return result.insertId;
}

async function getAllAccounts() {
  // list of users and their latest balance
  const [rows] = await db.query(`
    SELECT u.id, u.name, u.email, IFNULL(a.balance_after,0) AS balance
    FROM Users u
    LEFT JOIN (
      SELECT user_id, balance_after
      FROM Accounts
      WHERE id IN (SELECT MAX(id) FROM Accounts GROUP BY user_id)
    ) a ON u.id = a.user_id
    WHERE u.role = 'customer'
  `);
  return rows;
}

module.exports = {
  getAllTransactionsForUser,
  getLatestBalance,
  addTransaction,
  getAllAccounts
};
