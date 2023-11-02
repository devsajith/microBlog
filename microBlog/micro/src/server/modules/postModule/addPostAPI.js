const LOGGER = require('../../logger/logger.util');
const { trimStrings } = require('../../generalFunctions/stringManipulations')
const { postErrorCodesAndMessages } = require('../../errorCatalogue/postErrorCatalogue')
const { isUrl } = require('../../generalFunctions/isUrlTest')
const { validatePageId } = require('../../generalFunctions/pageIdValidations')
const pageSchema = require('../../models/page');
const { ObjectId } = require('mongodb');
const { pageErrorCodesAndMessages } = require('../../errorCatalogue/pageErrorCatalogue')
const { ACTIVE } = require('../../generalStatusCatalogue/postsStatus')
const postsSchema = require('../../models/posts')

async function addPostFunction(req, res) {
    LOGGER.info('addPostFunction')
    try {
        const pageId = req.body.pageId
        let errorsArray = [];
        const textCharacterLimit = 3000;
        const SUCCESS_MESSAGE = { message: "post successfully added" };
        const userId = req.user.id;
        const text = trimStrings(req.body.text);
        const imageUrl = trimStrings(req.body.imageUrl);

        if ((text == null || text == "") && (imageUrl == null || imageUrl == "")) {
            errorsArray.push(postErrorCodesAndMessages.NOTHING_TO_POST)
        }
        if (text) {
            if (text.length > textCharacterLimit) {
                errorsArray.push(postErrorCodesAndMessages.INVALID_TEXT)
            }

        }
        if (imageUrl) {

            if (isUrl(imageUrl) == false) {
                errorsArray.push(postErrorCodesAndMessages.INVALID_PHOTO_URL)
            }
        }
        if (pageId) {
            const pageIdValidationResult = validatePageId(pageId)
            if (pageIdValidationResult) {
                errorsArray.push(pageIdValidationResult)
            }
            const pageResult = await pageSchema
                .findOne({ _id: ObjectId(pageId) })
            if (!pageResult) {
                errorsArray.push(pageErrorCodesAndMessages.INVALID_ID)
            }

        }
        if (errorsArray.length != 0) {
            return res.status(400).send(errorsArray)
        }
        const Payload = {
            text: text,
            imageUrl: imageUrl,
            user_id: userId,
            created_date: new Date().getTime(),
            updated_date: new Date().getTime(),
            status: ACTIVE,
            shared_by:[]
        }
        if (pageId) {
            Payload.page_id = pageId
        }
        const postPayload = new postsSchema(Payload)
        await postPayload.save();
        res.status(200).send(SUCCESS_MESSAGE)

    } catch (error) {
        LOGGER.error('addPostFunction', error)
    }
}

module.exports = {
    addPostFunction
}