/* eslint-disable no-undef */
const User = require('../models/userModel');
const friendRequestsSchema = require('../models/friend_list');
const { ObjectId } = require('mongodb');
const LOGGER = require('../logger/logger.util');
const userStatus = require('../statusCatalogue/userStatusCatalogue')
const userError = require('../errorCatalogue/userErrorCatalogue')
const friendsError = require('../errorCatalogue/friendsErrorCatalogue')
const generalError = require('../errorCatalogue/generalErrorCatalogue')
const regularExpressions = require('../regularExpressions/regularExpressions')
const requestStatus = require('../statusCatalogue/requestStatusCatalogue')
const stringManipulation = require('../generalFunctions/stringManipulations')
const validateMongoose = require('../generalFunctions/mongoDbValidation');
const { friendsListWithSearchFunction } = require('../modules/friendsModule/friendListSearch')
const { blockUserFunction } = require('../modules/friendsModule/blockUserAPI')
const { unblockingFunction } = require('../modules/friendsModule/unblockingUserAPI')
const notificationSchema = require('../models/notifications')
const {notificationType}= require('../statusCatalogue/notificationType')
const {notificationStatus}= require('../statusCatalogue/notifictionStatus')
const {notificationDelivery}= require('../statusCatalogue/notificationDelivery')
const { notificationCountSend } = require('../webSocket');

const friendsListWithSearch = async (req, res) => {
    LOGGER.info('friendsListWithSearch called')
    try {
        const result = friendsListWithSearchFunction(req, res)
        return result
    } catch (error) {
        LOGGER.error('Error in friendsListWithSearch', error)
    }
};



const acceptOrRejectFriendRequest = async (req, res) => {
    LOGGER.info('acceptOrRejectFriendRequest called');
    try {
        const statusValue = req.body.status;
        const mongoDbRegex = regularExpressions.regex.MONGO_DB_REGEX;
        const userId = req.query.userId;
        let friendRequestId = req.query?.friend_request_id;
        const errorsArray = [];
        let friendRequestDetails;

        const validateUserId = () => {
            LOGGER.info('validateUserId')
            if (!userId || !userId.match(mongoDbRegex) || userId !== req.user.id) {
                errorsArray.push(userError.userErrorCodesAndMessages.INVALID_USER_ID);
                LOGGER.error('Invalid userId');
            }
        };

        const validateFriendRequestId = async () => {
            LOGGER.info('validateFriendRequestId')
            if (!friendRequestId || !friendRequestId.trim() || !friendRequestId.match(mongoDbRegex)) {
                errorsArray.push(friendsError.friendsErrorCodesAndMessages.INVALID_FRIEND_REQUEST_ID);
                LOGGER.error('Invalid friend request Id');
            } else {
                friendRequestDetails = await friendRequestsSchema.findOne({ _id: ObjectId(friendRequestId), status: requestStatus.friendRequestStatus.PENDING, reciever_user: req.user.id });
                if (!friendRequestDetails) {
                    errorsArray.push(friendsError.friendsErrorCodesAndMessages.FRIEND_REQUEST_ID_NOT_FOUND);
                    LOGGER.error('friend request id not found');
                } else {
                    const userWhoSentTheRequest = await User.findById(friendRequestDetails.requested_user);
                    if (!userWhoSentTheRequest) {
                        errorsArray.push(friendsError.friendsErrorCodesAndMessages.RECIEVER_ID_NOT_FOUND);
                        LOGGER.error('recieverId not found');
                    }
                }
            }
        };

        const validateStatusValue = () => {
            LOGGER.info('validateStatusValue')
            const validStatusValues = [1, 2];
            if (statusValue === '' || statusValue === null) {
                errorsArray.push(generalError.generalErrorCodesAndMessages.STATUS_REQUIRED);
                LOGGER.error('status required');
            } else if (!validStatusValues.includes(statusValue)) {
                errorsArray.push(generalError.generalErrorCodesAndMessages.INVALID_STATUS);
                LOGGER.error('Invalid status');
            }
        };

        if (userId) {
            validateUserId();
            if (friendRequestId) {
                await validateFriendRequestId();
            } else {
                errorsArray.push(friendsError.friendsErrorCodesAndMessages.FRIEND_REQUEST_ID_REQUIRED);
                LOGGER.error('friend request id required');
            }

            validateStatusValue();

            if (errorsArray.length === 0) {
                switch (statusValue) {
                    case 1:
                        friendRequestDetails.status = requestStatus.friendRequestStatus.ACCEPT;
                        res.status(200).send({ message: 'Friend Request is Accepted' });
                        break;
                    case 2:
                        friendRequestDetails.status = requestStatus.friendRequestStatus.REJECT;
                        res.status(200).send({ message: 'Friend Request is Rejected' });
                        break;
                    default:
                        friendRequestDetails.status = requestStatus.friendRequestStatus.PENDING;
                        res.status(200).send({ message: 'Friend Request is pending' });
                        break;
                }
                await friendRequestDetails.save();
            } else {
                res.status(400).send(errorsArray);
            }
        } else {
            LOGGER.error('userId required');
            if (!friendRequestId) {
                res.status(400).send([
                    userError.userErrorCodesAndMessages.USER_ID_REQUIRED,
                    friendsError.friendsErrorCodesAndMessages.FRIEND_REQUEST_ID_REQUIRED
                ]);
            } else {
                res.status(400).send(userError.userErrorCodesAndMessages.USER_ID_REQUIRED);
            }
        }
    } catch (error) {
        LOGGER.error('error in accept or reject friend request', error);
    }
};


