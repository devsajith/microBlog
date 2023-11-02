const LOGGER = require('../logger/logger.util');
const { groupErrorCodesAndMessages } = require('../errorCatalogue/groupErrorCatalogue');
const groupChatSchema = require('../models/group_chat'); 
const { isUrl } = require('../generalFunctions/isUrlTest')
const { trimStrings } = require('../generalFunctions/stringManipulations');
const { ObjectId } = require("mongodb");
const { ACTIVE, DELETED } = require('../generalStatusCatalogue/postsStatus');





const createGroup = async (req,res)=>{
    LOGGER.info('create groupchat')
    try{
        const userId = req.user.id
        const uid = req.body.uid;
        const groupName = trimStrings(req.body.groupName)
        const imageUrl = trimStrings(req.body.imageUrl)
        const namCharacterLimit = 200;
        const SUCCESS_MESSAGE = {message:"GROUP CREATED SUCCESSFULLY"}
        const members =  req.body.members
        const membersLimitMin = 2
        const membersLimitMax = 5
        let errorsArray = [];
        if(groupName == "" ||  groupName == null){
            errorsArray.push(groupErrorCodesAndMessages.REQUIRED_NAME)
        }
        if(groupName){
            if(groupName>namCharacterLimit){
                errorsArray.push(groupErrorCodesAndMessages.INVALID_NAME)
            }
        }
        if(members.length< membersLimitMin){
            errorsArray.push(groupErrorCodesAndMessages.MIN_MEMBER)
        }
        if(members.length>membersLimitMax){
            errorsArray.push(groupErrorCodesAndMessages.MAX_MEMBER)
        }
        if (imageUrl) {

            if (isUrl(imageUrl) == false) {
                errorsArray.push(groupErrorCodesAndMessages.INVALID_PHOTO_URL)
            }
        }
        if (errorsArray.length != 0) {
            return res.status(400).send(errorsArray)
        }
        if(!members.includes(userId)){
            members.push(userId)
        }
        const Payload = {
            group_name: groupName,
            admin: userId,
            image_url:imageUrl,
            members:members,
            uid:uid,
            created_date: new Date().getTime(),
            updated_date: new Date().getTime(),  
            status:ACTIVE
        }
        try{
        const groupPayload = new  groupChatSchema(Payload)
        await groupPayload.save();
        }catch(error){
            res.status(400).send(groupErrorCodesAndMessages.INVALID_ID)
        }

            res.status(200).send(SUCCESS_MESSAGE)
    }catch(error){
        LOGGER.error('groupChatCreate', error)
    }
}


const listGroupChat = async(req,res)=>{
    LOGGER.info('group_chat_listing')
    try{
        const userId  = req.user.id;
        const groups = await groupChatSchema.find({members:{$in:[userId]}, status: ACTIVE})
        res.status(200).send(groups)
    }catch(error){
        LOGGER.error('grouplist',error)
    }
} 

const groupDetails = async(req,res)=>{
    LOGGER.info('group_details')
    try{
        const id =req.params.id 
        const details = await groupChatSchema.findOne({_id: ObjectId(id)}).populate('members', 'email _id userName photo ')
        res.status(200).send(details)
    }catch(error){
        LOGGER.error('group_details_error',error)
    }
}


const updateGroup = async (req,res)=>{
    LOGGER.info('update_group')
    try{
        const groupId = req.params.id
        const groupName = trimStrings(req.body.groupName)
        const imageUrl = trimStrings(req.body.imageUrl)
        const namCharacterLimit = 200;
        const SUCCESS_MESSAGE = {message:"GROUP UPDATED SUCCESSFULLY"}
        let errorsArray =[]
        if(groupName == "" ||  groupName == null){
            errorsArray.push(groupErrorCodesAndMessages.REQUIRED_NAME)
        }
        if(groupName){
            if(groupName>namCharacterLimit){
                errorsArray.push(groupErrorCodesAndMessages.INVALID_NAME)
            }
        }
        if (imageUrl) {

            if (isUrl(imageUrl) == false) {
                errorsArray.push(groupErrorCodesAndMessages.INVALID_PHOTO_URL)
            }
        }
        if (errorsArray.length != 0) {
            return res.status(400).send(errorsArray)
        }
        const updateResult = {
            group_name:groupName,
            image_url:imageUrl
        }
        await groupChatSchema.findByIdAndUpdate(groupId, updateResult)
        res.status(200).send(SUCCESS_MESSAGE)



    }catch(error){
        LOGGER.error('group-error',error)
    }
}


const deleteGroup =async(req,res)=>{
    LOGGER.info('delete-group')
    try{
        const userId =  req.user.id
        const groupId = req.params.id
        let errorsArray = []
        const SUCCESS_MESSAGE = {message:"Group deleted successfully"}
        const group = await groupChatSchema.findOne({_id: ObjectId(groupId)})
        if((group.admin.valueOf()) !==userId){
          errorsArray.push(groupErrorCodesAndMessages.NOT_ADMIN)
        }
        if (errorsArray.length != 0) {
            return res.status(400).send(errorsArray)
        }
        const deleteResult = {
            status:DELETED
        }
        await groupChatSchema.findByIdAndUpdate(groupId,deleteResult)
        res.status(200).send(SUCCESS_MESSAGE)

    }catch(error){
        LOGGER.error('group-delete',error)

    }
}

module.exports ={

    createGroup,
    listGroupChat,
    groupDetails,
    updateGroup,
    deleteGroup
}