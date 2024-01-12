const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const profileController = require('../controllers/profile')

router.post('/login', userController.login);
router.get('/profile/:id', profileController.getProfileByUserId);
router.get('/list', userController.getListUsers);

module.exports = router;