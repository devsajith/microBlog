/* eslint-disable no-undef */
const LOGGER = require('../logger/logger.util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const userTokens = require('../models/user_token')
const authErrors = require('../errorCatalogue/authErrorCatalogue');
const userStatus = require('../statusCatalogue/userStatusCatalogue')
const admin = require('firebase-admin')
const { sendOTPMail } = require('../mailModule/mailing');
const roles = require('../roles/userRoles')
const tokenStatus = require('../statusCatalogue/tokenStatusCatalogue')
const authError = require('../errorCatalogue/authErrorCatalogue')
const userError = require('../errorCatalogue/userErrorCatalogue')
const regularExpressions = require('../regularExpressions/regularExpressions')
const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_CREDENTIALS||"")
const { ObjectId } = require('mongodb');
const { accessTokenGenerator } = require("./accessTokenGenerator");
const { saveAccessToken } = require("./saveAccessToken");
const { refreshTokenGenerator } = require("./refreshTokenGenerator");
const { prepareToSaveAccessTokenAndRefreshToken } = require("./prepareToSaveAccessTokenAndRefreshToken");
const { generateOTP } = require("./generateOTP");
//firebase credentials
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.databaseURL
});
const generateAccessTokenFromRefreshToken = async (req, res) => {
    LOGGER.info('generateAccessTokenFromRefreshToken is called')
    try {
        const refreshToken = req.body.refreshToken;
        if (!refreshToken || refreshToken == null) {
            return res.status(400).send(authErrors.authErrorCodesAndMessages.REQUIRE_REFRESH_TOKEN)
        }
        const decodedRefreshToken = jwt.verify(refreshToken, process.env.TokenKey);
        const tokenMail = decodedRefreshToken.email;
        const user = await User.findOne({ email: tokenMail, status: { $in: [userStatus.userStatus.ACTIVE, userStatus.userStatus.INCOMPLETE_PROFILE] } });
        const accessToken = accessTokenGenerator(user);
        const tokenStorage = saveAccessToken(user, accessToken)
        const tokensToStorage = new userTokens(tokenStorage)
        await tokensToStorage.save()
        return res.status(200).send({ 'accessToken': accessToken })
    } catch (error) {
        LOGGER.error('generateAccessTokenFromRefreshToken', error)
        if (error?.name === "TokenExpiredError") {
            LOGGER.error('Refresh token Expiry', error)
            return res.status(403).send(authErrors.authErrorCodesAndMessages.REFRESH_TOKEN_EXPIRED)
        } else {
            LOGGER.error('Invalid refresh token', error)
            return res.status(403).send(authErrors.authErrorCodesAndMessages.INVALID_TOKEN)
        }}};
        const userLogin = async (req, res) => {
            LOGGER.info('userLogin Is called');
            try {
                if (!req.body.fireBaseToken) {
                    res.status(400).send(authError.authErrorCodesAndMessages.TOKEN_REQUIRED);
                    LOGGER.info('error in login', authError.authErrorCodesAndMessages.TOKEN_REQUIRED);
                } else {
                    const fireBaseToken = req.body.fireBaseToken;
                    const decodedToken = await admin.auth().verifyIdToken(fireBaseToken);
                    const tokenMail = decodedToken.email;
                    const provider = decodedToken.firebase.sign_in_provider;
        
                    if (provider == "google.com") {
                        const user = await User.findOne({ email: tokenMail, status: { $in: [userStatus.userStatus.ACTIVE, userStatus.userStatus.INCOMPLETE_PROFILE] } });
                        if (!user) {
                            LOGGER.info('userLogin\t'+ 'new user using Google signIn');
                            const payload = await User.create({
                                email: tokenMail,
                                role: roles.userRoles.USER,
                                status: userStatus.userStatus.INCOMPLETE_PROFILE,
                                version: 1,
                            }); const accessTokenSign = accessTokenGenerator(user);
                            const refreshTokenSign = refreshTokenGenerator(user);
                            const tokensStorage = prepareToSaveAccessTokenAndRefreshToken(user, accessTokenSign, refreshTokenSign);
                            const tokenStorage = new userTokens(tokensStorage);
                            await tokenStorage.save();
                            const result = {
                                id: payload.id,
                                userStatus: payload.status,
                                role: payload.role,
                                accessToken: accessTokenSign,
                                refreshToken: refreshTokenSign,
                            };return res.status(200).send(result); } else {
                            LOGGER.info('userLogin'+'\texisting user , Google signIn');
                            const accessTokenSign = accessTokenGenerator(user);
                            const refreshTokenSign = refreshTokenGenerator(user);
                            const tokensStorage = prepareToSaveAccessTokenAndRefreshToken(user, accessTokenSign, refreshTokenSign);
                            const tokenStorage = new userTokens(tokensStorage);
                            await tokenStorage.save();
                            const response = {
                                id: user.id,userStatus: user.status,
                                role: user.role, accessToken: accessTokenSign,
                                refreshToken: refreshTokenSign, };
                            res.status(200).send(response);}
                    } else {
                        LOGGER.info('userLogin\t'+'Email & Password signIn');
                        const user = await User.findOne({ email: tokenMail, status: { $in: [userStatus.userStatus.ACTIVE, userStatus.userStatus.INCOMPLETE_PROFILE] } });
                        const accessTokenSign = accessTokenGenerator(user);
                        const refreshTokenSign = refreshTokenGenerator(user);
                        const tokensStorage = prepareToSaveAccessTokenAndRefreshToken(user, accessTokenSign, refreshTokenSign);
                        const tokenStorage = new userTokens(tokensStorage);
                        await tokenStorage.save();
                        const response = {
                            id: user.id, userStatus: user.status,
                            role: user.role,accessToken: accessTokenSign,
                            refreshToken: refreshTokenSign, };
                        res.status(200).send(response); } } } catch (err) {
                if (err.code == "auth/id-token-expired") {
                    res.status(400).send(authError.authErrorCodesAndMessages.REFRESH_TOKEN_EXPIRED);
                    LOGGER.error('error in login', err);} else {
                    res.status(400).send(authError.authErrorCodesAndMessages.INVALID_TOKEN);
                    LOGGER.error('error in login', authError.authErrorCodesAndMessages.INVALID_TOKEN); } }};
        
        const adminLogin = async (req, res) => {
            LOGGER.info('userLogin Is called');
            try {
                if (!req.body.fireBaseToken) {
                    res.status(400).send(authError.authErrorCodesAndMessages.TOKEN_REQUIRED);
                    LOGGER.info('error in login', authError.authErrorCodesAndMessages.TOKEN_REQUIRED);
                } else {
                    const fireBaseToken = req.body.fireBaseToken;
                    const decodedToken = await admin.auth().verifyIdToken(fireBaseToken);
                    const tokenMail = decodedToken.email;
                    const provider = decodedToken.firebase.sign_in_provider;
        
                    if (provider === "google.com") {
                        const user = await User.findOne({ email: tokenMail, status: { $in: [userStatus.userStatus.ACTIVE, userStatus.userStatus.INCOMPLETE_PROFILE] } });
                        if (!user) {
                            LOGGER.info('userLogin\t' + 'new user using Google signIn');
                            const payload = await User.create({
                                email: tokenMail,role: roles.userRoles.USER,
                                status: userStatus.userStatus.INCOMPLETE_PROFILE,version: 1,});
        
                            const accessTokenSign = accessTokenGenerator(user);
                            const refreshTokenSign = refreshTokenGenerator(user);
                            const tokensStorage = prepareToSaveAccessTokenAndRefreshToken(user, accessTokenSign, refreshTokenSign);
                            const tokenStorage = new userTokens(tokensStorage);
                            await tokenStorage.save();
        
                            const result = {
                                id: payload.id, userStatus: payload.status,
                                role: payload.role,accessToken: accessTokenSign,
                                refreshToken: refreshTokenSign,};
                                return res.status(200).send(result);
                        } else {
                            LOGGER.info('userLogin' + '\texisting user, Google signIn');
                            const accessTokenSign = accessTokenGenerator(user);
                            const refreshTokenSign = refreshTokenGenerator(user);
                            const tokensStorage = prepareToSaveAccessTokenAndRefreshToken(user, accessTokenSign, refreshTokenSign);
                            const tokenStorage = new userTokens(tokensStorage);
                            await tokenStorage.save();
        
                            const response = {
                                id: user.id, userStatus: user.status,
                                role: user.role, accessToken: accessTokenSign,
                                refreshToken: refreshTokenSign, };
                            res.status(200).send(response); } } else {
                        LOGGER.info('userLogin\t' + 'Email & Password signIn');
                        const user = await User.findOne({ email: tokenMail, status: { $in: [userStatus.userStatus.ACTIVE, userStatus.userStatus.INCOMPLETE_PROFILE] } });
                        if (user && user.role === 2) { // Check if the user's role is 2
                            const accessTokenSign = accessTokenGenerator(user);
                            const refreshTokenSign = refreshTokenGenerator(user);
                            const tokensStorage = prepareToSaveAccessTokenAndRefreshToken(user, accessTokenSign, refreshTokenSign);
                            const tokenStorage = new userTokens(tokensStorage);
                            await tokenStorage.save();
        
                            const response = {
                                id: user.id, userStatus: user.status,
                                role: user.role, accessToken: accessTokenSign,
                                refreshToken: refreshTokenSign,};
                            res.status(200).send(response); } else {
                            res.status(400).send(authError.authErrorCodesAndMessages.ACCESS_DENIED); // Send a Forbidden status for invalid user role
                            LOGGER.info('error in login', 'Invalid user'); } } }
            } catch (err) {
                if (err.code === "auth/id-token-expired") {
                    res.status(400).send(authError.authErrorCodesAndMessages.REFRESH_TOKEN_EXPIRED);
                    LOGGER.error('error in login', err);
                } else {
                    res.status(400).send(authError.authErrorCodesAndMessages.INVALID_TOKEN);
                    LOGGER.error('error in login', authError.authErrorCodesAndMessages.INVALID_TOKEN);
                }
            }
        };
        
