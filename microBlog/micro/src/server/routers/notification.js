const express = require('express');
const notificationRouter = express.Router();
const contentType = require('../contentType');
const { authenticateToken } = require('../auth');
const notificationController = require('../controller/notificatonController');
const { userValidator } = require('../expressValidator/userValidator')

notificationRouter.post('/chat/notification', contentType, authenticateToken,userValidator('createNotification'), notificationController.addNotification);
notificationRouter.get('/notification/list', authenticateToken, notificationController.listNotification)
notificationRouter.put('/notification/edit', contentType, authenticateToken, notificationController.updateStatus)
notificationRouter.put('/notification/delete', contentType, authenticateToken, notificationController.deleteNotification)
notificationRouter.put('/notification/delivery', contentType, authenticateToken, notificationController.updateDelivery)
module.exports = notificationRouter