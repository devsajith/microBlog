const pageErrorCodesAndMessages = {
    PAGE_NAME_REQUIRED: { errorCode: 7000, message: "pageName required" },
    INVALID_PAGE_NAME: { errorCode: 7001, message: "Invalid pageName" },
    ABOUT_REQUIRED: { errorCode: 7002, message: "Description required" },
    INVALID_ABOUT: { errorCode: 7003, message: "Invalid About" },
    PAGE_NOT_FOUND: { errorCode: 7004, message: "Page not found" },
    INVALID_ID: { errorCode: 7005, message: "Invalid Id" },
    INVALID_IMAGE_URL: { errorCode: 7006, message: "Invalid image URL " },
    NON_EXISTANT_PAGE_ID: { errorCode: 7008, message: "pageId not found" },
    PAGE_ID_REQUIRED: { errorCode: 7007, message: "Id required " }
}

module.exports = {
    pageErrorCodesAndMessages
}