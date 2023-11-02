const userErrorCodesAndMessages = {
    ALREADY_EXISTING_EMAIL: { errorCode: 2000, message: "Already existing email id" },
    NON_EXISTANT_USER: { errorCode: 2001, message: "the user does not exist" },
    NON_EXISTANT_USER_ID: { errorCode: 2002, message: "userId not found" },
    EMAIL_REQUIRED: { errorCode: 2003, message: "email required" },
    EMAIL_NOT_FOUN: { errorCode: 2004, message: "email not found" },
    INVALID_USER_ID: { errorCode: 2005, message: "Invalid userId" },
    USER_ID_REQUIRED: { errorCode: 2006, message: "userId required" },
    USERNAME_REQUIRED: { errorCode: 2007, message: "UserName Required" },
    INVALID_USERNAME: { errorCode: 2008, message: "Invalid username" },
    INVALID_EMAIL: { errorCode: 2009, message: "Invalid Email" },
    INVALID_ABOUT: { errorCode: 2010, message: "Invalid about" },
    INVALID_CITY_NAME: { errorCode: 2011, message: "Invalid City name" },
    INVALID_COUNTRY_NAME: { errorCode: 2012, message: "Invalid Country name" },
    INVALID_PHONE_NUMBER: { errorCode: 2013, message: "Invalid number" },
    DOB_REQUIRED: { errorCode: 2014, message: "Date of birth is required" },
    INVALID_DATE: { errorCode: 2015, message: "Invalid date" },
    GENDER_REQUIRED: { errorCode: 2016, message: "Gender is required" },
    INVALID_GENDER_SELECTION: { errorCode: 2017, message: "Invalid selection in gender" },
    INVALID_PHOTO_URL: { errorCode: 2018, message: "invalid photo url" },
    INVALID_ACCESS_STATUS: { errorCode: 2019, message: "Invalid selection in access" }
};

module.exports = {
    userErrorCodesAndMessages
}