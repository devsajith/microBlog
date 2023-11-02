const LOGGER = require('../logger/logger.util');
const stringManipulation = require('../generalFunctions/stringManipulations');
const { postErrorCodesAndMessages } = require('../errorCatalogue/postErrorCatalogue');
const postsSchema = require('../models/posts');
const commentSchema = require('../models/comments')
const reportSchema = require('../models/report_post')
const { ACTIVE, DELETED } = require('../generalStatusCatalogue/postsStatus');
const likeStatus = require('../generalStatusCatalogue/likesStatus')
const { ObjectId } = require('mongodb');
const User = require("../models/userModel");
const friendRequestsSchema = require('../models/friend_list')
const userStatus = require('../statusCatalogue/userStatusCatalogue')
const { listPostsOfAUserFunction,listPostsOfAPageFunction,listReportedPostFunction } = require('../modules/postModule/listPostsOfAUserAPI')
const { removePrivatePostsFunction } = require('../generalFunctions/removePostsOfPrivateAccounts')
const { addPostFunction } = require('../modules/postModule/addPostAPI');
const { validatePostId } = require("./validatePostId");
const { authenicationCheck } = require("./authenicationCheck");

function isUrl(str) {
    // Regular expression pattern for URL validation
    var pattern = new RegExp(
        "^(https:\\/\\/)" + // Protocol (mandatory)
        "([a-z0-9\\.-]+\\.[a-z]{2,})" + // Domain name
        "(:\\d{2,5})?" + // Port (optional)
        "(\\/\\S*)?$", // Path (optional)
        "i" // Case-insensitive
    );
    // Test the string against the pattern
    return pattern.test(str);
}
const addPost = async (req, res) => {
    LOGGER.info('addPost')
    try {
        const result = addPostFunction(req, res)
        return result

    } catch (error) {
        LOGGER.error('addPost', error)
    }
};
const listPosts = async (req, res) => {
    LOGGER.info('listPosts');
    try {
        const limit = parseInt(req.query.limit) || 20
        const skip = parseInt(req.query.skip) || 0
        const NO_DATA = "no data found"
        const resultFromDb = await querySelectionForFiltering(req)
        const totalDocs = resultFromDb.length
        let finalResult = []
        let skipResult = resultFromDb.slice(skip)
        for (let i = 0; i < limit; i++) {
            if (skipResult[i] != undefined) {
                finalResult.push(skipResult[i])
            }
        }
        if (finalResult.length === 0) {
            LOGGER.info('listPosts: no data found')
            return res.status(200).send({ message: NO_DATA })
        }
        if ((totalDocs - skip) > limit) {
            const next = parseInt(skip + limit)
            LOGGER.info('listPosts: Data fetched')
            res.status(200).send({ message: 'success', count: totalDocs, 'skip': next, result: finalResult })
        } else {
            LOGGER.info('listPosts: Data fetched')
            res.status(200).send({ message: 'success', count: totalDocs, result: finalResult })
        }
    } catch (error) {
        LOGGER.error('listPosts', error)
    }
}
async function postRecommendations(req) {
    LOGGER.info('postRecommendations')
    try {
        let postList = []
        const postsSortedInTheDecendingOrderOfScore = await removePrivatePostsFunction(req)
        for (let i = 0; i < postsSortedInTheDecendingOrderOfScore.length; i++) {
            const element = postsSortedInTheDecendingOrderOfScore[i];
            const currentTime = new Date().getTime()
            const activeInteractionScore = element.comment_score
            const ageOfPost = (currentTime - element.created_date) / 86400000
            const decayFactor = 0.1
            const timeDecayedScore = (activeInteractionScore * (1 - decayFactor) ** ageOfPost)
            const data = {
                _id: element._id,
                text: element.text,
                imageUrl: element.imageUrl,
                user_id: element.user_id,
                created_date: element.created_date,
                updated_date: element.updated_date,
                status: element.status,
                version: element.version,
                likes: element.likes,
                comment_score: element.comment_score,
                decay_score: timeDecayedScore,
                sharedBy: element.shared_by
            }
            postList.push(data)
        }
        const postListSorted = postList.sort(sortByDecayScore)
        return postListSorted;
    } catch (error) {
        LOGGER.error('postRecommendations', error)
    }
}
function sortByDecayScore(obj1, obj2) {
    if (obj1.decay_score < obj2.decay_score) { return 1;}
    if (obj1.decay_score > obj2.decay_score) {
        return -1;
    }
    return 0;}
