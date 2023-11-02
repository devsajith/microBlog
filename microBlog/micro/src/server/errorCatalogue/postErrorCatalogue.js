const postErrorCodesAndMessages = {
    INVALID_TEXT: { errorCode: 5000, message: "Invalid text" },
    NOTHING_TO_POST: { errorCode: 5001, message: "Nothing to post" },
    INVALID_PHOTO_URL: { errorCode: 5002, message: "Invalid URL" },
    INVALID_POST_ID: { errorCode: 5004, message: "Invalid id" },
    ID_REQUIRED: { errorCode: 5005, message: "Id required" },
    VERSION_REQUIRED: { errorCode: 5006, message: "version required" },
    INVALID_VERSION: { errorCode: 5007, message: "invalid version" },
    VERSION_MISSMATCH: { errorCode: 5008, message: "version missmatch" },
    INVALID_COMMENT: { errorCode: 5020, message: "invalid comment" },
    COMMENT_REQUIRED: { errorCode: 5021, message: "comment required" },
    COMMENT_EXCEEDS: { errorCode: 5022, message: "comment character exceeds maximum limit" },

}

module.exports = {
    postErrorCodesAndMessages
}