const forgotPasswordRequest = async (req, res) => {
    LOGGER.info('forgotPasswordRequest called')
    const mailIdBeforeTrim = req.body.email;
    const mailId = mailIdBeforeTrim.trim();
    try {
        if (mailId == '' || mailId == null) {
            res.status(400).send(userError.userErrorCodesAndMessages.EMAIL_REQUIRED);
            LOGGER.error("error in forgotPasswordRequest", userError.userErrorCodesAndMessages.EMAIL_REQUIRED)
        } else {
            const user = await User.findOne({ email: req.body.email })
            try {
                const query = { user: ObjectId(user._id) };
                const getTokenDetail = await userTokens
                    .findOne({ user: user._id, "black_list": 0, "otp": { $exists: true } })
                    .sort({ _id: -1 });
                const time = getTokenDetail.update_date;
                const currentTime = new Date().getTime();
                const differenceInMilliseconds = currentTime - time;
                const differenceInSeconds = differenceInMilliseconds / 1000;
                if (differenceInSeconds <= 20) {
                    LOGGER.error("Request within ", differenceInSeconds, " seconds");
                    return res.status(400).send(authError.authErrorCodesAndMessages.OTP_ALREADY_GENERATED)
                }
                const currentTimestamp = Math.floor(Date.now() / 1000);
                const previousTokens = await userTokens.find({
                    query, blacklist: 0,
                    expiry: { $gt: currentTimestamp }})
                if (previousTokens) {
                    LOGGER.info("user have active token");
                    for (let i = 0; i < previousTokens.length; i++) {
                        const token = previousTokens[i];
                        token.blacklist = 1;
                        token.updatedDate = Math.floor(Date.now() / 1000);
                        await token.save();
                    }
                    LOGGER.info("active tokens blacklisted");}
            } catch (error) { LOGGER.error(error)}
            if (user != null) {
                const OTP = generateOTP();
                const tokenPayload = { email: user.email}
                const tempToken = jwt.sign(
                    tokenPayload, process.env.TokenKey,
                    { expiresIn: "5m" } )
                const tokenExpiryTime = jwt.decode(tempToken).exp;
                const tokenStorage = new userTokens({
                    user: user._id,otp: OTP,token: tempToken,
                    create_date: new Date().getTime(),
                    update_date: new Date().getTime(), expiry: tokenExpiryTime,
                })
                await tokenStorage.save();
                sendOTPMail(user.email, OTP)
                res.status(200).send({ message: "success", "tempToken": tempToken })
                return tempToken
            } else {
                res.status(400).send(userError.userErrorCodesAndMessages.EMAIL_NOT_FOUN)
            }}
    } catch (error) {
        LOGGER.error("error in forgotPasswordRequest", error)
    }};
