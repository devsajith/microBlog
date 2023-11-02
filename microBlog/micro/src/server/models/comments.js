const { mongoose, Schema } = require('mongoose');
const commentsSchema = new mongoose.Schema({
    post_id: {
        type: Schema.Types.ObjectId,
        ref: 'posts'
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    parent_comment: {
        type: Schema.Types.ObjectId,
        ref: 'comments',
        default: null
    },
    comment: {
        type: String
    },
    likes: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },
    status: {
        type: Number
    },
    version: {
        type: Number,
        default: 1
    },
    created_date: {
        type: Number
    },
    updated_date: {
        type: Number
    }
});

module.exports = mongoose.model('comments', commentsSchema)