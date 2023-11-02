/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */

const { body, param } = require('express-validator');
const { isEmpty, matches } = require('validator');
const userError = require('../errorCatalogue/userErrorCatalogue')
const pageError = require('../errorCatalogue/pageErrorCatalogue')
const regex = require('../regularExpressions/regularExpressions')
const notificationError  = require('../errorCatalogue/notificationErrorCatalogue')
const userValidator = (validationType) => {

    switch (validationType) {
        case 'userRegistration': {
            return [
                body('userName')
                    .exists()
                    .withMessage(userError.userErrorCodesAndMessages.USERNAME_REQUIRED)
                    .bail()
                    .isLength({ min: 1 })
                    .withMessage(userError.userErrorCodesAndMessages.USERNAME_REQUIRED)
                    .bail()
                    .matches(regex.regex.USERNAME_REGEX)
                    .withMessage(userError.userErrorCodesAndMessages.INVALID_USERNAME)
                    .bail()
                    .isLength({ min: 3, max: 30 })
                    .withMessage(userError.userErrorCodesAndMessages.INVALID_USERNAME),
                body('email')
                    .notEmpty().withMessage(userError.userErrorCodesAndMessages.EMAIL_REQUIRED)
                    .if(body('email').notEmpty())
                    .isEmail().withMessage(userError.userErrorCodesAndMessages.INVALID_EMAIL),
                body('about')
                    .trim()
                    .isLength({ max: 200 })
                    .withMessage(userError.userErrorCodesAndMessages.INVALID_ABOUT),
                body('city')
                    .optional()
                    .custom((value, { req }) => {
                        if (value !== null && !isEmpty(value) && !matches(value, regex.regex.USERNAME_REGEX)) {
                            return Promise.reject(userError.userErrorCodesAndMessages.INVALID_CITY_NAME);
                        }

                        return true;
                    })
                    .trim()
                    .isLength({ max: 50 })
                    .withMessage(userError.userErrorCodesAndMessages.INVALID_CITY_NAME),
                body('country')
                    .optional()
                    .custom((value, { req }) => {
                        if (value !== null && !isEmpty(value) && !matches(value, regex.regex.USERNAME_REGEX)) {
                            return Promise.reject(userError.userErrorCodesAndMessages.INVALID_COUNTRY_NAME);
                        }

                        return true;
                    })
                    .trim()
                    .isLength({ max: 50 })
                    .withMessage(userError.userErrorCodesAndMessages.INVALID_COUNTRY_NAME),
                body('phone')
                    .trim()

                    .optional()
                    .custom((value, { req }) => {
                        if (value !== null && !isEmpty(value) && !matches(value, regex.regex.PHONE_REGEX)) {
                            return Promise.reject(userError.userErrorCodesAndMessages.INVALID_PHONE_NUMBER);
                        }
                        return true;
                    }),
                body('dob')
                    .trim()
                    .notEmpty()
                    .withMessage(userError.userErrorCodesAndMessages.DOB_REQUIRED)
                    .bail()
                    .isDate({ format: 'dd/mm/yyyy', delimiters: ['/'], strictMode: true })
                    .withMessage(userError.userErrorCodesAndMessages.INVALID_DATE),
                body('gender')
                    .notEmpty()
                    .withMessage(userError.userErrorCodesAndMessages.GENDER_REQUIRED)
                    .bail()
                    .isIn([1, 2, 3])
                    .withMessage(userError.userErrorCodesAndMessages.INVALID_GENDER_SELECTION),
                body('photo')
                    .trim()
                    .optional({ nullable: true, checkFalsy: true })
                    .not().isEmail()
                    .withMessage(userError.userErrorCodesAndMessages.INVALID_PHOTO_URL)
                    .optional({ nullable: true, checkFalsy: true })
                    .isURL()
                    .withMessage(userError.userErrorCodesAndMessages.INVALID_PHOTO_URL)
            ]
        }
        case 'updateUser': {
            return [
                param('id')
                    .trim()
                    .notEmpty()
                    .withMessage({ errorCode: 2003, message: "id is required" })
                    .isMongoId()
                    .withMessage({ errorCode: 2002, message: "Invalid mongodb Id" }),
                body('userName')
                    .exists()
                    .withMessage(userError.userErrorCodesAndMessages.USERNAME_REQUIRED)
                    .bail()
                    .isLength({ min: 1 })
                    .withMessage(userError.userErrorCodesAndMessages.USERNAME_REQUIRED)
                    .bail()
                    .matches(regex.regex.USERNAME_REGEX)
                    .withMessage(userError.userErrorCodesAndMessages.INVALID_USERNAME)
                    .bail()
                    .isLength({ min: 3, max: 30 })
                    .withMessage(userError.userErrorCodesAndMessages.INVALID_USERNAME),
                body('about')
                    .trim()
                    .isLength({ max: 200 })
                    .withMessage(userError.userErrorCodesAndMessages.INVALID_ABOUT),
                body('city')
                    .optional()
                    .custom((value, { req }) => {
                        if (value !== null && !isEmpty(value) && !matches(value, regex.regex.USERNAME_REGEX)) {
                            return Promise.reject(userError.userErrorCodesAndMessages.INVALID_CITY_NAME);
                        }

                        return true;
                    })
                    .trim()
                    .isLength({ max: 50 })
                    .withMessage(userError.userErrorCodesAndMessages.INVALID_CITY_NAME),
                body('country')
                    .optional()
                    .custom((value, { req }) => {
                        if (value !== null && !isEmpty(value) && !matches(value, regex.regex.USERNAME_REGEX)) {
                            return Promise.reject(userError.userErrorCodesAndMessages.INVALID_COUNTRY_NAME);
                        }

                        return true;
                    })
                    .trim()
                    .isLength({ max: 50 })
                    .withMessage(userError.userErrorCodesAndMessages.INVALID_COUNTRY_NAME),
                body('phone')
                    .trim()

                    .optional()
                    .custom((value, { req }) => {
                        if (value !== null && !isEmpty(value) && !matches(value, regex.regex.PHONE_REGEX)) {
                            return Promise.reject(userError.userErrorCodesAndMessages.INVALID_PHONE_NUMBER);
                        }
                        return true;
                    }),
                body('dob')
                    .trim()
                    .notEmpty()
                    .withMessage(userError.userErrorCodesAndMessages.DOB_REQUIRED)
                    .bail()
                    .isDate({ format: 'dd/mm/yyyy', delimiters: ['/'], strictMode: true })
                    .withMessage(userError.userErrorCodesAndMessages.INVALID_DATE),
                body('gender')
                    .notEmpty()
                    .withMessage(userError.userErrorCodesAndMessages.GENDER_REQUIRED)
                    .bail()
                    .isIn([1, 2, 3])
                    .withMessage(userError.userErrorCodesAndMessages.INVALID_GENDER_SELECTION),
                body('photo')
                    .trim()
                    .optional({ nullable: true, checkFalsy: true })
                    .not().isEmail()
                    .withMessage(userError.userErrorCodesAndMessages.INVALID_PHOTO_URL)
                    .optional({ nullable: true, checkFalsy: true })
                    .isURL()
                    .withMessage(userError.userErrorCodesAndMessages.INVALID_PHOTO_URL),
                body('coverPhoto')
                    .trim()
                    .optional({ nullable: true, checkFalsy: true })
                    .not().isEmail()
                    .withMessage(userError.userErrorCodesAndMessages.INVALID_PHOTO_URL)
                    .optional({ nullable: true, checkFalsy: true })
                    .isURL()
                    .withMessage(userError.userErrorCodesAndMessages.INVALID_PHOTO_URL),
                body('access')
                    .notEmpty()
                    .isIn([0, 1])
                    .withMessage(userError.userErrorCodesAndMessages.INVALID_ACCESS_STATUS)
            ]
        }
        case 'createPage': {
            return [
                body('pageName')
                    .exists()
                    .withMessage(pageError.pageErrorCodesAndMessages.PAGE_NAME_REQUIRED)
                    .bail()
                    .isLength({ min: 1 })
                    .withMessage(pageError.pageErrorCodesAndMessages.PAGE_NAME_REQUIRED)
                    .bail()
                    .matches(regex.regex.USERNAME_REGEX)
                    .withMessage(pageError.pageErrorCodesAndMessages.INVALID_PAGE_NAME)
                    .bail()
                    .isLength({ min: 3, max: 30 })
                    .withMessage(pageError.pageErrorCodesAndMessages.INVALID_PAGE_NAME),
                body('about')
                .exists()
                    .withMessage(pageError.pageErrorCodesAndMessages.ABOUT_REQUIRED)
                    .bail()
                    .trim()
                    .isLength({ max: 200 })
                    .withMessage(pageError.pageErrorCodesAndMessages.INVALID_ABOUT),
                body('profilePhoto')
                    .trim()
                    .optional({ nullable: true, checkFalsy: true })
                    .not().isEmail()
                    .withMessage(pageError.pageErrorCodesAndMessages.INVALID_IMAGE_URL)
                    .optional({ nullable: true, checkFalsy: true })
                    .isURL()
                    .withMessage(pageError.pageErrorCodesAndMessages.INVALID_IMAGE_URL),
                    body('coverPhoto')
                    .trim()
                    .optional({ nullable: true, checkFalsy: true })
                    .not().isEmail()
                    .withMessage(pageError.pageErrorCodesAndMessages.INVALID_IMAGE_URL)
                    .optional({ nullable: true, checkFalsy: true })
                    .isURL()
                    .withMessage(pageError.pageErrorCodesAndMessages.INVALID_IMAGE_URL)
            ]
        }
        case 'createNotification': {
            return [
                body('sender')
                    .exists()
                    .withMessage(notificationError.noificationErrorCodesAndMessages.INVALID_SENDER_ID)
                  ,
                body('email')
                .exists()
                    .withMessage(notificationError.noificationErrorCodesAndMessages.INVALID_EMAIL)
                    .notEmpty().withMessage(userError.userErrorCodesAndMessages.EMAIL_REQUIRED)
                    .if(body('email').notEmpty())
                    .isEmail().withMessage(notificationError.noificationErrorCodesAndMessages.INVALID_EMAIL),
                    
                    body('message')
                    .exists()
                        .withMessage(notificationError.noificationErrorCodesAndMessages.NO_MESSAGE)
                    
            ]
        }
    }
}


module.exports = { userValidator }