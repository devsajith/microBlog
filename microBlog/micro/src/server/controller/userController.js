/* eslint-disable no-undef */
const User = require("../models/userModel");
const date = new Date();
const { validationResult } = require("express-validator");
const { ObjectId } = require("mongodb");
const LOGGER = require("../logger/logger.util");
const userError = require("../errorCatalogue/userErrorCatalogue");
const regex = require("../regularExpressions/regularExpressions");
const { userStatus } = require("../statusCatalogue/userStatusCatalogue");
const {
  globalSearchFunction,
} = require("../modules/userModule/globalSearchAPI");
const friend_list = require("../models/friend_list");
const blockingSchema = require("../models/blocked_users");
const { friendStatus } = require("../statusCatalogue/friendStatusCatalogue");
/**
 * add a new user

 */
const addUser = async (req, res) => {
  LOGGER.info("Add user is called");
  try {
    const errors = validationResult(req);
    const errorArray = [];
    if (!errors.isEmpty()) {
      errors.errors.forEach((element) => {
        LOGGER.error("Validation error occured user creation" + element.msg);
        errorArray.push(element.msg);
      });
      return res.status(400).send(errorArray);
    }
    const userPayload = {
      email: req.body.email.toLowerCase(),
      userName: req.body.userName,
      gender: req.body.gender,
      role: 1,
      status: 1,
      version: 1,
      createDate: date.toISOString(),
      updateDate: date.toISOString(),
    };

    if (req.body.about) {
      userPayload.about = req.body.about;
    }
    if (req.body.city) {
      userPayload.city = req.body.city;
    }
    if (req.body.country) {
      userPayload.country = req.body.country;
    }
    if (req.body.phone) {
      userPayload.phone = req.body.phone;
    }
    if (req.body.dob) {
      userPayload.dob = req.body.dob;
    }
    if (req.body.photo) {
      userPayload.photo = req.body.photo;
    }
    const registerPayload = new User(userPayload);
    const existingUser = await User.find({ email: req.body.email });
    if (existingUser.length != 0) {
      res
        .status(400)
        .json(userError.userErrorCodesAndMessages.ALREADY_EXISTING_EMAIL);
      LOGGER.error(userError.userErrorCodesAndMessages.ALREADY_EXISTING_EMAIL);
    } else {
      await registerPayload.save();
      res
        .status(200)
        .json({ message: "Successfully Registered", User: userPayload });
      LOGGER.info("Successful registration", userPayload);
    }
  } catch (error) {
    res.send("Error" + error);
    LOGGER.info("Error in registration", error);
  }
};

const editUser = async (req, res) => {
  LOGGER.info("editUser");
  try {
    const errors = validationResult(req);
    const errorArray = [];
    if (!errors.isEmpty()) {
      errors.errors.forEach((element) => {
        errorArray.push(element.msg);
        LOGGER.error("Validation error occured user updation" + element.msg);
      });
      return res.status(400).send(errorArray);
    }
    const userRecord = await User.findById(req.params.id);
    switch (userRecord.status) {
      case 1:
        {
          userRecord.userName = req.body.userName;
          userRecord.city = req.body.city;
          userRecord.country = req.body.country;
          userRecord.dob = req.body.dob;
          userRecord.about = req.body.about;
          userRecord.phone = req.body.phone;
          userRecord.photo = req.body.photo;
          userRecord.status = userStatus.ACTIVE;
          userRecord.gender = req.body.gender;
          userRecord.access = req.body.access;
          userRecord.cover_photo = req.body.coverPhoto;
        }
        await userRecord.save();
        return res.status(200).json({ message: "success" });
      case 2:
        {
          userRecord.userName = req.body.userName;
          userRecord.city = req.body.city;
          userRecord.country = req.body.country;
          userRecord.dob = req.body.dob;
          userRecord.about = req.body.about;
          userRecord.phone = req.body.phone;
          userRecord.photo = req.body.photo;
          userRecord.status = userStatus.ACTIVE;
          userRecord.gender = req.body.gender;
        }
        await userRecord.save();
        return res.status(200).json({ message: "success" });

      default:
        break;
    }
  } catch (error) {
    LOGGER.error("editUser", error);
    res.send({ error: error });
  }
};

