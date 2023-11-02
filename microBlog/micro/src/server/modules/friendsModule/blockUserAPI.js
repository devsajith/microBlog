const LOGGER = require('../../logger/logger.util');
const { removeSpecialCharactersAndSymbols, trimStrings } = require('../../generalFunctions/stringManipulations')
const { validateUserId } = require('../../generalFunctions/userIdValidation')
const blockingSchema = require('../../models/blocked_users')
const { ObjectId } = require('mongodb');
const { friendsErrorCodesAndMessages } = require('../../errorCatalogue/friendsErrorCatalogue')
const { status } = require('../../statusCatalogue/blockingStatus')


async function blockUserFunction(req, res) {
    LOGGER.info('blockUserFunction')
    try {
        const blockingUser = req.user.id;
        const blockedUserId = removeSpecialCharactersAndSymbols(trimStrings(req.params.id))
        const idValidationResult = validateUserId(blockedUserId)

        if (blockedUserId == blockingUser) {
            return res.status(400).send([friendsErrorCodesAndMessages.INVALID_ID])
        }
        if (idValidationResult) {
            return res.status(400).send(idValidationResult)
        }
        const existingBlockRecord = await blockingSchema
            .findOne({ blocking_user: ObjectId(blockingUser), blocked_user: ObjectId(blockedUserId), blocking_status: status.BLOCKED })
        if (existingBlockRecord) {
            return res.status(400).send([friendsErrorCodesAndMessages.ALREADY_BLOCKED])
        }
        const payload = {
            blocking_user: blockingUser,
            blocked_user: blockedUserId,
            blocking_status: status.BLOCKED
        }
        await new blockingSchema(payload).save();
        return res.status(200).send({ message: "blocked" })
    } catch (error) {
        LOGGER.error('blockUserFunction', error)
    }
}

module.exports = {
    blockUserFunction
}