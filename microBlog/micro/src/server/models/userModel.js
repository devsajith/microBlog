const accessStatus = require('../statusCatalogue/accessStatus')
const mongoose = require('mongoose');
const pagination = require('mongoose-paginate-v2');
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: false
    },
    userName: {
        type: String,
        required: false
    },
    about: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    country: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: false
    },
    dob: {
        type: String,
        required: false
    },
    gender: {
        type: Number,
        required: false

    },
    photo: {
        type: String,
        required: false
    },
    cover_photo: {
        type: String,
        required: false
    },
    role: {
        type: Number,
        required: false
    },
    status: {
        type: Number,
        required: false,
        default: 1
    },
    access: {
        type: Number,
        default: accessStatus.accessStatus.PUBLIC
    },
    version: {
        type: Number,
        required: false
    },
    createDate: {
        type: Date,
        required: false
    },
    updateDate: {
        type: Date,
        required: false
    },


},
    {
        timestamps: true
    }
);

// Define a virtual field for the variants
userSchema.virtual('requests_recieved', {
    ref: 'friends', // The model to use
    localField: '_id', // Find variants where `localField` = _id
    foreignField: 'reciever_user', // Find variants where `foreignField` = product
    // foreignField: 'requested_user',
    justOne: false // Find multiple variants, not just one
});
userSchema.virtual('requests_sent', {
    ref: 'friends', // The model to use
    localField: '_id', // Find variants where `localField` = _id
    foreignField: 'requested_user', // Find variants where `foreignField` = product
    // foreignField: 'requested_user',
    justOne: false // Find multiple variants, not just one
});
userSchema.plugin(pagination);

module.exports = mongoose.model('User', userSchema);