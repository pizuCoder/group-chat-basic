// login.js

const express = require('express');
const router = express.Router();

router.get('/login', (req, res, next) => {
  res.send(`
    <form action="/login" method="POST">
      <input type="text" name="username" placeholder="Username">
      <button type="submit">Login</button>
    </form>
  `);
});

router.post('/login', (req, res, next) => {
  const username = req.body.username;
  // Store username in local storage
  res.cookie('username', username);
  res.redirect('/messages');
});

module.exports = router;
