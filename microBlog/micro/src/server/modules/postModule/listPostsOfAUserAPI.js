const LOGGER = require("../../logger/logger.util");
const postsSchema = require("../../models/posts");
const { ACTIVE } = require("../../generalStatusCatalogue/postsStatus");
const { validateUserId } = require("../../generalFunctions/userIdValidation");
const friend_list = require("../../models/friend_list");
const { ObjectId } = require("mongodb");
const User = require("../../models/userModel");
const reportSchema = require("../../models/report_post");

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns a paginated list of posts by a user.
 */
async function listPostsOfAUserFunction(req, res) {
  LOGGER.info("listPostsOfAUserFunction");
  try {
    const limit = parseInt(req.query.limit) || 20;
    const skip = parseInt(req.query.skip) || 0;
    const userId = req.params.id;
    const currentUserId = req.user._id;
    if (userId == currentUserId.toString()) {
      const NO_DATA = "no data found";
      const resultFromDb = await postsSchema
        .find({ user_id: ObjectId(currentUserId), status: ACTIVE })
        .populate("user_id", "email photo userName access")
        .lean();
      const totalDocs = resultFromDb.length;
      let finalResult = [];
      let skipResult = resultFromDb.slice(skip);
      for (let i = 0; i < limit; i++) {
        if (skipResult[i] != undefined) {
          finalResult.push(skipResult[i]);
        }
      }
      if (finalResult.length === 0) {
        LOGGER.info("listPosts: no data found");
        return res.status(200).send({ message: NO_DATA });
      }
      if (totalDocs - skip > limit) {
        const next = parseInt(skip + limit);
        LOGGER.info("listPosts: Data fetched");
        res
          .status(200)
          .send({
            message: "success",
            count: totalDocs,
            skip: next,
            result: finalResult,
          });
      } else {
        LOGGER.info("listPosts: Data fetched");
        res
          .status(200)
          .send({ message: "success", count: totalDocs, result: finalResult });
      }
    } else {
      const userIdValidationResult = validateUserId(req.params.id);
      if (userIdValidationResult) {
        return res.status(400).send(userIdValidationResult);
      }
      const NO_DATA = "no data found";
      const resultFromDb = await postsSchema
        .find({ user_id: ObjectId(userId), status: ACTIVE })
        .populate("user_id", "email photo userName access")
        .lean();
      const resultFromuserDb = await User.findOne({
        _id: ObjectId(userId),
        status: ACTIVE,
      }).lean();

      const totalDocs = resultFromDb.length;
      if (resultFromuserDb.access == 0) {
        const friendDetails = await friend_list
          .findOne({
            $or: [
              { reciever_user: ObjectId(userId) },
              { requested_user: ObjectId(userId) },
            ],
          })
          .sort({ _id: -1 })
          .limit(1);
        if (friendDetails != "") {
          let tempFriendDetail = 0;
          if (
            friendDetails.reciever_user.toString() == userId &&
            friendDetails.requested_user.toString() == req.user._id
          ) {
            tempFriendDetail = friendDetails.status;
          } else if (
            friendDetails.requested_user.toString() == userId &&
            friendDetails.reciever_user.toString() == req.user._id
          ) {
            tempFriendDetail = friendDetails.status;
          }
          if (tempFriendDetail != 1) {
            return res.status(200).send({ message: "You are not a friend" });
          }
        }
      }
      let finalResult = [];
      let skipResult = resultFromDb.slice(skip);
      for (let i = 0; i < limit; i++) {
        if (skipResult[i] != undefined) {
          finalResult.push(skipResult[i]);
        }
      }
      if (finalResult.length === 0) {
        LOGGER.info("listPosts: no data found");
        return res.status(200).send({ message: NO_DATA });
      }
      if (totalDocs - skip > limit) {
        const next = parseInt(skip + limit);
        LOGGER.info("listPosts: Data fetched");
        res
          .status(200)
          .send({
            message: "success",
            count: totalDocs,
            skip: next,
            result: finalResult,
          });
      } else {
        LOGGER.info("listPosts: Data fetched");
        res
          .status(200)
          .send({ message: "success", count: totalDocs, result: finalResult });
      }
      7;
    }
  } catch (error) {
    LOGGER.error("listPostsOfAUserFunction", error);
  }
}
async function listPostsOfAPageFunction(req, res) {
  LOGGER.info("listPostsOfAPageFunction");
  try {
    const limit = parseInt(req.query.limit) || 20;
    const skip = parseInt(req.query.skip) || 0;
    const userIdValidationResult = validateUserId(req.params.pageId);
    if (userIdValidationResult) {
      return res.status(400).send(userIdValidationResult);
    }
    const NO_DATA = "no data found";
    const pageId = req.params.pageId;
    const resultFromDb = await postsSchema
      .find({ page_id: pageId, status: ACTIVE })
      .populate("user_id", "email photo userName ")
      .lean();
    const totalDocs = resultFromDb.length;
    let finalResult = [];
    let skipResult = resultFromDb.slice(skip);
    for (let i = 0; i < limit; i++) {
      if (skipResult[i] != undefined) {
        finalResult.push(skipResult[i]);
      }
    }
    if (finalResult.length === 0) {
      LOGGER.info("listPosts: no data found");
      return res.status(200).send({ message: NO_DATA });
    }
    if (totalDocs - skip > limit) {
      const next = parseInt(skip + limit);
      LOGGER.info("listPosts: Data fetched");
      res
        .status(200)
        .send({
          message: "success",
          count: totalDocs,
          skip: next,
          result: finalResult,
        });
    } else {
      LOGGER.info("listPosts: Data fetched");
      res
        .status(200)
        .send({ message: "success", count: totalDocs, result: finalResult });
    }
  } catch (error) {
    LOGGER.error("listPostsOfAPageFunction", error);
  }
}
async function listReportedPostFunction(req, res) {
  LOGGER.info("listReportedPostFunction");
  try {
    const reportTable = await reportSchema.find().sort({ _id: -1 }); // Fetch all reports, sorted by createdAt in descending order
    const NO_DATA = "no data found";
    let resultReportTable = [];

    for (const report of reportTable) {
      const post = await postsSchema.findOne({ _id: report.post_id });
      const reportedUser = await User.findOne({ _id: report.user_id });

      if (post && reportedUser) {
        resultReportTable.push({
          post: {
            post_id: post._id,
            post_text: post.text,
            post_image: post.imageUrl,
            reported_user_name: reportedUser.userName,
            comment: report.comment,
          }
        });
      }
    }
    
    if (resultReportTable.length === 0) {
      LOGGER.info("listPosts: no data found");
      return res.status(200).send({ message: NO_DATA });
    }

    LOGGER.info("listPosts: Data fetched");
    res.status(200).send({
      message: "success",
      count: resultReportTable.length,
      result: resultReportTable,
    });
  } catch (error) {
    LOGGER.error("listReportedPostFunction", error);
  }
}




module.exports = {
  listPostsOfAUserFunction,
  listPostsOfAPageFunction,
  listReportedPostFunction,
};
