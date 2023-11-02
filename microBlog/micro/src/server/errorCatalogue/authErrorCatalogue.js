const authErrorCodesAndMessages = {
    REQUIRE_REFRESH_TOKEN: { errorCode: 1000, message: "RefreshToken Required" },
    REFRESH_TOKEN_EXPIRED: { errorCode: 1001, message: "token expired" },
    INVALID_TOKEN: { errorCode: 1002, message: "invalid token" },
    OTP_ALREADY_GENERATED: { errorCode: 1003, message: "Otp already generated" },
    OTP_REQUIRED: { errorCode: 1004, message: "Otp required" },
    PASSWORD_REQUIRED: { errorCode: 1005, message: "password required" },
    INVALID_PASSWORD: { errorCode: 1006, message: "invalid password" },
    UNEXPECTED_ERROR: { errorCode: 1007, message: "Unexpected error occurred" },
    TOKEN_REQUIRED: { errorCode: 1008, message: "token required" },
    INVALID_OTP: { errorCode: 1009, message: "invalid otp" },
    ACCESS_DENIED: { errorCode: 1010, message: "access denied" }

};


module.exports = {
    authErrorCodesAndMessages
}