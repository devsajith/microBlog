const LOGGER = require('../../logger/logger.util');
const friendRequestStatus = require('../../statusCatalogue/requestStatusCatalogue')
const friendRequestsSchema = require('../../models/friend_list')
const { ObjectId } = require('mongodb');
const friendRequestErrors = require('../../errorCatalogue/friendsErrorCatalogue');
const userIdValidation = require('../../generalFunctions/userIdValidation')
async function unfriendFunction(req, res) {
    LOGGER.info('unfriendFunction')
    try {
        const friendId = req.params.friend_id;
        const userId = req.user.id;
        const userIdValidationResult = userIdValidation.validateUserId(friendId)
        if (userIdValidationResult) {
            return res.status(400).send(userIdValidationResult)
        }
        const query1 = { requested_user: ObjectId(friendId), reciever_user: ObjectId(userId) };
        const query2 = { reciever_user: ObjectId(friendId), requested_user: ObjectId(userId) };
        const filter = { $or: [query1, query2], status: friendRequestStatus.friendRequestStatus.ACCEPT }
        const update = { status: friendRequestStatus.friendRequestStatus.REJECT }
        const friendRequestDetails = await friendRequestsSchema.findOneAndUpdate(filter, update)
        if (friendRequestDetails == null) {
            LOGGER.error('unfriendFunction', friendRequestErrors.friendsErrorCodesAndMessages.FRIEND_REQUEST_ID_NOT_FOUND)
            return res.status(404).send([friendRequestErrors.friendsErrorCodesAndMessages.FRIEND_REQUEST_ID_NOT_FOUND])
        }
        return res.status(200).send({ message: "unfriended" })
    } catch (error) {
        LOGGER.error('unfriendFunction', error)
    }
}



module.exports = {
    unfriendFunction
}