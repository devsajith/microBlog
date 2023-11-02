const LOGGER = require('../logger/logger.util');
const notificationSchema = require('../models/notifications');
const User = require("../models/userModel");
const regularExpressions = require('../regularExpressions/regularExpressions')
const { noificationErrorCodesAndMessages } = require('../errorCatalogue/notificationErrorCatalogue')
const {notificationType}= require('../statusCatalogue/notificationType')
const {notificationStatus}= require('../statusCatalogue/notifictionStatus')
const {notificationDelivery}= require('../statusCatalogue/notificationDelivery')
const { notificationCountSend } = require('../webSocket');

const addNotification = async (req, res) => {
  try {
    const { sender, email, message, senderFirebase } = req.body;
    const mongoDbRegex = regularExpressions.regex.MONGO_DB_REGEX;

    let errorArray=[]

    // Check if the message is missing or empty
    if (!message || message.trim() === "") {
      errorArray.push(noificationErrorCodesAndMessages.NO_MESSAGE)
      return res.status(400).json({error: noificationErrorCodesAndMessages.NO_MESSAGE });
    }

    // Assuming the "User" model is correctly imported and defined
    const receiver = await User.findOne({ email: email });
    const senderUser = await User.findOne({ _id: sender });
    if (!receiver) {
      return res.status(400).json({ error: noificationErrorCodesAndMessages.INVALID_EMAIL });
    }


    if (!sender || !sender.match(mongoDbRegex) || sender !== req.user.id) {
      return res.status(400).json({ error: noificationErrorCodesAndMessages.INVALID_SENDER_ID });
    }

    const newNotification = new notificationSchema({
      send_user: sender, 
      get_user: receiver._id,
      getuser_name:senderUser.userName,
      message: message,
      senduser_firebase: senderFirebase,
      type: notificationType.MESSAGE,
      status:notificationStatus.UNREAD,
      delivery:notificationDelivery.UNREAD
    });

    await newNotification.save();
    notificationCountSend(receiver._id);
    return res.status(200).json({ message: 'Message successfully added' });
  } catch (error) {
    LOGGER.error('Error adding notification:', error);
    return res.status(400).json({ error: 'Something went wrong' });
  }
};  
const listNotification = async (req, res) => {
  LOGGER.info('listNotification');
  try {
    const limit = parseInt(req.query.limit) || 100;
    const skip = parseInt(req.query.skip) || 0;
    const NO_DATA = 'no data found';
    const resultFromDb = await notificationSchema.find({
      $and: [
        {
          $or: [
            { get_user: req.user.id },
            { reciever_user: req.user.id },
          ],
        },
        { status: { $ne: notificationStatus.DELETED } },
      ],
    });

    // Sort the resultFromDb array in reverse order
    resultFromDb.sort((a, b) => b.created_date - a.created_date);

    let finalResult = [];
    let skipResult = resultFromDb.slice(skip);
    for (let i = 0; i < limit; i++) {
      if (skipResult[i] != undefined) {
        finalResult.push(skipResult[i]);
      }
    }

    const totalDocs = await notificationSchema
      .find({
        $and: [
          {
            $or: [
              { get_user: req.user.id },
              { reciever_user: req.user.id },
            ],
          },
          { status: notificationStatus.UNREAD },
        ],
      })
      .count();

    if (finalResult.length === 0) {
      LOGGER.info('listNotification: no data found');
      return res.status(200).send({ message: NO_DATA });
    }

    if (totalDocs - skip > limit) {
      const next = parseInt(skip + limit);
      LOGGER.info('listNotification: Data fetched');
      res
        .status(200)
        .send({ message: 'success', count: totalDocs - skip, skip: next, result: finalResult });
    } else {
      LOGGER.info('listNotification: Data fetched');
      res.status(200).send({ message: 'success', count: totalDocs, result: finalResult });
    }
  } catch (error) {
    LOGGER.error('listNotification', error);
  }
};

const updateStatus = async (req,res) => {
  LOGGER.info('updateStatus')
  try {
    
   const update= await notificationSchema.updateMany( {
      $and: [
        {
        $or: [
          {get_user:req.user.id},
          {reciever_user:req.user.id}
        ]
      },
      { status:  notificationStatus.UNREAD }
       ]
    },{
      $set:{status:notificationStatus.READ}
    });
res.status(200).send({message:"updated",data:update})
  } catch (error) {LOGGER.error('updateStatus', error)}};
  
  const updateDelivery = async (req,res) => {
    LOGGER.info('updateStatus')
    try {
      
     const update= await notificationSchema.updateMany( {
        $and: [
          {
          $or: [
            {get_user:req.user.id},
            {reciever_user:req.user.id}
          ]
        },
        { delivery:  notificationDelivery.UNREAD }
         ]
      },{
        $set:{delivery:notificationStatus.READ}
      });
  res.status(200).send({message:"updated",data:update})
    } catch (error) {LOGGER.error('updateStatus', error)}};
  
  const deleteNotification = async (req,res) => {
    LOGGER.info('deleteNotification')
    try {
      
     const update= await notificationSchema.updateMany( {
        $and: [
          {
          $or: [
            {get_user:req.user.id},
            {reciever_user:req.user.id}
          ]
        },
        { status:  notificationStatus.READ }
         ]
      },{
        $set:{status:notificationStatus.DELETED}
      });
  res.status(200).send({message:"Notification successfully deleted",data:update})
    } catch (error) {LOGGER.error('deleteNotification', error)}};
module.exports = {
  addNotification,
  listNotification,
  updateStatus,
  deleteNotification,
  updateDelivery
};

/**
 * Testing merges
 */
