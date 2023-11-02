const { pageErrorCodesAndMessages } = require('../errorCatalogue/pageErrorCatalogue');
const LOGGER = require('../logger/logger.util');
const regex = require('../regularExpressions/regularExpressions')


function validatePageId(userId) {
    LOGGER.info('validatePageId');

    try {
        let errorsArray = [];

        // if (!userId || typeof userId !== 'string') {
        //     errorsArray.push(userErrorCodesAndMessages.USER_ID_REQUIRED);
        // }
        if (!userId.match(regex.regex.MONGO_DB_REGEX)) {
            errorsArray.push(pageErrorCodesAndMessages.INVALID_ID);
        }

        if (errorsArray.length !== 0) {
            return errorsArray;
        }
        let errorsArrayNull = null
        return errorsArrayNull
    } catch (error) {
        LOGGER.error('validatePageId', error);
    }
}

module.exports = {
    validatePageId
}