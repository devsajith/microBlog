const LOGGER = require('../logger/logger.util');
const regex = require('../regularExpressions/regularExpressions')
const {commentErrorCodesAndMessages} = require('../errorCatalogue/commentErrorCatalogue')

function validateCommentId(commentId) {
    LOGGER.info('validateCommentId')
    try {
        let errorsArray = []
        if (!commentId) {
            const errorResponse = commentErrorCodesAndMessages.ID_REQUIRED;
            errorsArray.push(errorResponse)
        }
        if (commentId == null || commentId == "") {
            const errorResponse = commentErrorCodesAndMessages.INVALID_ID;
            errorsArray.push(errorResponse)
        }
        if (!(commentId.match(regex.regex.MONGO_DB_REGEX))) {
            const errorResponse = commentErrorCodesAndMessages.INVALID_ID;
            errorsArray.push(errorResponse)
        }
        return errorsArray
    } catch (error) {
        LOGGER.error('validateCommentId', error)
    }
}

module.exports = {
    validateCommentId
}