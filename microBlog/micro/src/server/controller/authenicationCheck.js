const LOGGER = require('../logger/logger.util');
const { authErrorCodesAndMessages } = require('../errorCatalogue/authErrorCatalogue');

function authenicationCheck(userId, authorOfPostId) {
    LOGGER.info('authenicationCheck');
    try {
        const userIdInternal = userId.toString();
        const authorOfPostIdInternal = authorOfPostId.toString();
        if (userIdInternal != authorOfPostIdInternal) {
            const errorResponse = authErrorCodesAndMessages.ACCESS_DENIED;
            return errorResponse;
        }
    } catch (error) { LOGGER.error('authenicationCheck', error); }
}
exports.authenicationCheck = authenicationCheck;
