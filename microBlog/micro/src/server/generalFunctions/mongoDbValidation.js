const regex = require('../regularExpressions/regularExpressions')
const LOGGER = require('../logger/logger.util');

function idValidation(mongoDbId) {
    LOGGER.info('idValidation')
    try {
        const FAIL = 0;
        const PASS = 1;
        if (!(mongoDbId.match(regex.regex.MONGO_DB_REGEX))) {
            return { FAIL, mongoDbId }
        }
        return { PASS, mongoDbId }

    } catch (error) {
        LOGGER.error('idValidation', error)
    }
}


module.exports = {
    idValidation

}