const verifyotp = async (req, res) => {
    LOGGER.info('verify otp is called')
    const tempToken = req.body.tempToken;
    const otp = req.body.otp;
    try {
        if (tempToken == '' || tempToken == null) {
            res.status(400).send(authError.authErrorCodesAndMessages.TOKEN_REQUIRED);
        } else {
            if (otp == '' || otp == null) {
                res.status(400).send(authError.authErrorCodesAndMessages.OTP_REQUIRED);
            } else {
                const otpRegex = /^\d{4}$/
                if (otp.match(otpRegex)) {
                    const usersToken = await userTokens.findOne({ token: tempToken, black_list: 0 })
                    if (!usersToken) {
                        res.status(400).send(authError.authErrorCodesAndMessages.INVALID_TOKEN);
                    } else {
                        const genaratedOtp = usersToken.otp
                        let decoded = ""
                        try {
                            decoded = jwt.verify(tempToken, process.env.TokenKey)
                        } catch (error) {
                            return res.status(400).send(authError.authErrorCodesAndMessages.REFRESH_TOKEN_EXPIRED)
                        }
                        const user = await User.findOne({ email: decoded.email })
                        if (!user) {
                            res.status(400).send(authError.authErrorCodesAndMessages.INVALID_TOKEN);
                        } else {
                            if (otp == genaratedOtp) {
                                const oldUserTokens = await userTokens.find({ user: usersToken.user._id, black_list: 0 })
                                if (oldUserTokens) {
                                    for (let i = 0; i < oldUserTokens.length; i++) {
                                        const token = oldUserTokens[i];
                                        token.black_list = 1;
                                        token.update_date = Math.floor(Date.now() / 1000);
                                        await token.save();}
                                    LOGGER.info("active tokens blacklisted");}
                                const tokenPayload = {email: user.email}
                                const Token = jwt.sign(
                                    tokenPayload, process.env.TokenKey,
                                    { expiresIn: "1m" })
                                const tokenExpiryTime = jwt.decode(Token).exp;
                                const tokenStorage = new userTokens({
                                    user: user._id, token: Token,
                                    otpStatus: 1, create_date: new Date().getTime(),
                                    update_date: new Date().getTime(),expiry: tokenExpiryTime, })
                                await tokenStorage.save();
                                user.status = 0
                                await user.save()
                                res.status(200).send({ message: "OTP verification successful", "tempToken": Token })
                            } else { res.status(400).send(authError.authErrorCodesAndMessages.INVALID_OTP)
                            }}}
                } else { res.status(400).send(authError.authErrorCodesAndMessages.INVALID_OTP)
                }}}} catch (error) { return res.status(400).send(authError.authErrorCodesAndMessages.UNEXPECTED_ERROR)}}

