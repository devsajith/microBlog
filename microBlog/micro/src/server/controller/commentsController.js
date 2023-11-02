const LOGGER = require('../logger/logger.util');
const commentSchema = require('../models/comments')
const stringManipulation = require('../generalFunctions/stringManipulations');
const { ACTIVE, DELETED } = require('../statusCatalogue/commentStatus');
const { validatePostId } = require('../generalFunctions/postIdValidation');
const { ObjectId } = require('mongodb');
const { commentErrorCodesAndMessages } = require('../errorCatalogue/commentErrorCatalogue')
const postsSchema = require('../models/posts');
const { validateCommentId } = require('../generalFunctions/commentValidation');
const { authenicationCheck } = require('../generalFunctions/authenticationCheck');
const { postErrorCodesAndMessages } = require('../errorCatalogue/postErrorCatalogue');
const { weightForPosts } = require('../postRecomendation/settingWeightsForPosts');
const likeStatus = require('../generalStatusCatalogue/likesStatus')

const addComment = async (req, res) => {
    LOGGER.info('addComment')
    try {
        const textCharacterLimit = 1000;

        const userId = req.user._id
        const postIdBeforeProcessing = stringManipulation.trimStrings(req.params.id);
        let parentComment;
        const postId = stringManipulation.removeSpecialCharactersAndSymbols(postIdBeforeProcessing);
        const comment = stringManipulation.trimStrings(req.body.comment);
        let errorsArray = []
        if (req.body.parentComment) {
            const parentCommentBeforeProcessing = stringManipulation.trimStrings(req.body.parentComment)
            parentComment = stringManipulation.removeSpecialCharactersAndSymbols(parentCommentBeforeProcessing)
            const existingParentComment = await commentSchema.findOne({ _id: ObjectId(parentComment) })
            if (!existingParentComment) {
                return res.status(400).send(commentErrorCodesAndMessages.INVALID_ID)
            }
            if (existingParentComment.parent_comment != null) {
                return res.status(400).send(commentErrorCodesAndMessages.INVALID_ID)
            }
        }
        if ((comment == null || comment == "")) {
            errorsArray.push(commentErrorCodesAndMessages.COMMENT_REQUIRED)
        }
        if (comment) {
            if (comment.length > textCharacterLimit) {
                errorsArray.push(commentErrorCodesAndMessages.INVALID_COMMENT)
            }

        }
        if (validatePostId(postId).length > 0) {
            res.status(400).send(postErrorCodesAndMessages.INVALID_POST_ID)
            // errorsArray.push(validatePostId(postId))
        }
        const postIdValidation = await postsSchema.findOne({ _id: ObjectId(postId), status: ACTIVE })
        if (!postIdValidation) {
            return res.status(400).send(postErrorCodesAndMessages.INVALID_POST_ID)
        }
        if (errorsArray.length > 0) {
            return res.status(400).send(errorsArray)
        } else {
            commentPayloadSelector(parentComment, comment, postId, userId)

            return res.status(200).send({ message: "comment successfully added" })
        }
    } catch (error) {
        LOGGER.error('addComment', error)
    }
};
async function commentPayloadSelector(parentComment, comment, postId, userId) {
    LOGGER.info('commentPayloadSelector')
    try {
        const payload = {
            comment: comment,
            post_id: postId,
            user_id: userId,
            
            created_date: new Date().getTime(),
            updated_date: new Date().getTime(),
            version: 1,
            status: ACTIVE
        }
        if (parentComment) {
            payload.parent_comment = parentComment

            await addCommnetWeightToPosts(postId)
            const commentPayload = new commentSchema(payload)
            await commentPayload.save()
        } else {

            await addCommnetWeightToPosts(postId)
            const commentPayload = new commentSchema(payload)
            await commentPayload.save()
        }
    } catch (error) {
        LOGGER.error('commentPayloadSelector', error)
    }
}
async function addCommnetWeightToPosts(postId) {
    LOGGER.info('addCommnetWeightToPosts')
    try {

        const post = await postsSchema.findOne({ _id: ObjectId(postId), status: ACTIVE })
        const commentScorePayload = {
            comment_score: post.comment_score + weightForPosts.COMMENT_WEIGHT
        }
        await postsSchema.findByIdAndUpdate(postId, commentScorePayload)
        return
    } catch (error) {
        LOGGER.error('addCommnetWeightToPosts', error)
    }
}


