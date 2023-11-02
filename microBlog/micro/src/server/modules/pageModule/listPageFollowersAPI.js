const LOGGER = require('../../logger/logger.util');
const { removeSpecialCharactersAndSymbols, trimStrings } = require('../../generalFunctions/stringManipulations')
const { validatePageId } = require('../../generalFunctions/pageIdValidations')
const { pageErrorCodesAndMessages } = require('../../errorCatalogue/pageErrorCatalogue')
const pagesSchema = require('../../models/page');
const { ObjectId } = require('mongodb');
const { pageStatus } = require('../../statusCatalogue/pageStatus')
const { compareUserNames } = require('../../generalFunctions/usernameComparison')
const { arrayPaginationFunction } = require('../../generalFunctions/paginationOfArrays')

// const { following } = require('../../generalStatusCatalogue/followingStatus')


async function listPageFollowersFunction(req, res) {
    LOGGER.info('listPageFollowersFunction')
    try {
        // const NO_DATA = "no data found"

        const limit = parseInt(req.query.limit) || 20;
        const skip = parseInt(req.query.skip) || 0;
        const pageId = removeSpecialCharactersAndSymbols(trimStrings(req.params.id))
        if (pageId == null || pageId == "") {
            return res.status(400).send([pageErrorCodesAndMessages.PAGE_ID_REQUIRED])
        }
        let errorsArray = validatePageId(pageId)
        if (errorsArray) {
            return res.status(400).send(errorsArray)
        }

        const query = { _id: ObjectId(pageId), status: pageStatus.ACTIVE }
        const page = await pagesSchema
            .findOne(query)
            .populate('followers', '_id email userName photo')
        if (!page) {
            return res.status(404).send([pageErrorCodesAndMessages.PAGE_NOT_FOUND])
        }
        const followerArray = page.followers

        let responseResult = []
        for (let i = 0; i < followerArray.length; i++) {
            if (followerArray[i].userName != null || followerArray[i].userName != null) {
                responseResult.push(followerArray[i])
            }
        }
        const sortUserResult = responseResult.sort(compareUserNames)
        let skipResult = sortUserResult.slice(skip)
        let finalResult = arrayPaginationFunction(limit, skipResult)
        const count = sortUserResult.length

        if ((count - skip) > limit) {
            const next = parseInt(skip + limit)
            return res.status(200).send({ message: "sucess", count: count, 'skip': next, users: finalResult })

        } else {
            return res.status(200).send({ message: "sucess", count: count, users: finalResult })

        }
    } catch (error) {
        LOGGER.error('listPageFollowersFunction', error)
    }
}

module.exports = {
    listPageFollowersFunction
}