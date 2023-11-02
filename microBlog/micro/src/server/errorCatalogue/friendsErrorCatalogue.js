const friendsErrorCodesAndMessages = {
    INVALID_FRIEND_REQUEST_ID: { errorCode: 3000, message: "Invalid friend request Id" },
    FRIEND_REQUEST_ID_NOT_FOUND: { errorCode: 3001, message: "friend request id not found" },
    RECIEVER_ID_NOT_FOUND: { errorCode: 3002, message: "recieverId not found" },
    FRIEND_REQUEST_ID_REQUIRED: { errorCode: 3003, message: "friend request id required" },
    INVALID_RECIEVER_ID: { errorCode: 3004, message: "invalid recieverId" },
    REQUEST_ALREADY_SENT: { errorCode: 3005, message: "request is already sent" },
    RECIEVER_ID_REQUIRED: { errorCode: 3006, message: "recieverId required" },
    ALREADY_A_FRIEND: { errorCode: 3007, message: "User is already a friend" },
    ALREADY_BLOCKED: { errorCode: 3008, message: "User already blocked" },
    NOT_BLOCKED: { errorCode: 3009, message: "User not blocked" },
    INVALID_ID:{errorCode: 3010, message: "Invalid Id"}

}

module.exports = {
    friendsErrorCodesAndMessages
}