const listComments = async (req, res) => {
    LOGGER.info('listComments')
    try {
        const NO_DATA = "no data found"
        let sortObj;
        sortObj= await querySelectionForFilterComment(req,res)
        const limit = parseInt(req.query.limit) || 20
        const skip = parseInt(req.query.skip) || 0
        const postIdofPost = stringManipulation.trimStrings(req.params.id);
        const postId = stringManipulation.removeSpecialCharactersAndSymbols(postIdofPost)
        let errorsArray = validatePostId(postId)
        if (errorsArray.length != 0) {
            res.status(400).send(errorsArray)
        }

        const queryForParentComments = { post_id: ObjectId(postId), status: ACTIVE, parent_comment: null }//parent_id should not exist

        let comment = []
        const resultFromDb = await commentSchema
        .find(queryForParentComments)
        .populate('user_id', '_id email userName photo')
        .sort(sortObj)

        for (let i = 0; i < resultFromDb.length; i++) {
            const element = resultFromDb[i];

            const replyFromDb = await commentSchema
                .find({ post_id: ObjectId(postId), status: ACTIVE, parent_comment: element._id }, { __v: 0, status: 0 })
                .populate('user_id', '_id email userName photo')

            let commentResult = {
                _id: element._id,
                post_id: element.post_id,
                user_id: element.user_id,
                comment: element.comment,
                reply_comment: replyFromDb,
                version: element.version,
                created_date: element.created_date,
                likes:element.likes
            }
            comment.push(commentResult)

        }
        if(req.query.sort==="mostreply"){
            comment.sort((a,b)=> b.reply_comment.length-a.reply_comment.length);
        }
        // comment.reverse()
        let finalResult = []
        let skipResult = comment.slice(skip)
        for (let i = 0; i < limit; i++) {
            if (skipResult[i] != undefined) {
                finalResult.push(skipResult[i])
            }
        }


        if (finalResult.length === 0) {
            LOGGER.info('listPosts: no data found')
            return res.status(200).send({ message: NO_DATA })
        }
        const totalDocs = resultFromDb.length
        if ((totalDocs - skip) > limit) {
            const next = parseInt(skip + limit)
            LOGGER.info('listPosts: Data fetched')
            res.status(200).send({ message: 'success', count: totalDocs, 'skip': next, result: finalResult })
        } else {
            LOGGER.info('listPosts: Data fetched')
            res.status(200).send({ message: 'success', count: totalDocs, result: finalResult })

        }


    } catch (error) {
        LOGGER.error('listComments', error)
    }
};
const updateComment = async (req, res) => {
    LOGGER.info('updateComment')
    try {
        const textCharacterLimit = 1000;
        const userId = req.user._id;
        const commenIdBeforeProcessing = stringManipulation.trimStrings(req.params.id);
        const commentId = stringManipulation.removeSpecialCharactersAndSymbols(commenIdBeforeProcessing);
        const query = { _id: ObjectId(commentId), status: ACTIVE }
        let versionNumber = stringManipulation.trimStrings(req.body.version)
        if (req.body.parentComment) {
            const parentCommentBeforeProcessing = stringManipulation.trimStrings(req.body.parentComment)

            parentComment = stringManipulation.removeSpecialCharactersAndSymbols(parentCommentBeforeProcessing)
        }
        if (!versionNumber || versionNumber == null || versionNumber == "") {
            res.status(400).send(commentErrorCodesAndMessages.VERSION_REQUIREDL)
        } else {

            if (isNaN(versionNumber)) {
                res.status(400).send(commentErrorCodesAndMessages.INVALID_VERSION)
            }
        }
        const comment = stringManipulation.trimStrings(req.body.comment);
        let errorsArray = []
        let parentComment;
        if ((comment == null || comment == "")) {
            errorsArray.push(commentErrorCodesAndMessages.COMMENT_REQUIRED)
        }
        if (comment) {
            if (comment.length > textCharacterLimit) {
                errorsArray.push(commentErrorCodesAndMessages.INVALID_COMMENT)
            }

        }

        const commentRecord = await commentSchema.findOne(query)
        if (!commentRecord) {
            res.status(400).send(commentErrorCodesAndMessages.INVALID_ID)
        }

        const authorOfComment = commentRecord.user_id._id;
        const authenicationCheckResult = authenicationCheck(userId, authorOfComment);
        if (authenicationCheckResult) {
            errorsArray.push(authenicationCheckResult)
        }
        let commentVersion = commentRecord.version

        if (errorsArray.length != 0) {
            res.status(400).send(errorsArray)
        } else {
            if (commentVersion === Number(versionNumber)) {
                const updateFields = {
                    comment: comment,
                    parent_comment: parentComment,
                    updated_date: new Date().getTime(),
                    version: Number(versionNumber) + 1
                };
                await commentSchema.findByIdAndUpdate(commentId, updateFields)
                return res.status(200).send({ message: "comment successfully updated" })
            }
            res.status(400).send(commentErrorCodesAndMessages.VERSION_MISSMATCH)
        }
    } catch (error) {
        LOGGER.error('updateComment', error)
    }
};

