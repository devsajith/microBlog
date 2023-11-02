const { mongoose, Schema } = require('mongoose');

const postsSchema = new mongoose.Schema({
    text: {
        type: String
    },
    imageUrl: {
        type: String
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    page_id: {
        type: Schema.Types.ObjectId,
        ref: 'pages'
    }
    ,
    likes: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },
    comment_score: {
        type: Number,
        default: 0
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
    },
    shared_by: {
        type: [],
        ref: 'User',
        default: []
        
    }

    
})

module
    .exports = mongoose.model('posts', postsSchema)