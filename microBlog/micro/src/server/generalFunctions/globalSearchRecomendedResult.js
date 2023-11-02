const LOGGER = require('../logger/logger.util')
const { userSearchQuery } = require('../generalFunctions/globalpaginatedUserSearch')
const { pageSearchQuery } = require('../generalFunctions/globalPaginatedPageSearch')
const { trimStrings } = require('../generalFunctions/stringManipulations')
async function globalSearchRecomendedResultFunction(req, res) {
    LOGGER.info('globalSearchRecomendedResultFunction')
    try {
        const search = trimStrings(req.query.search) || ""
        let balanceFromTen
        let userArrayLength
        let pageResponseRecomended
        let pageArray
        let combinedArray
        let slicedUserArray
        const escapedPattern = search.replace(' ', '\\+');
        const projection = { userName: 1, email: 1, gender: 1, photo: 1, about: 1 }
        const userResponseRecomended = await userSearchQuery(escapedPattern, projection)
        let userArray = userResponseRecomended
        slicedUserArray = userArray.slice(0, 10);

        if (slicedUserArray.length < 10) {
            balanceFromTen = 10 - userArrayLength
            pageResponseRecomended = await pageSearchQuery(search, balanceFromTen)
            pageArray = pageResponseRecomended
            combinedArray = [...slicedUserArray, ...pageArray]
            return res.status(200).send(combinedArray)
        }
        return res.status(200).send(slicedUserArray)
    } catch (error) {
        LOGGER.error('globalSearchRecomendedResultFunction', error)
    }
}

module.exports = {
    globalSearchRecomendedResultFunction
}