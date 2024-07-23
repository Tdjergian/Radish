const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUser } = require('../controllers/userController');
const { protect, verifyCookie } = require('../controllers/authController');
const { deleteCookie } = require('../controllers/cookieController');

router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/user', protect, getUser);
router.get('/verifyCookie', verifyCookie, (req, res) => {
  res.status(200).json(res.locals.user);
});
router.get('/logout', deleteCookie, (req, res) => {
  res.status(200).json({ message: 'Logged out' });
});

module.exports = router;