const deleteComment = async (req, res) => {
    LOGGER.info('deleteComment')
    try {
        const userId = req.user._id;
        const commenIdBeforeProcessing = stringManipulation.trimStrings(req.params.id);
        const commentId = stringManipulation.removeSpecialCharactersAndSymbols(commenIdBeforeProcessing);
        let errorsArray = []
        errorsArray = validateCommentId(commentId);
        if (errorsArray != 0) {
            res.status(400).send(errorsArray)
        } else {
            const query = { _id: ObjectId(commentId), status: ACTIVE }
            const commentsRecord = await commentSchema
                .findOne(query)
                .populate('user_id', 'email photo userName ')
            if (!commentsRecord) {
                res.status(400).send(commentErrorCodesAndMessages.INVALID_ID)
            }
            const postId = commentsRecord.post_id
            const authorOfComment = commentsRecord.user_id._id
            const authenicationCheckResult = authenicationCheck(userId, authorOfComment)
            if (authenicationCheckResult) {
                errorsArray.push(authenicationCheckResult)
            }
            if (errorsArray.length != 0) {
                res.status(400).send(errorsArray)
            } else {
                await commentSchema.updateMany({ parent_comment: commentId }, { status: DELETED });
                commentsRecord.status = DELETED
                await commentsRecord.save();
                const numberOfActiveComments = await commentSchema.count({ post_id: postId, status: ACTIVE })
                // const post = await postsSchema.findOne({ _id: ObjectId(postId), status: ACTIVE })
                const commentScorePayload = {
                    comment_score: weightForPosts.COMMENT_WEIGHT * numberOfActiveComments
                }
                await postsSchema.findByIdAndUpdate({ _id: ObjectId(postId) }, commentScorePayload)
                res.status(200).send({ message: "comment successfully deleted" })
            }
        }
    } catch (error) {
        LOGGER.error('deleteComment', error)
    }
};

// like comments
const likeComment = async (req, res) => {
    LOGGER.info('likeComment')
    try {
        const userId = req.user._id
        const commentIdBeforeProcessing = stringManipulation.trimStrings(req.params.id);
        const commentId = stringManipulation.removeSpecialCharactersAndSymbols(commentIdBeforeProcessing);
        let errorsArray = validateCommentId(commentId)
        if (errorsArray.length != 0) {
            res.status(400).send(errorsArray)
        }
        const query = { _id: ObjectId(commentId), status: ACTIVE }
        let results = await commentSchema 
            .findOne(query)
        if (results) {
            let index = results.likes.indexOf(userId.toString());

            if ((results.likes.includes(userId.toString())) && (index !== -1)) {
                // results.likes.splice(index, 1)
                // await results.save()
                return res.status(200).send(likeStatus.ALREADY_LIKED)
            } else {
                results.likes.push(userId)
                await results.save()
                return res.status(200).send(likeStatus.LIKED)
            }
        } else {
            res.status(400).send(commentErrorCodesAndMessages.INVALID_ID)
        }


    } catch (error) {
        LOGGER.error('likeComment', error)
    }
};

// undo-like comment
const undoLike = async (req, res) => {
    LOGGER.info('undoLike')
    try {
        const userId = req.user._id
        const commentIdBeforeProcessing = stringManipulation.trimStrings(req.params.id);
        const commentId = stringManipulation.removeSpecialCharactersAndSymbols(commentIdBeforeProcessing);
        let errorsArray = validateCommentId(commentId)
        if (errorsArray.length != 0) {
            res.status(400).send(errorsArray)
        }
        const query = { _id: ObjectId(commentId), status: ACTIVE }
        let results = await commentSchema
            .findOne(query)
        if (results) {
            let index = results.likes.indexOf(userId.toString());

            if ((results.likes.includes(userId.toString())) && (index !== -1)) {
                results.likes.splice(index, 1)
                await results.save()
                return res.status(200).send(likeStatus.UNLIKED_COMMENT)
            } else {
                // results.likes.push(userId)
                // await results.save()
                return res.status(200).send(likeStatus.NOT_LIKED)
            }
        } else {
            res.status(400).send(postErrorCodesAndMessages.INVALID_POST_ID)
        }
    } catch (error) {
        LOGGER.error('undoLike', error)
    }
};

// comment sort
async function querySelectionForFilterComment(req) {
    LOGGER.info('querySelectionForFilterComment')
    try {
        let filterCriteria = req.query.sort
        let returnObject
        switch (filterCriteria) {
            case "latest":
                returnObject = {created_date:-1}
                return returnObject
            case "oldest":
                returnObject = {created_date:1}
                return returnObject
            default:
                returnObject ={created_date:1}
                return returnObject
        }
    } catch (error) {
        LOGGER.error('querySelectionForFilterComment', error)
    }
}

module.exports = {
    addComment,
    listComments,
    updateComment,
    deleteComment,
    likeComment,
    undoLike
}
/**
 * Testing merges
 */