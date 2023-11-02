const LOGGER = require('../../logger/logger.util');
const { removeSpecialCharactersAndSymbols, trimStrings } = require('../../generalFunctions/stringManipulations')
const { validatePageId } = require('../../generalFunctions/pageIdValidations')
const { pageErrorCodesAndMessages } = require('../../errorCatalogue/pageErrorCatalogue')
const pagesSchema = require('../../models/page');
const { ObjectId } = require('mongodb');
const { pageStatus } = require('../../statusCatalogue/pageStatus')
const { following } = require('../../generalStatusCatalogue/followingStatus')

async function followPageFunction(req, res) {
    LOGGER.info('followPageFunction')
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
        if ((page.followers.includes(userId.toString())) && (index !== -1)) {
            return res.status(200).send([following.ALREADY_FOLLOWING])
        } else {
            page.followers.push(userId)
            await page.save()
            return res.status(200).send([following.FOLLOW_SUCCESS])
        }

    } catch (error) {
        LOGGER.error('followPageFunction', error)
    }
}

module.exports = {
    followPageFunction
}