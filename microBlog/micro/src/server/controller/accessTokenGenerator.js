const LOGGER = require('../logger/logger.util');
const jwt = require('jsonwebtoken');

function accessTokenGenerator(params) {
    LOGGER.info('accessTokenGenerator');
    try {
        const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY;
        const userMail = params.email;
        const userId = params._id;
        const accessToken = jwt.sign(
            { email: userMail, id: userId },
            process.env.TokenKey,
            { expiresIn: accessTokenExpiry });
        return accessToken;
    } catch (error) {
        LOGGER.error('accessTokenGenerator', error);
    }
}
exports.accessTokenGenerator = accessTokenGenerator;
