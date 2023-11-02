const LOGGER = require('../logger/logger.util')
function settingCountForFriendsList(sortResultCount, finalResultCount, limit) {
    LOGGER.info('settingCountForFriendsList')
    try {
        if (sortResultCount > limit) {
            return sortResultCount
        } else {

            return finalResultCount
        }
    } catch (error) {
        LOGGER.error('settingCountForFriendsList', error)
    }
}

module.exports = {
    settingCountForFriendsList
}