const LOGGER = require('../logger/logger.util');

function trimStrings(text) {
    LOGGER.info('trimStrings')
    try {
        if (!text) {
            return text
        }
        return text.trim()

    } catch (error) {
        LOGGER.error('trimStrings', error)
    }
}
function removeSpecialCharactersAndSymbols(text) {
    LOGGER.info('removeSpecialCharactersAndSymbols')
    try {
        const cleanedText = text.replace(/[^\w\s]/gi, "")
        return cleanedText;
    } catch (error) {
        LOGGER.error('removeSpecialCharactersAndSymbols', error)
    }
}
module.exports = {
    trimStrings,
    removeSpecialCharactersAndSymbols
}