async function friendPost(req) {
    LOGGER.info('friendPost')
    try {
        let userList = []
        const userId = req.user._id.toString()
        const resultsFromGlobalSearch = await friendRequestsSchema
            .find({
                $or: [
                    { reciever_user: userId, status: userStatus.userStatus.ACTIVE },
                    { requested_user: userId, status: userStatus.userStatus.ACTIVE }
                ]})
            .populate({
                path: 'requested_user',
                options: { skipNulls: true }
            })
            .populate({
                path: 'reciever_user',
                options: { skipNulls: true }
            }).lean();
        for (let i = 0; i < resultsFromGlobalSearch.length; i++) {
            const element = resultsFromGlobalSearch[i];

            if (element.reciever_user._id.toString() == userId) {

                userList.push(element.requested_user._id.toString())
            } else {
                userList.push(element.reciever_user._id.toString()) }}
        const postOfFriend = await postsSchema
        .find({
            $and:[
                {$or: [
                    { user_id: { $in: userList } },
                    { shared_by: { $in: userList } },
                  ]},
                  {$and:[
                    {status:ACTIVE}
                  ]}
            ]
          })
            .populate('user_id', 'userName photo email')
        return postOfFriend.reverse()
    } catch (error) {
        LOGGER.error('friendPost', error)
    }
}
async function querySelectionForFiltering(req, res) {
    LOGGER.info('querySelectionForFiltering')
    try {
        let filterCriteria = req.query.sort
        let returnObject
        switch (filterCriteria) {
            case "recommendations":
                returnObject = postRecommendations(req)
                return returnObject
            case "friends":
                returnObject = friendPost(req, res)
                return returnObject
            case "global":
                returnObject = removePrivatePostsFunction(req)
                return returnObject
            default:
                returnObject = postRecommendations(req)
                return returnObject}
    } catch (error) {LOGGER.error('querySelectionForFiltering', error)}}
const getPost = async (req, res) => {
    LOGGER.info('getPost')
    try {
        const id = stringManipulation.trimStrings(req.params.id);
        const postId = stringManipulation.removeSpecialCharactersAndSymbols(id)
        let errorsArray = validatePostId(postId)
        if (errorsArray.length != 0) { res.status(400).send(errorsArray)}
        const query = { _id: ObjectId(postId), status: ACTIVE }
        const result = await postsSchema
            .findOne(query)
            .populate('user_id', 'email photo userName ')
        if (result) {res.status(200).send({ message: 'success', result: result })
        } else {res.status(400).send(postErrorCodesAndMessages.INVALID_POST_ID) }
} catch (error) {LOGGER.error('getPost', error)}};
const deletePost = async (req, res) => {
    LOGGER.info('deletePost')
    try {
        const userId = req.user._id
        const postIdBeforeProcessing = stringManipulation.trimStrings(req.params.id);
        const postId = stringManipulation.removeSpecialCharactersAndSymbols(postIdBeforeProcessing)
        let errorsArray = []
        errorsArray = validatePostId(postId)
        if (errorsArray.length != 0) {res.status(400).send(errorsArray)} else {
            const query = { _id: ObjectId(postId), status: ACTIVE }
            const postRecord = await postsSchema
                .findOne(query)
                .populate('user_id', 'email photo userName ')
            if (!postRecord) {res.status(400).send(postErrorCodesAndMessages.INVALID_POST_ID)}
            const authorOfPostId = postRecord.user_id._id
            const authenicationCheckResult = authenicationCheck(userId, authorOfPostId)
            if (authenicationCheckResult) { errorsArray.push(authenicationCheckResult)}
            if (errorsArray.length != 0) {
                res.status(400).send(errorsArray)} else {
                postRecord.status = DELETED;
                await commentSchema.updateMany({ post_id: postId }, { status: DELETED });
                await postRecord.save();
                res.status(200).send({ message: "post successfully deleted" })}}
    } catch (error) {LOGGER.error('deletePost', error)}};
