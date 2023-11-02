const { mongoose, Schema } = require('mongoose');

const notificationSchema = new mongoose.Schema({
  send_user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  get_user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  getuser_name:{
    type:String,
    ref:'User'
  },
  senduser_firebase: {
    type:String,
  },
  requested_user: {
    type: Schema.Types.ObjectId,
    ref: 'friends', 
  },
  reciever_user: {
    type: Schema.Types.ObjectId,
    ref: 'friends',
  },
  message: {
    type: String,
  },
  friend_status:{
    type: String,
    ref: 'friends',
  },
  status: {
    type: Number,
  },
  delivery: {
    type: Number,
  },
  type: {
    type: Number,
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
  updated_date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Notification', notificationSchema);
