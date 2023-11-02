const {mongoose, Schema} = require('mongoose')
const groupChatSchema = new mongoose.Schema({
    group_name: {
        type: String,
    },
    admin :{
        type:Schema.Types.ObjectId,
        ref: 'User'
    },
    members: {
        type:[Schema.Types.ObjectId],
        ref: 'User',
        default:[]
    },
    created_date: {
        type: Number
    },
    updated_date: {
        type: Number
    },
    image_url: {
        type: String
    },
    status: {
        type: Number
    },
    uid: {
        type:[]
    }

})
module
    .exports = mongoose.model('groups', groupChatSchema)