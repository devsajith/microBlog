const LOGGER = require('../../logger/logger.util');
const friendRequestsSchema = require('../../models/friend_list')
const stringManipulation = require('../../generalFunctions/stringManipulations')
const userStatus = require('../../statusCatalogue/userStatusCatalogue')
const { settingCountForFriendsList } = require('../../generalFunctions/settingCount')
const { filterOutCurrentUserFromSearchResult } = require('../../generalFunctions/filterOutCurrentUserFromSearchResult')
const { compareUserNames } = require('../../generalFunctions/usernameComparisonForFriendsModule')


async function friendsListWithSearchFunction(req, res) {
    LOGGER.info('friendsListWithSearchFunction')
    try {
        const search = stringManipulation.trimStrings(req.query.search) || ""
        const userId = req.user.id
        const limit = parseInt(req.query.limit) || 20;
        const skip = parseInt(req.query.skip) || 0;
        const escapedPattern = search.replace(' ', '\\+');
        const result = await friendRequestsSchema
            .find({
                $or: [
                    { reciever_user: userId, status: userStatus.userStatus.ACTIVE },
                    { requested_user: userId, status: userStatus.userStatus.ACTIVE }
                ]
            })
            .populate({
                path: 'requested_user',
                match: { $or: [{ 'userName': { $regex: escapedPattern, $options: 'i' } }, { 'email': { $regex: escapedPattern, $options: 'i' } }] },
                options: { skipNulls: true }
            })
            .populate({
                path: 'reciever_user',
                match: { $or: [{ 'userName': { $regex: escapedPattern, $options: 'i' } }, { 'email': { $regex: escapedPattern, $options: 'i' } }] },
                options: { skipNulls: true }
            })
            .lean();

        let preResponseResult = []
        for (let i = 0; i < result.length; i++) {
            if (result[i].requested_user != null || result[i].reciever_user != null) {
                preResponseResult.push(result[i])
            }
        }
        let responseResult = []
        responseResult = filterOutCurrentUserFromSearchResult(preResponseResult, userId)
        const sortResult = responseResult.sort(compareUserNames)
        let finalResult = []
        let skipResult = sortResult.slice(skip)
        for (let i = 0; i < limit; i++) {
            if (skipResult[i] != undefined) {
                finalResult.push(skipResult[i])
            }
        }
        const sortResultCount = sortResult.length
        const finalResultCount = finalResult.length
        const count = settingCountForFriendsList(sortResultCount, finalResultCount, limit)
        if (finalResult.length === 0) {
            LOGGER.info('friendsListWithSearchFunction: no data found')
            return res.status(200).send({ message: "no data" })

        }
        if ((count - skip) > limit) {
            const next = parseInt(skip + limit)
            res.status(200).send({ message: "success", 'skip': next, 'count': count, 'result': finalResult })

        } else {

            res.status(200).send({ message: "success", 'count': count, 'result': finalResult })
        }
    } catch (error) {
        LOGGER.error('friendsListWithSearchFunction', error)
    }
}

module.exports = {
    friendsListWithSearchFunction
}