const commentErrorCodesAndMessages = {
    ID_REQUIRED: { errorCode: 6000, message: "id required" },
    INVALID_ID: { errorCode: 6001, message: "invalid id" },
    INVALID_COMMENT: { errorCode: 6002, message: "Invalid comment" },
    COMMENT_REQUIRED: { errorCode: 6003, message: "Comment Required" },
    VERSION_REQUIREDL: { errorCode: 6004, message: "version required" },
    INVALID_VERSION: { errorCode: 6005, message: "Invalid version" },
    VERSION_MISSMATCH: { errorCode: 6006, message: "version missmatch" }
}

module.exports = { commentErrorCodesAndMessages }