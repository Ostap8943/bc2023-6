const express = require('express');
const router = express.Router();
const User = require('../models/user');
const multer = require('multer');
const upload = multer();
const users = [];

router.get('/', (req, res) => {
  const allUsers = users.map(user => ({
    userId: user.userId,
    userName: user.userName,
  }));
  res.status(200).json(allUsers);
});

router.post('/', (req, res) => {
  const { userId, userName } = req.body;
  const newUser = new User(userId, userName);
  users.push(newUser);
  res.status(201).json(newUser);
});

module.exports = router;

