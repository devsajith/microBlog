const LOGGER = require('../../logger/logger.util');
const { removeSpecialCharactersAndSymbols, trimStrings } = require('../../generalFunctions/stringManipulations')
const { validatePageId } = require('../../generalFunctions/pageIdValidations')
const { pageErrorCodesAndMessages } = require('../../errorCatalogue/pageErrorCatalogue')
const pagesSchema = require('../../models/page');
const { ObjectId } = require('mongodb');
const { pageStatus } = require('../../statusCatalogue/pageStatus')
const { following } = require('../../generalStatusCatalogue/followingStatus')


async function unfollowFunction(req, res) {
    LOGGER.info('unfollowFunction')
    try {
        const userId = req.user._id
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
        if (!page) {
            return res.status(404).send([pageErrorCodesAndMessages.PAGE_NOT_FOUND])
        }
        let index = page.followers.indexOf(userId.toString())
        if (page.followers.includes(userId.toString()) && (index !== -1)) {
            page.followers.splice(index, 1)
            await page.save()
            return res.status(200).send([following.UNFOLLOWED])
        } else {
            return res.status(200).send([following.NOT_FOLLOWED])
        }
    } catch (error) {
        LOGGER.error('unfollowFunction', error)
    }
}

module.exports = {
    unfollowFunction
}