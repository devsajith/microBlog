const errors = {
  REQUIRE_REFRESH_TOKEN: { errorCode: 1000, message: "RefreshToken Required" },
  REFRESH_TOKEN_EXPIRED: { errorCode: 1001, message: "token expired" },
  INVALID_TOKEN: { errorCode: 1002, message: "invalid token" },
  OTP_ALREADY_GENERATED: { errorCode: 1003, message: "Otp already generated" },
  OTP_REQUIRED: { errorCode: 1004, message: "otp required" },
  PASSWORD_REQUIRED: { errorCode: 1005, message: "password required" },
  INVALID_PASSWORD: { errorCode: 1006, message: "invalid password" },
  UNEXPECTED_ERROR: { errorCode: 1007, message: "Unexpected error occured" },
  TOKEN_REQUIRED: { errorCode: 1008, message: "token required" },
  INVALID_OTP: { errorCode: 1009, message: "invalid otp" },

  INVALID_FRIEND_REQUEST_ID: {
    errorCode: 3000,
    message: "Invalid friend request Id",
  },
  FRIEND_REQUEST_ID_NOT_FOUND: {
    errorCode: 3001,
    message: "friend request id not found",
  },
  RECIEVER_ID_NOT_FOUND: { errorCode: 3002, message: "recieverId not found" },
  FRIEND_REQUEST_ID_REQUIRED: {
    errorCode: 3003,
    message: "friend request id required",
  },

  STATUS_REQUIRED: { errorCode: 4000, message: "status required" },
  INVALID_STATUS: { errorCode: 4001, message: "Invalid status" },

  ALREADY_EXISTING_EMAIL: {
    errorCode: 2000,
    message: "Already existing email id",
  },
  NON_EXISTANT_USER: { errorCode: 2001, message: "the user does not exist" },
  NON_EXISTANT_USER_ID: { errorCode: 2002, message: "userId not found" },
  EMAIL_REQUIRED: { errorCode: 2003, message: "email required" },
  EMAIL_NOT_FOUN: { errorCode: 2004, message: "email not found" },
  INVALID_USER_ID: { errorCode: 2005, message: "Invalid userId" },
  USER_ID_REQUIRED: { errorCode: 2006, message: "userId required" },
};

export default errors;
