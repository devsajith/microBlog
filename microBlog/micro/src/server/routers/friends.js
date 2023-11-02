const express = require('express');
const friendsRouter = express.Router();
const contentType = require('../contentType');
const { authenticateToken } = require('../auth');
const friendsControll = require('../controller/friendsController')

friendsRouter.get('/user/friend-requests', authenticateToken, friendsControll.friendRequstList)
friendsRouter.post('/user/friendrequest', contentType, authenticateToken, friendsControll.acceptOrRejectFriendRequest)
friendsRouter.post('/user/addfriend', contentType, authenticateToken, friendsControll.sendFriendRequest)
friendsRouter.get('/user', authenticateToken, friendsControll.friendsListWithSearch)
friendsRouter.post('/user/friendrequest/:friend_id/unfriend', authenticateToken, friendsControll.unfriend)
friendsRouter.post('/user/:id/block', authenticateToken, friendsControll.blockUser)
friendsRouter.put('/user/:id/unblock', authenticateToken, friendsControll.unblockUser)
module.exports = friendsRouter