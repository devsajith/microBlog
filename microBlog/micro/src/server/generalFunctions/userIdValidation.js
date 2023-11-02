const { userErrorCodesAndMessages } = require('../errorCatalogue/userErrorCatalogue');
const LOGGER = require('../logger/logger.util');
const regex = require('../regularExpressions/regularExpressions')


function validateUserId(userId) {
    LOGGER.info('validateUserId');

    let errorsArray = [];

    if (!userId || typeof userId !== 'string') {
        errorsArray.push(userErrorCodesAndMessages.USER_ID_REQUIRED);
    }
    if (!userId.match(regex.regex.MONGO_DB_REGEX)) {
        errorsArray.push(userErrorCodesAndMessages.INVALID_USER_ID);
    }

    if (errorsArray.length !== 0) {
        return errorsArray;
    }

    try {
        // Rest of the code here...
    } catch (error) {
        LOGGER.error('validateUserId', error);
    }
}


module.exports = {
    validateUserId
}