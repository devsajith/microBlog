const express = require('express');
const { authenticateToken } = require('../auth');
const contentType = require('../contentType');
const page = require("../controller/pageController")
const router = express.Router();
const { userValidator } = require('../expressValidator/userValidator')

router.post('/pages/create', contentType, authenticateToken, userValidator('createPage'), page.createPage);
router.get('/pages/by-user/list', authenticateToken, page.getPage)
router.get('/pages/list-pages', authenticateToken, page.listPagesFollowedByAUser)
router.get('/pages/:pageId/detailed-view', authenticateToken, page.viewPage)
router.put('/pages/:id/follow', authenticateToken, page.followPage)
router.put('/pages/:id/unfollow', authenticateToken, page.unfollow)
router.get('/pages/:id/list-followers', authenticateToken, page.listFollowersOfAPage)
router.put('/pages/:id/edit', contentType, authenticateToken, page.editPage)
router.put('/pages/:id/delete', authenticateToken, page.deletePage)
module.exports = router;