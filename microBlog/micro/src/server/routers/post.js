const express = require('express');

const postRouter = express.Router();
const contentType = require('../contentType');
const { authenticateToken } = require('../auth');

const postControll = require('../controller/postsController')


postRouter.post('/post/create', contentType, authenticateToken, postControll.addPost)
postRouter.get('/post/list', authenticateToken, postControll.listPosts)
postRouter.get('/post/:id', authenticateToken, postControll.getPost)
postRouter.put('/post/:id/delete', authenticateToken, postControll.deletePost)
postRouter.put('/post/:id', authenticateToken, postControll.updatePost)
postRouter.post('/post/:id/like', authenticateToken, postControll.likePost)
postRouter.get('/post/:id/liked-users', authenticateToken, postControll.listLikedUsers)
postRouter.post('/post/:id/undo-like', authenticateToken, postControll.undoLike)
postRouter.get('/post/user/:id/list', authenticateToken, postControll.listPostsOfAUser)
postRouter.get('/post/pages/:pageId/list-post', authenticateToken, postControll.listPostsOfPage)
postRouter.post('/post/:id/share',authenticateToken,postControll.sharePost)
postRouter.post('/post/:id/report',authenticateToken,postControll.reportPost)
postRouter.get('/posts/reported/lists',authenticateToken,postControll.listReportedPost)

module.exports = postRouter