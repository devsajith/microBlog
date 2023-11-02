const groupErrorCodesAndMessages = {
    INVALID_NAME: { errorCode: 7502, message: "Invalid Group Name" },
    REQUIRED_NAME: { errorCode: 7501, message: "Group Name Required" },
    MAX_MEMBER: { errorCode: 7503, message: "Maximum 5 members Allowed" },
    MIN_MEMBER: {errorCode: 7504, message: "Minimum  2 members Required"},
    INVALID_PHOTO_URL: { errorCode: 7505, message: "Invalid URL" },
    INVALID_ID: {errorCode:7506, message:"Invalid Id"},
    NOT_ADMIN:{errorCode:7507,message:"Not an Admin"},
    INVALID_GROUP_ID:{errorCode:7508,messages:'Invalid group Id'}
}

module.exports = {
    groupErrorCodesAndMessages
}