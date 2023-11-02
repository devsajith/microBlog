/* eslint-disable no-undef */
const jwt = require('jsonwebtoken')
const LOGGER = require('./logger/logger.util')
const userTokens = require('./models/user_token')
const User = require('./models/userModel');
const { authErrorCodesAndMessages } = require('./errorCatalogue/authErrorCatalogue');
const authenticateToken = async (req, res, next) => {
    LOGGER.info('authenticateToken is called')
    if (!req.headers.authorization) {
        LOGGER.error('error authorization 1', authErrorCodesAndMessages.TOKEN_REQUIRED)
        return res.status(403).send(authErrorCodesAndMessages.TOKEN_REQUIRED);
    }
    else {
        const authHeader = req.headers['authorization']
        const token = authHeader.split(' ')[1];
        if (token == null) {
            LOGGER.error('error authorization', authErrorCodesAndMessages.TOKEN_REQUIRED)
            return res.status(403).send(authErrorCodesAndMessages.TOKEN_REQUIRED);
        } else {
            try {
                const decoded = jwt.verify(token, process.env.TokenKey);
                req.user = await User.findOne({ "email": decoded.email, status: 1 })
                const usersToken = await userTokens.findOne({ token: token, black_list: 0 })
                if (!usersToken) {
                    return res.status(403).send(authErrorCodesAndMessages.ACCESS_DENIED);
                }
            } catch (error) {
                if (error.message == 'invalid signature' || error.message == 'invalid token') {
                    LOGGER.error('error authorization', { message: "Access Denied" })
                    return res.status(403).send(authErrorCodesAndMessages.ACCESS_DENIED);
                } else {
                    LOGGER.error('error authorization', { message: "token expired" })
                    return res.status(403).send(authErrorCodesAndMessages.REFRESH_TOKEN_EXPIRED);
                }
            }
            return next();
        }
    }
}
module.exports = {
    authenticateToken
}