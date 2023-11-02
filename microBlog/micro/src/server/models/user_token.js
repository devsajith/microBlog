const { mongoose, Schema } = require('mongoose');
const userTokensSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    token: {
        type: String
    },
    refresh_token: {
        type: String
    },
    otp: {
        type: Number
    },
    otpStatus: {
        type: Number
    },
    black_list: {
        type: Number,
        default: 0
    },
    create_date: {
        type: Number
    },
    update_date: {
        type: Number
    },
    expiry: {
        type: Number
    },
    refresh_token_expiry: {
        type: String
    }
}
)
module.exports = mongoose.model('userTokens', userTokensSchema);