const LOGGER = require('../../logger/logger.util');
const pagesSchema = require('../../models/page')
const { pageErrorCodesAndMessages } = require('../../errorCatalogue/pageErrorCatalogue')
const { comparePageNames } = require('../../generalFunctions/pageNameComparison')
const { arrayPaginationFunction } = require('../../generalFunctions/paginationOfArrays')
const { pageStatus } = require('../../statusCatalogue/pageStatus');

async function listPagesFollowedByAUserFunction(req, res) {
    LOGGER.info('listPagesFollowedByAUserFunction')
    try {
        const limit = parseInt(req.query.limit) || 20;
        const skip = parseInt(req.query.skip) || 0;
        const currentUser = req.user.id;
        // const pages = await pagesSchema.findOne({ 'followers': { $elemMatch: currentUser } })
        const page = await pagesSchema.find({ followers: { $in: [currentUser] },status: pageStatus.ACTIVE })
        if (!page) {
            return res.status(404).send([pageErrorCodesAndMessages.PAGE_NOT_FOUND])
        }
        const followerArray = page

        let responseResult = []
        for (let i = 0; i < followerArray.length; i++) {
            if (followerArray[i].page_name != null || followerArray[i].page_name != null) {
                responseResult.push(followerArray[i])
            }
        }
        const sortUserResult = responseResult.sort(comparePageNames)
        let skipResult = sortUserResult.slice(skip)
        let finalResult = arrayPaginationFunction(limit, skipResult)
        const count = sortUserResult.length

        if ((count - skip) > limit) {
            const next = parseInt(skip + limit)
            return res.status(200).send({ message: "sucess", count: count, 'skip': next, pages: finalResult })

        } else {
            return res.status(200).send({ message: "sucess", count: count, pages: finalResult })

        }
    } catch (error) {
        LOGGER.error('listPagesFollowedByAUserFunction', error)
    }
}

module.exports = {
    listPagesFollowedByAUserFunction
}