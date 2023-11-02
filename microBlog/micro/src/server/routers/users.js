const express = require('express');
const { authenticateToken } = require('../auth');
const contentType = require('../contentType');
const user = require("../controller/userController")

const router = express.Router();
const { userValidator } = require('../expressValidator/userValidator')

router.post('/user/register', contentType, userValidator('userRegistration'), user.addUser);
router.put('/users/:id', contentType, authenticateToken, userValidator('updateUser'), user.editUser)
router.get('/user/:id', authenticateToken, user.viewUser)

router.get('/', authenticateToken, user.globalSearch)
module.exports = router;