const express = require('express');
const { register, login } = require('../controllers/authController');
const { validateAuthBody } = require('../middleware/validate');

const router = express.Router();

router.post('/register', validateAuthBody, register);
router.post('/login', validateAuthBody, login);

module.exports = router;