const updatePost = async (req, res) => {
    LOGGER.info('updatePost')
    try {
        const textCharacterLimit = 3000;
        const text = req.body.text;
        const imageUrl = req.body.imageUrl
        const userId = req.user._id
        const postIdBeforeProcessing = stringManipulation.trimStrings(req.params.id);
        const postId = stringManipulation.removeSpecialCharactersAndSymbols(postIdBeforeProcessing)
        let versionNumber = stringManipulation.trimStrings(req.body.version)
        if (!versionNumber || versionNumber == null || versionNumber == "") {
            res.status(400).send(postErrorCodesAndMessages.VERSION_REQUIRED)
        } else {
            if (isNaN(versionNumber)) {res.status(400).send(postErrorCodesAndMessages.INVALID_VERSION)}}
        let errorsArray = []
        errorsArray = validatePostId(postId)
        if (errorsArray.length != 0) { res.status(400).send(errorsArray)} else {
            if ((text == null || text == "") && (imageUrl == null || imageUrl == "")) {
                errorsArray.push(postErrorCodesAndMessages.NOTHING_TO_POST)}
            if (text) {
                if (text.length > textCharacterLimit) {errorsArray.push(postErrorCodesAndMessages.INVALID_TEXT)}}
            if (imageUrl) {
                if (isUrl(imageUrl) == false) {errorsArray.push(postErrorCodesAndMessages.INVALID_PHOTO_URL) } }
            const query = { _id: ObjectId(postId), status: ACTIVE }
            const postRecord = await postsSchema
                .findOne(query)
                .populate('user_id', 'email photo userName ')
            if (!postRecord) { res.status(400).send(postErrorCodesAndMessages.INVALID_POST_ID)}
            const authorOfPostId = postRecord.user_id._id
            const authenicationCheckResult = authenicationCheck(userId, authorOfPostId)
            if (authenicationCheckResult) {errorsArray.push(authenicationCheckResult)}
            let postVersion = postRecord.version
            if (errorsArray.length != 0) {res.status(400).send(errorsArray) } else {
                if (postVersion === Number(versionNumber)) {
                    const updateFields = {
                        text: text,
                        imageUrl: imageUrl,
                        updated_date: new Date().getTime(),
                        version: Number(versionNumber) + 1
                    };
                    await postsSchema.findByIdAndUpdate(postId, updateFields)
                    return res.status(200).send({ message: "post successfully updated" })}
                res.status(400).send(postErrorCodesAndMessages.VERSION_MISSMATCH)}}
    } catch (error) {LOGGER.error('updatePost', error)}
};
const likePost = async (req, res) => {
    LOGGER.info('likePost')
    try {
        const userId = req.user._id
        const postIdBeforeProcessing = stringManipulation.trimStrings(req.params.id);
        const postId = stringManipulation.removeSpecialCharactersAndSymbols(postIdBeforeProcessing);
        let errorsArray = validatePostId(postId)
        if (errorsArray.length != 0) { res.status(400).send(errorsArray) }
        const query = { _id: ObjectId(postId), status: ACTIVE }
        let results = await postsSchema
            .findOne(query)
        if (results) {let index = results.likes.indexOf(userId.toString());
            if ((results.likes.includes(userId.toString())) && (index !== -1)) {
            
                return res.status(200).send(likeStatus.ALREADY_LIKED)
            } else {results.likes.push(userId)
                await results.save()
                return res.status(200).send(likeStatus.LIKED) }
        } else { res.status(400).send(postErrorCodesAndMessages.INVALID_POST_ID) }
    } catch (error) { LOGGER.error('likePost', error)}
};
const undoLike = async (req, res) => {
    LOGGER.info('undoLike')
    try {
        const userId = req.user._id
        const postIdBeforeProcessing = stringManipulation.trimStrings(req.params.id);
        const postId = stringManipulation.removeSpecialCharactersAndSymbols(postIdBeforeProcessing);
        let errorsArray = validatePostId(postId)
        if (errorsArray.length != 0) { res.status(400).send(errorsArray) }
        const query = { _id: ObjectId(postId), status: ACTIVE }
        let results = await postsSchema
            .findOne(query)
        if (results) {
            let index = results.likes.indexOf(userId.toString());
            if ((results.likes.includes(userId.toString())) && (index !== -1)) {
                results.likes.splice(index, 1)
                await results.save()
                return res.status(200).send(likeStatus.UNLIKED_POST)
            } else {
                return res.status(200).send(likeStatus.NOT_LIKED)
            }
        } else { res.status(400).send(postErrorCodesAndMessages.INVALID_POST_ID) }
    } catch (error) { LOGGER.error('undoLike', error)}
};
const listLikedUsers = async (req, res) => {
    LOGGER.info('listLikedUsers')
    try {
        const limit = parseInt(req.query.limit) || 30; const skip = parseInt(req.query.skip) || 0;
        const postIdBeforeProcessing = stringManipulation.trimStrings(req.params.id);
        const postId = stringManipulation.removeSpecialCharactersAndSymbols(postIdBeforeProcessing)
        let errorsArray = validatePostId(postId)
        if (errorsArray.length != 0) { res.status(400).send(errorsArray)}
        const query = { _id: ObjectId(postId), status: ACTIVE }
        const results = await postsSchema
            .findOne(query)
            .populate('likes', 'email _id userName photo ')
        if (results) {
            let likedUsersArray = [];
            for (let i = 0; i < results.likes.length; i++) {
                const element = results.likes[i];
                likedUsersArray.push(element)}
            likedUsersArray.reverse()
            let likeCount = likedUsersArray.length;
            let finalResult = []
            let skipResult = likedUsersArray.slice(skip)
            for (let i = 0; i < limit; i++) {
                if (skipResult[i] != undefined) {finalResult.push(skipResult[i])}}
            if (likedUsersArray.length != 0) {
                if ((likeCount - skip) > limit) { const next = parseInt(skip + limit)
                    res.status(200).send({ message: "success", 'count': likeCount, 'skip': next, 'result': finalResult })} 
                    else { res.status(200).send({ message: "success", 'count': likeCount, 'result': finalResult }) }
            } else { res.status(200).send({ message: "no likes yet" }) }
        } else { res.status(400).send(postErrorCodesAndMessages.INVALID_POST_ID) }
    } catch (error) {LOGGER.error('listLikedUsers', error) }
};
const listPostsOfAUser = async (req, res) => {
    LOGGER.info('listPostsOfAUser')
    try { const result = listPostsOfAUserFunction(req, res)
        return result } catch (error) { LOGGER.error('listPostsOfAUser', error) }
};
const listPostsOfPage = async (req, res) => {
    LOGGER.info('listPostsOfAUser')
    try {
        const result = listPostsOfAPageFunction(req, res)
        return result} catch (error) {  LOGGER.error('listPostsOfPage', error)}};
