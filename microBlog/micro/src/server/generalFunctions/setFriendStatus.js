const LOGGER = require('../logger/logger.util');
// const { friendStatus } = require('../statusCatalogue/friendStatusCatalogue')
// const friendsRequestsSchema = require('../models/friend_list')
// const { friendRequestStatus } = require('../statusCatalogue/requestStatusCatalogue')
// const { ObjectId } = require('mongodb');



function settingFriendsStatusInListing(result, userId) {
    LOGGER.info('settingFriendsStatusInListing')
    try {
        let friendResult = []
        result.forEach(i => {
            i.friend = 2
            if (i._id.toString() == userId) {
                i.friend = 3
            }

            const combinedArray = [...i.requests_recieved, ...i.requests_sent]
            if (combinedArray.length > 0) {
                combinedArray.forEach(j => {
                    if (
                        j.requested_user.toString() == userId && j.reciever_user.toString() == i._id.toString() ||
                        j.reciever_user.toString() == userId && j.requested_user.toString() == i._id.toString()
                    ) {
                        switch (j.status) {
                            case 1:
                                i.friend = 1//friend
                                break;
                            case 0:
                                i.friend = 0//pending
                                break;
                            default:
                                i.friend = 2//not a friend
                                break;
                        }

                    }
                    else if (i._id.toString() == userId) {
                        i.friend = 3
                    }

                });
            }



            let data = {
                _id: i._id.toString(),
                email: i.email,
                userName: i.userName,
                friend: i.friend,
                photo: i.photo,
                gender: i.gender,
                about: i.about
            }
            friendResult.push(data)
        });
        return friendResult


    } catch (error) {
        LOGGER.error('settingFriendsStatusInListing', error)
    }
}


// async function settingFriendsStatusInViewUser(result, userId) {
//     LOGGER.info('settingFriendsStatusInViewUser')
//     try {
//         const friendId = result._id;
//         const query1 = { requested_user: ObjectId(friendId), reciever_user: ObjectId(userId) };
//         const query2 = { reciever_user: ObjectId(friendId), requested_user: ObjectId(userId) };
//         const filter = { $or: [query1, query2], status: friendRequestStatus.ACCEPT }
//         // const friendDetails = await friendsRequestsSchema
//         //     .find(filter)
//         // // if (friendDetails.length == 0) {
//         // //     result.friend = friendStatus.NOT_FRIEND
//         // // }
//         // // if (result._id.toString() == userId) {
//         // //     result.friend = friendStatus.SELF
//         // // }

//         // let data = {
//         //     _id: result._id.toString(),
//         //     email: result.email,
//         //     userName: result.userName,
//         //     friend: result.friend,
//         //     photo: result.photo,
//         //     gender: result.gender,
//         //     about: result.about
//         // }

//     } catch (error) {
//         LOGGER.error('settingFriendsStatusInViewUser', error)
//     }
// }

module.exports = {
    settingFriendsStatusInListing,
    // settingFriendsStatusInViewUser
}