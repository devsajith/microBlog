const { mongoose, Schema } = require('mongoose');
const friendRequestSchema = new mongoose.Schema({
    requested_user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reciever_user: {
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    status: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('friends', friendRequestSchema)