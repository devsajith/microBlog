const LOGGER = require('../logger/logger.util');
const pageSchema = require('../models/page');
const pageError = require('../errorCatalogue/pageErrorCatalogue');
const stringManipulation = require('../generalFunctions/stringManipulations');
const { DELETED } = require('../generalStatusCatalogue/postsStatus');
const { ObjectId } = require('mongodb');
const regex = require('../regularExpressions/regularExpressions')
const { pageStatus } = require('../statusCatalogue/pageStatus');
const { validationResult } = require("express-validator");
const { followPageFunction } = require('../modules/pageModule/followPageAPI')
const { unfollowFunction } = require('../modules/pageModule/unfollowPageAPI')
const { listPageFollowersFunction } = require('../modules/pageModule/listPageFollowersAPI')
const { listPagesFollowedByAUserFunction } = require('../modules/pageModule/listPagesFollowedByAUser')
const postsSchema = require('../models/posts');
const { authErrorCodesAndMessages } = require('../errorCatalogue/authErrorCatalogue');

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const createPage = async (req, res) => {
    LOGGER.info('createPage')
    try {
        const userId = req.user.id
        const pageName = stringManipulation.trimStrings(req.body.pageName);
        const about = stringManipulation.trimStrings(req.body.description);
        const profilePhoto = stringManipulation.trimStrings(req.body.profilePhotoUrl);
        const coverPhoto = stringManipulation.trimStrings(req.body.coverPhotoUrl);

        const payload = {
            page_name: pageName,
            creator: userId,
            about: about,
            profile_photo: profilePhoto,
            cover_photo: coverPhoto,
            created_date: new Date().getTime(),
            updated_date: new Date().getTime()
        }
        const pagePayload = new pageSchema(payload)
        await pagePayload.save();
        res.status(200).send({ message: "page successfully created" })
    } catch (error) {
        LOGGER.error('createPage', error)
    }
};
function validatepageId(pageId) {
    LOGGER.info('validatePageId')
    try {
        let errorsArray = []
        if (!pageId) {
            const errorResponse = pageError.PAGE_ID_REQUIRED;
            errorsArray.push(errorResponse);} else {
            if (pageId == null || pageId == "") {
                const errorResponse = pageError.INVALID_ID;
                errorsArray.push(errorResponse);}
            if (!(pageId.match(regex.regex.MONGO_DB_REGEX))) {
                const errorResponse = pageError.INVALID_ID
                errorsArray.push(errorResponse)}}
        LOGGER.info('validation success')
        return errorsArray
    } catch (error) { LOGGER.error('validatePageId', error)}
}
const deletePage = async (req, res) => {
    LOGGER.info('deletePage')
    try {
        const userId = req.user._id
        const pageIdBeforeProcessing = stringManipulation.trimStrings(req.params.id);
        const pageId = stringManipulation.removeSpecialCharactersAndSymbols(pageIdBeforeProcessing)
        let errorsArray = []
        errorsArray = validatepageId(pageId)
        if (errorsArray.length != 0) {res.status(400).send(errorsArray)} else {
            const query = { _id: ObjectId(pageId), status: pageStatus.ACTIVE }
            const pageRecord = await pageSchema
                .findOne(query)
                .populate('creator', 'email photo userName ')
            if (!pageRecord) {res.status(400).send(pageError.INVALID_ID)}
            const authorOfPageId = pageRecord.creator._id
            const authenicationCheckResult = authenicationCheck(userId, authorOfPageId)
            if (authenicationCheckResult) { errorsArray.push(authenicationCheckResult)}
            if (errorsArray.length != 0) {
                res.status(400).send(errorsArray)} else {
                pageRecord.status = pageStatus.DELETED;
                await postsSchema.updateMany({ page_id: pageId }, { status: DELETED });
                await pageRecord.save();
                res.status(200).send({ message: "page successfully deleted" })}}
    } catch (error) {LOGGER.error('deletePage', error)}};

function authenicationCheck(userId, authorOfPageId) {
    LOGGER.info('authenicationCheck')
    try {
        const userIdInternal = userId.toString();
        const authorOfPageIdInternal = authorOfPageId.toString();
        if (userIdInternal != authorOfPageIdInternal) {
            const errorResponse = authErrorCodesAndMessages.ACCESS_DENIED
            return errorResponse
        } } catch (error) {LOGGER.error('authenicationCheck', error)}}