const sendFriendRequest = async (req, res) => {
    LOGGER.info('sendFriendRequest')
    try {
        const FAIL = 0;
        const MESSAGE_ALREADY_SENT = friendsError.friendsErrorCodesAndMessages.REQUEST_ALREADY_SENT
        const sender = req.user.id;
        if (req.body.recieverUser == null || req.body.recieverUser == "") {
            res.status(400).send(friendsError.friendsErrorCodesAndMessages.RECIEVER_ID_REQUIRED)
        }
        const preReciever = validateMongoose.idValidation(stringManipulation.trimStrings(req.body.recieverUser))
        if (preReciever.FAIL == FAIL || preReciever.mongoDbId == sender) {
            return res.status(400).send(friendsError.friendsErrorCodesAndMessages.INVALID_RECIEVER_ID)
        }
        const reciever = preReciever.mongoDbId
        const fetchUserFromDatabase = await User.findOne({
            _id: ObjectId(reciever), status: userStatus.userStatus.ACTIVE
        })
        if (!fetchUserFromDatabase) {
            return res.status(400).send(friendsError.friendsErrorCodesAndMessages.INVALID_RECIEVER_ID)
        }
        const query1 = {
            requested_user: sender, reciever_user: reciever,
            $or: [
                { status: requestStatus.friendRequestStatus.PENDING },
                { status: requestStatus.friendRequestStatus.ACCEPT }
            ]
        }
        const query2 = {
            requested_user: reciever, reciever_user: sender,
            $or: [
                { status: requestStatus.friendRequestStatus.PENDING },
                { status: requestStatus.friendRequestStatus.ACCEPT }
            ]
        }
        const existingRequestByAUser = await friendRequestsSchema.find({ $or: [query1, query2] });
        if (existingRequestByAUser.length != 0) {

            existingRequestByAUser.forEach(i => {
                if (i.status === 1) {
                    return res.status(400).send(friendsError.friendsErrorCodesAndMessages.ALREADY_A_FRIEND)
                }
            });
            return res.status(400).send(MESSAGE_ALREADY_SENT)

        }
        const senderUser = await User.findOne({ _id: sender });

        const friendsStorage = new friendRequestsSchema({
            requested_user: sender,
            reciever_user: reciever
        })
      const friendRequestNotification = new notificationSchema({
            requested_user: sender,
            reciever_user: reciever,
            friend_status: requestStatus.friendRequestStatus.PENDING,
            type:notificationType.FRIEND_REQUEST,
            status:notificationStatus.UNREAD,
            getuser_name:senderUser.userName,
            delivery:notificationDelivery.UNREAD

        })
        await friendRequestNotification.save();
        await friendsStorage.save();
        notificationCountSend(reciever)
        return res.status(200).send({ message: "success" })
    } catch (error) {
        LOGGER.error('sendFriendRequest', error)
    }
}

const friendRequstList = async (req, res) => {
    LOGGER.info('friendRequstList')
    try {
        const userId = req.user.id
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const response = {}
        if (endIndex < (await friendRequestsSchema.countDocuments())) {
            response.next = {
                page: page + 1,
                limit: limit
            };
            response.nextPage = "{{base_url}}/user/friend-requests?page=" + response.next.page
        }

        if (startIndex > 0) {
            response.previous = {
                page: page - 1,
                limit: limit
            };
            response.previousPage = "{{base_url}}/user/friend-requests?page=" + response.previous.page
        }
        response.count = await friendRequestsSchema.find({ "reciever_user": userId, "status": 0 }).count();
        response.result = await friendRequestsSchema.find({ "reciever_user": userId, "status": 0 }).limit(limit).skip(startIndex).populate('requested_user').lean();
        res.status(200).send({ message: "success", "count": response.count, 'next': response.nextPage, 'previous': response.previousPage, 'result': response.result })

    } catch (error) {
        LOGGER.error("error in friendRequestList", error)

    }


};

const unfriend = async (req, res) => {
    LOGGER.info('unfriend')
    try {

        const result = unfriendFunction.unfriendFunction(req, res)
        return result
    } catch (error) {
        LOGGER.error('unfriend', error)
    }
};

const blockUser = async (req, res) => {
    LOGGER.info('blockUser')
    try {
        const result = blockUserFunction(req, res)
        return result
    } catch (error) {
        LOGGER.error('blockUser', error)
    }
};

const unblockUser = async (req, res) => {
    LOGGER.info('unblockUser')
    try {
        const result = unblockingFunction(req, res)
        return result
    } catch (error) {
        LOGGER.error('unblockUser', error)
    }
};

module.exports = {
    friendsListWithSearch,
    acceptOrRejectFriendRequest,
    sendFriendRequest,
    friendRequstList,
    unfriend,
    blockUser,
    unblockUser
}