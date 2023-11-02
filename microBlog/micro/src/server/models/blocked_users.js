const { mongoose, Schema } = require('mongoose');
const { status } = require('../statusCatalogue/blockingStatus')

const blockingSchema = new mongoose.Schema({
    blocking_user: {
        type: Schema.Types.ObjectId
    },
    blocked_user: {
        type: Schema.Types.ObjectId
    },
    blocking_status: {
        type: Number,
        default: status.UN_BLOCKED
    }
});

module.exports = mongoose.model('blocking', blockingSchema)