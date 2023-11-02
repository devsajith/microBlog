const LOGGER = require('../logger/logger.util');

// function compareUserNames(a, b) {
//     // LOGGER.info('compareUserNames')
//     try {
//         if (a.userName != null && b.userName != null) {
//             if (a.userName.toLowerCase() < b.userName.toLowerCase()) {
//                 return -1;
//             }
//             if (a.userName.toLowerCase() > b.userName.toLowerCase()) {
//                 return 1;
//             }
//             return 0;
//         }

//     } catch (error) {
//         LOGGER.error('compareUserNames', error)
//     }
// }
function compareUserNames(a, b) {
    // LOGGER.info('compareUserNames')
    try {
        if (a.userName != null && b.userName != null) {
            if (a.userName.toLowerCase() < b.userName.toLowerCase()) {
                return -1;
            }
            if (a.userName.toLowerCase() > b.userName.toLowerCase()) {
                return 1;
            }
            return 0;
        } else if (a.reciever_user != null && b.reciever_user != null) {
            if (a.userName.toLowerCase() < b.userName.toLowerCase()) {
                return -1;
            }
            if (a.userName.toLowerCase() > b.userName.toLowerCase()) {
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