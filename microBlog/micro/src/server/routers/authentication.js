const express = require('express');
const authRouter = express.Router();
const contentType = require('../contentType');
const { authenticateToken } = require('../auth')
const authControll = require('../controller/authController');

authRouter.post('/login', contentType, authControll.userLogin)
authRouter.post('/admin/login', contentType, authControll.adminLogin)
authRouter.post('/user/forgot-password', contentType, authControll.forgotPasswordRequest)
authRouter.post('/user/password-otpverify', contentType, authControll.verifyotp)
authRouter.post('/user/reset-success', contentType, authControll.resetPassword)
authRouter.post('/logout-all', authenticateToken, authControll.logoutFromAll)
authRouter.post('/logout', authenticateToken, authControll.logout)
authRouter.put('/auth/refreshaccesstoken', contentType, authControll.generateAccessTokenFromRefreshToken)
authRouter.post('/auth/userdetails',contentType,authenticateToken,authControll.getUserWithEmail)

module.exports = authRouter;