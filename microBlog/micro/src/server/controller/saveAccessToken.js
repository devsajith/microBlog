const LOGGER = require('../logger/logger.util');
const jwt = require('jsonwebtoken');

function saveAccessToken(user, accessToken) {
    LOGGER.info('saveAccessToken');
    try {
        const tokenExpiryTime = jwt.decode(accessToken).exp;
        const tokenStorage = {
            user: user._id,
            token: accessToken,
            create_date: new Date().getTime(),
            update_date: new Date().getTime(),
            expiry: tokenExpiryTime,
        };
        return tokenStorage;
    } catch (error) {
        LOGGER.error('saveAccessToken', error);
    }
}
exports.saveAccessToken = saveAccessToken;
