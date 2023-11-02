const LOGGER = require('../logger/logger.util')

function filterOutCurrentUserFromSearchResult(preResponseResult, userId) {
    LOGGER.info('filterOutCurrentUserFromSearchResult')
    try {
        let responseResult = []
        for (let i = 0; i < preResponseResult.length; i++) {
            const proposition1 = (preResponseResult[i].requested_user == null)
            const proposition2 = (preResponseResult[i].reciever_user?._id == userId)
            const proposition3 = (preResponseResult[i].reciever_user == null)
            const proposition4 = (preResponseResult[i].requested_user?._id == userId)

            if (!(((proposition1) || (proposition3)) && ((proposition2) || (proposition4)))) {
                responseResult.push(preResponseResult[i])
            }
        }
        return responseResult
    } catch (error) {
        LOGGER.error('filterOutCurrentUserFromSearchResult', error)
    }
}

module.exports = {
    filterOutCurrentUserFromSearchResult
}