const LOGGER = require('../logger/logger.util');
const jwt = require('jsonwebtoken');

function prepareToSaveAccessTokenAndRefreshToken(user, accessToken, refreshToken) {
    LOGGER.info('prepareToSaveAccessTokenAndRefreshToken');
    try {
        const tokenExpiryTime = jwt.decode(accessToken).exp;
        const tokenStorage = {
            user: user._id,
            token: accessToken,
            refresh_token: refreshToken,
            create_date: new Date().getTime(),
            update_date: new Date().getTime(),
            expiry: tokenExpiryTime,
        };
        return tokenStorage;
    } catch (error) {
        LOGGER.error('prepareToSaveAccessTokenAndRefreshToken', error);
    }
}
exports.prepareToSaveAccessTokenAndRefreshToken = prepareToSaveAccessTokenAndRefreshToken;
