const LOGGER = require('../../logger/logger.util');
const { trimStrings } = require('../../generalFunctions/stringManipulations');
const { globalPaginatedUserSearchFunction } = require('../../generalFunctions/globalpaginatedUserSearch')
const { globalpaginatedPageSearchFunction } = require('../../generalFunctions/globalPaginatedPageSearch')
const { globalSearchRecomendedResultFunction } = require('../../generalFunctions/globalSearchRecomendedResult')

async function globalSearchFunction(req, res) {
    LOGGER.info('globalSearchFunction')
    try {

        const limit = parseInt(req.query.limit)
        const filter = trimStrings(req.query.filter)

        let userResponse
        let pageResponse
        let result


        if (limit) {
            switch (filter) {
                case 'user':
                    userResponse = globalPaginatedUserSearchFunction(req, res)
                    return userResponse

                case 'page':
                    pageResponse = globalpaginatedPageSearchFunction(req, res)
                    return pageResponse

                default:
                    userResponse = globalPaginatedUserSearchFunction(req, res)
                    return userResponse
            }
        } else {
            result = globalSearchRecomendedResultFunction(req, res)
            return result
        }

    } catch (error) {
        LOGGER.error('globalSearchFunction', error)
    }
}

module.exports = {
    globalSearchFunction
}