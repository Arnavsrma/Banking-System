const bcrypt = require('bcrypt');
const crypto = require('crypto');
const userModel = require('../models/userModel');

const TOKEN_EXPIRY_HOURS = parseInt(process.env.TOKEN_EXPIRY_HOURS || '24', 10);

function generateAccessToken36() {
  // 18 bytes in hex => 36 chars
  return crypto.randomBytes(18).toString('hex');
}

async function customerLogin(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const user = await userModel.findByEmail(email);
  if (!user || user.role !== 'customer') return res.status(401).json({ error: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });

  const token = generateAccessToken36();
  const expiry = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 3600 * 1000);
  await userModel.setToken(user.id, token, expiry);

  res.json({ access_token: token, expires_at: expiry.toISOString(), user: { id: user.id, name: user.name, email: user.email } });
}

async function bankerLogin(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const user = await userModel.findByEmail(email);
  if (!user || user.role !== 'banker') return res.status(401).json({ error: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });

  const token = generateAccessToken36();
  const expiry = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 3600 * 1000);
  await userModel.setToken(user.id, token, expiry);

  res.json({ access_token: token, expires_at: expiry.toISOString(), user: { id: user.id, name: user.name, email: user.email } });
}

module.exports = { customerLogin, bankerLogin };