const resetPassword = async (req, res) => {
    LOGGER.info('resetPassword is called')
    try {
        const tempToken = req.body.tempToken;
        const newPassword = req.body.newPassword;
        if (!tempToken || tempToken === '') {
            LOGGER.error("error in reset password", authError.authErrorCodesAndMessages.TOKEN_REQUIRED)
            return res.status(400).send(authError.authErrorCodesAndMessages.TOKEN_REQUIRED); }
        if (!newPassword || newPassword === '') {
            LOGGER.error("error in reset password", authError.authErrorCodesAndMessages.PASSWORD_REQUIRED)
            return res.status(400).send(authError.authErrorCodesAndMessages.PASSWORD_REQUIRED); }
        const passwordRgex = regularExpressions.regex.PASSWORD_REGEX;
        if (!newPassword.match(passwordRgex)) {
            LOGGER.error("error in reset password", authError.authErrorCodesAndMessages.INVALID_PASSWORD)
            return res.status(400).send(authError.authErrorCodesAndMessages.INVALID_PASSWORD);}
        const decodedToken = jwt.verify(tempToken, process.env.TokenKey);
        const usersToken = await userTokens.findOne({ token: tempToken, black_list: tokenStatus.tokenStatus.BLACKLISTED_FALSE, otpStatus: 1 });
        if (!usersToken) {
            LOGGER.error("error in reset password", authError.authErrorCodesAndMessages.INVALID_TOKEN)
            return res.status(400).send(authError.authErrorCodesAndMessages.INVALID_TOKEN);}
        const email = decodedToken.email;
        const user = await User.findOne({ email: email })
        const payload = {
            email,user,
            newPassword};
        await resetPasswordToFirebase(payload);
        await userTokens.updateMany(
            { user: usersToken.user._id },
            { $set: { black_list: tokenStatus.tokenStatus.BLACKLISTED_TRUE, update_date: Math.floor(Date.now() / 1000) } });
        user.status = userStatus.userStatus.ACTIVE;
        await user.save();
        LOGGER.info("reset password success", { message: "password reset successfully" });
        res.status(200).send({ message: "password reset successfully" });
    } catch (error) {
        if (error.message === "jwt expired") {
            LOGGER.error("error in reset password", error);
            return res.status(400).send(authError.authErrorCodesAndMessages.REFRESH_TOKEN_EXPIRED);
        } else {  return res.status(400).send(authError.authErrorCodesAndMessages.INVALID_TOKEN); }}}
