const userModel = require('../models/userModel');

async function authenticateCustomer(req, res, next) {
  try {
    const auth = req.headers['authorization'];
    if (!auth) return res.status(401).json({ error: 'Missing Authorization header' });
    const token = auth.replace(/^Bearer\s+/i, '');
    const user = await userModel.findByToken(token);
    if (!user) return res.status(401).json({ error: 'Invalid token' });
    if (user.role !== 'customer') return res.status(403).json({ error: 'Forbidden' });
    // check expiry
    if (user.token_expiry && new Date(user.token_expiry) < new Date()) {
      return res.status(401).json({ error: 'Token expired' });
    }
    req.user = user;
    next();
  } catch (err) { next(err); }
}

async function authenticateBanker(req, res, next) {
  try {
    const auth = req.headers['authorization'];
    if (!auth) return res.status(401).json({ error: 'Missing Authorization header' });
    const token = auth.replace(/^Bearer\s+/i, '');
    const user = await userModel.findByToken(token);
    if (!user) return res.status(401).json({ error: 'Invalid token' });
    if (user.role !== 'banker') return res.status(403).json({ error: 'Forbidden' });
    if (user.token_expiry && new Date(user.token_expiry) < new Date()) {
      return res.status(401).json({ error: 'Token expired' });
    }
    req.user = user;
    next();
  } catch (err) { next(err); }
}

module.exports = { authenticateCustomer, authenticateBanker };