const sharePost = async (req, res)=>{
    LOGGER.info('sharePost')
    try {
        const userId = req.user._id
        const postIdBeforeProcessing = stringManipulation.trimStrings(req.params.id);
        const postId = stringManipulation.removeSpecialCharactersAndSymbols(postIdBeforeProcessing);
        let errorsArray = validatePostId(postId)
        const userDetails = await User.find({_id:userId})
        const sharedData = {userName:userDetails[0].userName,email:userDetails[0].email,Id:userDetails[0]._id}
        if (errorsArray.length != 0) { res.status(400).send(errorsArray) }
        const query = { _id: ObjectId(postId), status: ACTIVE }
        let results = await postsSchema
            .findOne(query)
        if (results) {
            let index = results.shared_by.indexOf(userId.toString());
            if ((results.shared_by.includes(userId.toString())) && (index !== -1)) {
                return res.status(200).send("ALREADY SHARED")
            } else {
                results.shared_by.push(sharedData)
                await results.save()
                return res.status(200).send("SHARED SUCCESSFULLY")}} else {
            res.status(400).send(postErrorCodesAndMessages.INVALID_POST_ID)}
    } catch (error) {
        LOGGER.error('sharePost', error) }}
// report post
const reportPost = async (req, res) => {
    LOGGER.info('reportPost');
    try {
      const textCharacterLimit = 1000;
      const userId = req.user._id;
      const postIdBeforeProcessing = stringManipulation.trimStrings(req.params.id);
      const postId = stringManipulation.removeSpecialCharactersAndSymbols(postIdBeforeProcessing);
      const comment = stringManipulation.trimStrings(req.body.comment);
      let errorsArray = [];
      if (comment == null || comment === "") { errorsArray.push(postErrorCodesAndMessages.COMMENT_REQUIRED); }
      if (comment && comment.length > textCharacterLimit) { errorsArray.push(postErrorCodesAndMessages.INVALID_COMMENT);}
      if (comment.length > textCharacterLimit) { errorsArray.push(postErrorCodesAndMessages.COMMENT_EXCEEDS);}
      if (validatePostId(postId).length > 0) { res.status(400).send(postErrorCodesAndMessages.INVALID_POST_ID);}
      const postIdValidation = await postsSchema.findOne({ _id: ObjectId(postId), status: ACTIVE });
      if (!postIdValidation) {  return res.status(400).send(postErrorCodesAndMessages.INVALID_POST_ID);}
      if (postIdValidation.user_id.equals(userId)) {return res.status(400).send({ error: "You cannot report your own post." }); }
      if (errorsArray.length > 0) {return res.status(400).send(errorsArray); } else {
        const existingReport = await reportSchema.findOne({ user_id: userId, post_id: postId });
        if (existingReport) {return res.status(400).send({ error: "You have already reported this post." });}
       const report = new reportSchema({ user_id: userId, post_id: postId, comment: comment });
        try { await report.save();
          return res.status(200).send({ message: "Post successfully reported" });
        } catch (error) { LOGGER.error('reportPost', error);
          return res.status(400).send({ error: 'An error occurred while processing the request.' });}}
    } catch (error) {LOGGER.error('reportPost', error);
      return res.status(400).send({ error: 'An error occurred while processing the request.' });}};

  const listReportedPost = async (req, res) => { LOGGER.info('listPostsOfAUser')
    try { const result = listReportedPostFunction(req, res)
        return result } catch (error) { LOGGER.error('listPostsOfAUser', error) }
};
module.exports = {
    addPost, listPosts, getPost, deletePost, updatePost,likePost,listLikedUsers, undoLike,listPostsOfAUser,listPostsOfPage,sharePost,reportPost,listReportedPost}