const resetPasswordToFirebase = async (req) => {
    LOGGER.info('resetPasswordToFirebase')
    try {
        const email = req.email
        const newPassword = req.newPassword
        admin.auth().getUserByEmail(email)
            .then((userRecord) => {
                const uid = userRecord.uid;
                const updateUserData = {password: newPassword}
                admin.auth().updateUser(uid, updateUserData)
                    .then(() => {
                        LOGGER.info("reset passwrd success", { message: "password reset successfully in firebase" })
                    })})
    } catch (error) {
        LOGGER.error('resetPasswordToFirebase', error)}}
const logoutFromAll = async (req, res) => {
    LOGGER.info('logoutFromAll')
    try {
        const usersToken = await userTokens.findOne({ user: req.user.id, black_list: tokenStatus.tokenStatus.BLACKLISTED_FALSE })
        if (!usersToken) {
            LOGGER.error("error in LogoutFrromAll", authError.authErrorCodesAndMessages.INVALID_TOKEN)
            res.status(400).send(authError.authErrorCodesAndMessages.INVALID_TOKEN)
        }
        await userTokens.updateMany(
            { user: usersToken.user._id },
            { $set: { black_list: 1, update_date: Math.floor(Date.now() / 1000) } });
        LOGGER.error("Logout Success")
        return res.status(200).send({ message: "Successfully loggedout" })
    } catch (error) {
        LOGGER.error("error in LogoutFrromAll", authError.authErrorCodesAndMessages.UNEXPECTED_ERROR)
        return res.status(400).send(authError.authErrorCodesAndMessages.UNEXPECTED_ERROR) }}
const logout = async (req, res) => {
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader.split(' ')[1];
        const usersToken = await userTokens.findOne({ token: token, black_list: tokenStatus.tokenStatus.BLACKLISTED_FALSE })
        if (!usersToken) {
            LOGGER.error("error in LogoutFrromAll", authError.authErrorCodesAndMessages.INVALID_TOKEN)
            res.status(400).send(authError.authErrorCodesAndMessages.INVALID_TOKEN)}
        usersToken.black_list = tokenStatus.tokenStatus.BLACKLISTED_TRUE;
        usersToken.save();
        LOGGER.error("Logout Success")
        return res.status(200).send({ message: "Successfully loged out" })
    } catch (error) {
        res.status(400).send(authError.authErrorCodesAndMessages.INVALID_TOKEN) }}
const getUserWithEmail = async (req, res) => {
    try {
        const email = req?.body?.email;
        const user = await User?.findOne({ email: email });
        const userName = user?.userName;
        let uid;
        await admin.auth().getUserByEmail(email)
            .then((userRecord) => {uid = userRecord?.uid;})
        const payload = { userName, uid }
        res.status(200).send(payload)
    } catch (error) {
        res.status(400).send(error)
        LOGGER.error("error in getUserWithEmail")
    }}
module.exports = {
    generateAccessTokenFromRefreshToken,
    userLogin, forgotPasswordRequest,
    verifyotp, resetPassword,logoutFromAll, logout,
    getUserWithEmail, adminLogin}