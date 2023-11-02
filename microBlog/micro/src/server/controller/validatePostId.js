const LOGGER = require('../logger/logger.util');
const { postErrorCodesAndMessages } = require('../errorCatalogue/postErrorCatalogue');
const regex = require('../regularExpressions/regularExpressions');

function validatePostId(postId) {
    LOGGER.info('validatePostId');
    try {
        let errorsArray = [];
        if (!postId) {
            const errorResponse = postErrorCodesAndMessages.ID_REQUIRED;
            errorsArray.push(errorResponse);
        } else {
            if (postId == null || postId == "") {
                const errorResponse = postErrorCodesAndMessages.INVALID_POST_ID;
                errorsArray.push(errorResponse);
            }
            if (!(postId.match(regex.regex.MONGO_DB_REGEX))) {
                const errorResponse = postErrorCodesAndMessages.INVALID_POST_ID;
                errorsArray.push(errorResponse);
            }
        }
        LOGGER.info('validation success');
        return errorsArray;
    } catch (error) { LOGGER.error('validatePostId', error); }
}
exports.validatePostId = validatePostId;
