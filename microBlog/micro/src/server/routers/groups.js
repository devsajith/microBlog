const express = require('express');
const groupRouter = express.Router();
const contentType = require('../contentType');
const { authenticateToken } = require('../auth')
const groupControll = require('../controller/groupChatController');

groupRouter.post('/group/create',contentType,authenticateToken,groupControll.createGroup)
groupRouter.get('/group/list',authenticateToken,groupControll.listGroupChat)
groupRouter.get('/group/:id/details',authenticateToken,groupControll.groupDetails)
groupRouter.put('/group/:id/edit',authenticateToken,groupControll.updateGroup)
groupRouter.put('/group/:id/delete', authenticateToken,groupControll.deleteGroup)
module.exports = groupRouter;