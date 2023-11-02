const LOGGER = require('../logger/logger.util');
const postsSchema = require('../models/posts')
const { ACTIVE } = require('../generalStatusCatalogue/postsStatus');
const blocked = require('../models/blocked_users');
const { ObjectId } = require('mongodb');

async function removePrivatePostsFunction(req) {
    LOGGER.info('removePrivatePostsFunction')
    try {
        const userId = req.user.id;
        const returnObject = await postsSchema
            .find({ status: ACTIVE })
            .sort({ created_date: -1 })
            .populate('user_id', 'email photo userName access')
            .lean();

        const postsOfCurrentUser = await postsSchema
            .find({ user_id: userId, status: ACTIVE })
            .sort({ created_date: -1 })
            .populate('user_id', 'email photo userName access')
            .lean();
        const blockedUsers = await blocked
            .find({ blocking_user: ObjectId(userId) })
        const filteredRecords = returnObject.filter(
            (record) => record.user_id.access !== 0
        );
        let removedBlockedUserPOsts = filteredRecords.filter((element) =>
            blockedUsers.every(
                (block) => element.user_id.Id == block.blocking_user.toString()
            )
        );
        const combinedSet = new Set([...postsOfCurrentUser, ...removedBlockedUserPOsts]);
        const combinedArray = Array.from(combinedSet);
        const uniqueArray = Array.from(new Set(combinedArray.map(JSON.stringify)), JSON.parse);
        return uniqueArray
    } catch (error) {
        LOGGER.error('removePrivatePostsFunction', error)
    }
}

module.exports = {
    removePrivatePostsFunction
}