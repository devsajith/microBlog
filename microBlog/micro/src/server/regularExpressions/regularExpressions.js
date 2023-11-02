const regex = {
    PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*)(+=._-])(?=.*[0-9])(?=.{8,20}$)[a-zA-Z0-9!@#$%^&*)(+=._-]+$/,
    MONGO_DB_REGEX: /^[0-9a-fA-F]{24}$/,
    // eslint-disable-next-line no-useless-escape
    USERNAME_REGEX: /^[a-zA-Z0-9!@#$%^&*()_+\-={}[\]\\|:;"'<>,.?\/]+( [a-zA-Z0-9!@#$%^&*()_+\-={}[\]\\|:;"'<>,.?\/]+)*$/,
    PHONE_REGEX: /^[1-9]\d{9,12}$/
}

module.exports = {
    regex
}