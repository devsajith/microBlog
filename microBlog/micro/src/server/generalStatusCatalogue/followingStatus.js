const following = {
    ALREADY_FOLLOWING: { status: 0, message: "already following" },
    FOLLOW_SUCCESS: { status: 1, message: "following page" },
    UNFOLLOWED: { status: 2, message: "page unfollowed" },
    NOT_FOLLOWED: { status: 3, message: "page is not being followed" }

}

module.exports = {
    following
}