const viewUser = async (req, res) => {
  LOGGER.info("viewUser API is called");
  try {
    const userId = req.params.id;
    const mongoDbRegex = regex.regex.MONGO_DB_REGEX;
    if (userId.match(mongoDbRegex)) {
      const query = { _id: ObjectId(userId), status: userStatus.ACTIVE };
      const projection = {
        createDate: 0,
        updateDate: 0,
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
        version: 0,
        _id: 0,
      };
      const user = await User.findOne(query, projection);
      const friendDetails = await friend_list
        .find({
          $or: [
            {
              $and: [
                { reciever_user: userId },
                { requested_user: req.user._id.toString() },
              ],
            },
            {
              $and: [
                { requested_user:userId },
                { reciever_user: req.user._id.toString() },
              ],
            },
          ],
        })
        .sort({ _id: -1 })
        .limit(1);
      const blockDetail = await blockingSchema
        .find({
          $or: [
            {
              $and: [
                { blocking_user: userId},
                { blocked_user: req.user._id.toString() },
              ],
            },
            {
              $and: [
                { blocked_user: userId },
                { blocking_user: req.user._id.toString() },
              ],
            },
          ],
        })
        .sort({ _id: -1 })
        .limit(1);
      if (user) {
        let responseData = {
          user: {
            ...user._doc,
            friendDetail: 2,
            blockDetail: 1,
          }
        };

        if (friendDetails.length > 0) {
          responseData = {
            user: {
              ...user._doc,
              friendDetail: 2,
              blockDetail: 1,
            },
          };
          if (
            (friendDetails[0].reciever_user.toString() == userId &&
              friendDetails[0].requested_user.toString() ==
                req.user._id.toString()) ||
            (friendDetails[0].requested_user.toString() == userId &&
              friendDetails[0].reciever_user.toString() ==
                req.user._id.toString())
          ) {
            switch (friendDetails[0].status) {
              case 1:
                responseData.user.friendDetail = friendStatus.FRIEND;
                break;

              case 2:
                responseData.user.friendDetail = friendStatus.NOT_FRIEND;
                break;
              case 0:
                responseData.user.friendDetail = friendStatus.PENDING;
            }
          }
        }
        if (blockDetail.length > 0) {
          if (
            (blockDetail[0].blocked_user.toString() == userId &&
              blockDetail[0].blocking_user.toString() ==
                req.user._id.toString()) ||
            (blockDetail[0].blocking_user.toString() == userId &&
              blockDetail[0].blocked_user.toString() == req.user._id.toString())
          ) {
            responseData.user.blockDetail = blockDetail[0].blocking_status;
          }
        }
        res.status(200).send({ message: "success", result: responseData });
        LOGGER.info("view user success");
      } else {
        res
          .status(404)
          .send(userError.userErrorCodesAndMessages.NON_EXISTANT_USER_ID);
        LOGGER.error(
          "error in view user",
          userError.userErrorCodesAndMessages.NON_EXISTANT_USER_ID
        );
      }
    } else {
      res
        .status(404)
        .send(userError.userErrorCodesAndMessages.NON_EXISTANT_USER_ID);
      LOGGER.error(
        "error in view user",
        userError.userErrorCodesAndMessages.NON_EXISTANT_USER_ID
      );
    }
  } catch (error) {
    res
      .status(404)
      .send(userError.userErrorCodesAndMessages.NON_EXISTANT_USER_ID);
    LOGGER.error("error in view user", error);
  }
};

const globalSearch = async (req, res) => {
  LOGGER.info("globalSearch");
  try {
    const result = globalSearchFunction(req, res);
    return result;
  } catch (error) {
    LOGGER.error("globalSearch", error);
  }
};

/**
 * export methods to be used in other places
 */
module.exports = {
  addUser,
  editUser,
  viewUser,
  globalSearch,
};
