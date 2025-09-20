// config/db.js
// Updated: use per-query connections (no pool)
const mysql = require('mysql2/promise');
require('dotenv').config();

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'Bank',
  // optionally set connectTimeout, charset, etc.
};

async function query(sql, params = []) {
  let conn;
  try {
    conn = await mysql.createConnection(DB_CONFIG);
    const [rows] = await conn.execute(sql, params);
    await conn.end();
    return [rows];
  } catch (err) {
    if (conn) {
      try { await conn.end(); } catch (e) { /* ignore */ }
    }
    throw err;
  }
}

// Export an object with a .query method so existing code that uses db.query(...) keeps working.
module.exports = {
  query
};
