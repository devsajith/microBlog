const LOGGER = require('../logger/logger.util')
function compareUserNames(a, b) {
    LOGGER.info('compareUserNames')
    try {
        if (a.requested_user != null && b.requested_user != null) {
            if (a.requested_user.userName.toLowerCase() < b.requested_user.userName.toLowerCase()) {
                return -1;
            }
            if (a.requested_user.userName.toLowerCase() > b.requested_user.userName.toLowerCase()) {
                return 1;
            }
            return 0;
        } else if (a.reciever_user != null && b.reciever_user != null) {
            if (a.reciever_user.userName.toLowerCase() < b.reciever_user.userName.toLowerCase()) {
                return -1;
            }
            if (a.reciever_user.userName.toLowerCase() > b.reciever_user.userName.toLowerCase()) {
                return 1;
            }
            return 0;
        }

    } catch (error) {
        LOGGER.error('compareUserNames', error)
    }
}

module.exports = {
    compareUserNames
}