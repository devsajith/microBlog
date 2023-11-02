const LOGGER = require('../logger/logger.util');


function comparePageNames(a, b) {
    LOGGER.info('comparePageNames')
    try {
        if (a.page_name != null && b.page_name != null) {
            if (a.page_name.toLowerCase() < b.page_name.toLowerCase()) {
                return -1;
            }
            if (a.page_name.toLowerCase() > b.page_name.toLowerCase()) {
                return 1;
            }
            return 0;
        } else if (a.reciever_user != null && b.reciever_user != null) {
            if (a.page_name.toLowerCase() < b.page_name.toLowerCase()) {
                return -1;
            }
            if (a.page_name.toLowerCase() > b.page_name.toLowerCase()) {
                return 1;
            }
            return 0;
        }

    } catch (error) {
        LOGGER.error('comparePageNames', error)
    }
}
module.exports = {
    comparePageNames
}