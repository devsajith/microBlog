const LOGGER = require('../logger/logger.util');
const jwt = require('jsonwebtoken');

function refreshTokenGenerator(params) {
    LOGGER.info('refreshTokenGenerator');
    try {
        const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY;
        const userMail = params.email;
        const userId = params._id;
        const refreshToken = jwt.sign(
            { email: userMail, id: userId },
            process.env.TokenKey,
            { expiresIn: refreshTokenExpiry });
        return refreshToken;
    } catch (error) {
        LOGGER.error('refreshTokenGenerator', error);
    }
}
exports.refreshTokenGenerator = refreshTokenGenerator;
