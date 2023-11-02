const LOGGER = require('../logger/logger.util');


function arrayPaginationFunction(limit, suppliedArray) {
    LOGGER.info('arrayPaginationFunction')
    try {
        let requiredArray = []
        for (let i = 0; i < limit; i++) {
            if (suppliedArray[i] != undefined) {
                requiredArray.push(suppliedArray[i])
            }
        }
        return requiredArray

    } catch (error) {
        LOGGER.error('arrayPaginationFunction', error)
    }
}

module.exports = {
    arrayPaginationFunction
}