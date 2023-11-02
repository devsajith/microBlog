const { mongoose, Schema } = require('mongoose');
const statusValue = require('../statusCatalogue/pageStatus')
const pageSchema = new mongoose.Schema({
    page_name: {
        type: String
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    about: {
        type: String
    },
    profile_photo: {
        type: String
    },
    cover_photo: {
        type: String
    },
    status: {
        type: Number,
        default: statusValue.pageStatus.ACTIVE
    },
    followers: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },
    created_date: {
        type: Number
    },
    updated_date: {
        type: Number
    }
});

module.exports = mongoose.model('pages', pageSchema)

