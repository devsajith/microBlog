const LOGGER = require('../../logger/logger.util');
const { removeSpecialCharactersAndSymbols, trimStrings } = require('../../generalFunctions/stringManipulations')
const { validateUserId } = require('../../generalFunctions/userIdValidation')
const blockingSchema = require('../../models/blocked_users')
const { ObjectId } = require('mongodb');
const { friendsErrorCodesAndMessages } = require('../../errorCatalogue/friendsErrorCatalogue')
const { status } = require('../../statusCatalogue/blockingStatus')


async function unblockingFunction(req, res) {
    LOGGER.info('unblockingFunction')
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
        const filter = { blocking_user: ObjectId(blockingUser), blocked_user: ObjectId(blockedUserId), blocking_status: status.BLOCKED }
        const updateValues = { blocking_status: status.UN_BLOCKED }
        const updateResult = await blockingSchema.findOneAndUpdate(filter, updateValues)
        if (updateResult == null) {
            return res.status(400).send([friendsErrorCodesAndMessages.NOT_BLOCKED])
        }

        return res.status(200).send({ message: "un-blocked" })
    } catch (error) {
        LOGGER.error('unblockingFunction', error)
    }
}

module.exports = {
    unblockingFunction
}