// backend/src/routes/profile.js
const express = require('express');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

router.get('/', authenticate, (req, res) => {
  res.json({ username: req.user.username, email: req.user.email, role: req.user.role });
});

module.exports = router;