const editPage = async (req, res) => {
    LOGGER.info("editPage");
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
      const pageRecord = await pageSchema.findById(req.params.id);
      switch (pageRecord.status) {
        case 1:
          {
            pageRecord.page_name = req.body.pageName?req.body.pageName:pageRecord.page_name;
            pageRecord.creator = req.user.id?req.user.id:pageRecord.creator;
            pageRecord.about = req.body.description?req.body.description:pageRecord.about;
            pageRecord.dob = req.body.dob?req.body.dob:pageRecord.dob;
            pageRecord.profile_photo =req.body.profilePhotoUrl?req.body.profilePhotoUrl:pageRecord.profile_photo;
            pageRecord.cover_photo = req.body.coverPhotoUrl?req.body.coverPhotoUrl:pageRecord.cover_photo;
          }
          await pageRecord.save();
          return res.status(200).json({ message: "Page edited successfully" });
        case 2:
          {
            pageRecord.page_name = req.body.pageName?req.body.pageName:pageRecord.page_name;
            pageRecord.creator = req.user.id?req.user.id:pageRecord.creator;
            pageRecord.about = req.body.description?req.body.description:pageRecord.about;
            pageRecord.dob = req.body.dob?req.body.dob:pageRecord.dob;
            pageRecord.profile_photo =req.body.profilePhotoUrl?req.body.profilePhotoUrl:pageRecord.profile_photo;
            pageRecord.cover_photo = req.body.coverPhotoUrl?req.body.coverPhotoUrl:pageRecord.cover_photo;
          }
          await pageRecord.save();
          return res.status(200).json({ message: "success" });
  
        default:
          break;
      }
    } catch (error) {
      LOGGER.error("editPage", error);
      res.send({ error: error });
    }
  };
const getPage = async (req, res) => {
    LOGGER.info('getPage')
    try {
        const limit = parseInt(req.query.limit) || 30;
        const skip = parseInt(req.query.skip) || 0;
        const userId = req.user.id
        // res.count = await pageSchema.find({ "creator": ObjectId(userId) }).count();
        const result = await pageSchema.find({ "creator": ObjectId(userId),status: pageStatus.ACTIVE  })
            .populate({
                path: 'creator',
                options: { skipNulls: true }
            })
            .lean();
        if (result) {
            let pageArray = [];
            for (let i = 0; i < result.length; i++) {
                const element = result[i];
                pageArray.push(element)
            }
            pageArray.reverse()
            let pageCount = pageArray.length;
            let finalResult = []
            let skipResult = pageArray.slice(skip)
            for (let i = 0; i < limit; i++) {
                if (skipResult[i] != undefined) {
                    finalResult.push(skipResult[i])
                }
            }
            if (pageArray.length != 0) {
                if ((pageCount - skip) > limit) {
                    const next = parseInt(skip + limit)
                    res.status(200).send({ message: "success", 'count': pageCount, 'skip': next, 'result': finalResult })

                } else {

                    res.status(200).send({ message: "success", 'count': pageCount, 'result': finalResult })
                }
            } else {
                res.status(200).send({ message: "no pages yet" })

            }

        }



        return res.send(result);
    } catch (error) {
        LOGGER.error('createPage', error)
    }
};
const viewPage = async (req, res) => {
    LOGGER.info('viewPage API is called')
    try {
        const pageId = req.params.pageId;
        const mongoDbRegex = regex.regex.MONGO_DB_REGEX;
        if (pageId.match(mongoDbRegex)) {

            const userId = req.user._id
            const query = { _id: ObjectId(pageId), status: pageStatus.ACTIVE }
            const projection = { createDate: 0, updateDate: 0, createdAt: 0, updatedAt: 0, __v: 0, version: 0., _id: 0 }
            const page = await pageSchema.findOne(query, projection)
            let index =  page.followers.indexOf(userId.toString());
            let payload = null

            if((page.followers.includes(userId.toString())) && (index !== -1)){
                const followStatus = 1
                payload ={result:page, follow:followStatus}
            }else{
                const followStatus = 2
                payload ={result:page, follow:followStatus}

            }
            if (page) {
                res.status(200).send({ message: "success", result: payload });
                LOGGER.info("view page success")

            }
            else {
                res.status(404).send(pageError.pageErrorCodesAndMessages.NON_EXISTANT_PAGE_ID)
                LOGGER.error("error in view page", pageError.pageErrorCodesAndMessages.NON_EXISTANT_PAGE_ID)



            }
        } else {
            res.status(404).send(pageError.pageErrorCodesAndMessages.NON_EXISTANT_PAGE_ID);
            LOGGER.error("error in view page", pageError.pageErrorCodesAndMessages.NON_EXISTANT_PAGE_ID)

        }
    } catch (error) {
        res.status(404).send(pageError.pageErrorCodesAndMessages.NON_EXISTANT_PAGE_ID)
        LOGGER.error("error in view page", error)
    }
};

const followPage = async (req, res) => {
    LOGGER.info('followPage')
    try {
        const result = followPageFunction(req, res)
        return result
    } catch (error) {
        LOGGER.error('followPage', error)
    }
};

const unfollow = async (req, res) => {
    LOGGER.info('unfollow')
    try {
        const result = unfollowFunction(req, res)
        return result
    } catch (error) {
        LOGGER.error('unfollow', unfollow)
    }
};

const listFollowersOfAPage = async (req, res) => {
    LOGGER.info('listFollowersOfAPage')
    try {
        const result = listPageFollowersFunction(req, res)
        return result
    } catch (error) {
        LOGGER.error('listFollowersOfAPage', error)
    }
};

const listPagesFollowedByAUser = async (req, res) => {
    LOGGER.info('listPagesFollowedByAUser')
    try {
        const result = listPagesFollowedByAUserFunction(req, res)
        return result
    } catch (error) {
        LOGGER.error('listPagesFollowedByAUser', error)
    }
};


module.exports = {
    createPage,
    getPage,
    viewPage,
    followPage,
    unfollow,
    listFollowersOfAPage,
    listPagesFollowedByAUser,
    editPage,
    deletePage
}