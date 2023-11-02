const { mongoose, Schema } = require('mongoose');
const reportSchema = new mongoose.Schema({
    post_id: {
        type: Schema.Types.ObjectId,
        ref: 'posts'
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    comment: {
        type: String
    },
    status: {
        type: Number
    },
    created_date: {
        type: Number
    }
});

module.exports = mongoose.model('report', reportSchema)