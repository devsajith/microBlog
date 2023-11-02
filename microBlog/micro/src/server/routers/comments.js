const express = require('express');
const commentsRouter = express.Router();
const contentType = require('../contentType');
const { authenticateToken } = require('../auth');
const commentsControll = require('../controller/commentsController');

commentsRouter.get('/post/comment/:id/list', authenticateToken, commentsControll.listComments);
commentsRouter.post('/post/:id/comment', contentType, authenticateToken, commentsControll.addComment);
commentsRouter.put('/post/comment/:id', authenticateToken, commentsControll.updateComment);
commentsRouter.put('/post/comment/:id/delete', authenticateToken, commentsControll.deleteComment);
commentsRouter.post('/post/comment/:id/like', authenticateToken, commentsControll.likeComment);
commentsRouter.post('/post/comment/:id/undo-like', authenticateToken, commentsControll.undoLike)

module.exports = commentsRouter