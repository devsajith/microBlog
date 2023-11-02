const LOGGER = require('../logger/logger.util')
const User = require('../models/userModel')
const { userStatus } = require('../statusCatalogue/userStatusCatalogue');
const { trimStrings } = require('../generalFunctions/stringManipulations');
const { settingFriendsStatusInListing } = require('../generalFunctions/setFriendStatus')
const { compareUserNames } = require('../generalFunctions/usernameComparison')
const { arrayPaginationFunction } = require('../generalFunctions/paginationOfArrays')
const { status } = require('../statusCatalogue/blockingStatus')

const blockedUserSchema = require('../models/blocked_users')
const { ObjectId } = require('mongodb');



async function globalPaginatedUserSearchFunction(req, res) {
    LOGGER.info('globalPaginatedUserSearchFunction')
    try {
        const NO_DATA = "no data found"
        const search = trimStrings(req.query.search) || ""
        const userId = req.user.id
        const limit = parseInt(10)
        const skip = parseInt(req.query.skip) || 0;
        const escapedPattern = search.replace(' ', '\\+');
        const projection = { userName: 1, email: 1, gender: 1, photo: 1, about: 1 }
        let friendResult = []
        let responseResult = []
        let sortUserResult = []
        let skipResult
        let finalResult
        let filteredArray
        let userPaginatedResult

        let count
        const blocked = await blockedUserQuery(userId)
        let userResult = await userSearchQuery(escapedPattern, projection)

        friendResult = settingFriendsStatusInListing(userResult, userId)

        for (let i = 0; i < friendResult.length; i++) {
            if (friendResult[i].userName != null || friendResult[i].userName != null) {
                responseResult.push(friendResult[i])
            }
        }
        sortUserResult = responseResult.sort(compareUserNames)
        count = sortUserResult.length
        skipResult = sortUserResult.slice(skip)
        finalResult = arrayPaginationFunction(limit, skipResult)
        filteredArray = finalResult.filter((element) =>
            blocked.every(
                (block) => element._id !== block.blocking_user.toString()
            )
        );
        if (filteredArray.length === 0) {
            LOGGER.info('globalPaginatedUserSearchFunction: no data found')
            return res.status(200).send({ message: NO_DATA })

        }
        userPaginatedResult = userResultReturns(count, skip, limit, filteredArray, res)
        return userPaginatedResult

    } catch (error) {
        LOGGER.error('globalPaginatedUserSearchFunction', error)
    }
}

function userResultReturns(count, skip, limit, filteredArray, res) {
    LOGGER.info('userResultReturns')
    try {
        if ((count - skip) > limit) {
            const next = parseInt(skip + limit)
            return res.status(200).send({ message: "sucess", count: count, 'skip': next, users: filteredArray })

        } else {
            return res.status(200).send({ message: "sucess", count: count, users: filteredArray })

        }
    } catch (error) {
        LOGGER.error('userResultReturns', error)
    }
}

async function userSearchQuery(escapedPattern, projection) {
    LOGGER.info('userSearchQuery')
    try {
        let userResult
        userResult = await User
            .find({
                status: userStatus.ACTIVE,
                $or: [
                    { email: { $regex: escapedPattern, $options: 'i' } },
                    { userName: { $regex: escapedPattern, $options: 'i' } }
                ]
            })
            .select(projection)
            .populate('requests_recieved')
            .populate('requests_sent')
            .lean()
        return userResult
    } catch (error) {
        LOGGER.error('userSearchQuery', error)
    }
}

async function blockedUserQuery(userId) {
    LOGGER.info('blockedUserQuery')
    try {
        let blocked
        blocked = await blockedUserSchema
            .find({ blocked_user: ObjectId(userId), blocking_status: status.BLOCKED })
        return blocked
    } catch (error) {
        LOGGER.error('blockedUserQuery', error)
    }
}

module.exports = {
    globalPaginatedUserSearchFunction,
    userSearchQuery
}