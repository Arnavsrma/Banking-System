// seedPasswords.js
require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('./config/db');

async function run() {
  try {
    // plain passwords to set for sample users
    const seeds = [
      { email: 'banker@bank.local', password: 'Bank@123' },
      { email: 'alice@example.com', password: 'Cust@123' },
      { email: 'bob@example.com', password: 'Cust@123' }
    ];

    for (const s of seeds) {
      const hash = await bcrypt.hash(s.password, 10);
      await db.query('UPDATE Users SET password_hash = ? WHERE email = ?', [hash, s.email]);
      console.log(`Set password for ${s.email}`);
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
