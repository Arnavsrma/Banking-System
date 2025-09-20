const db = require('../config/db');

async function findByEmail(email) {
  const [rows] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
  return rows[0];
}

async function findByToken(token) {
  const [rows] = await db.query('SELECT * FROM Users WHERE access_token = ?', [token]);
  return rows[0];
}

async function findById(id) {
  const [rows] = await db.query('SELECT * FROM Users WHERE id = ?', [id]);
  return rows[0];
}

async function setToken(userId, token, expiry) {
  await db.query('UPDATE Users SET access_token = ?, token_expiry = ? WHERE id = ?', [token, expiry, userId]);
}

async function clearToken(userId) {
  await db.query('UPDATE Users SET access_token = NULL, token_expiry = NULL WHERE id = ?', [userId]);
}

module.exports = {
  findByEmail,
  findByToken,
  findById,
  setToken,
  clearToken
};
