const mongoose = require('mongoose');
const User = require('../models/user.model');
const Place = require('../models/place.model');
const Schema = mongoose.Schema;




const commentSchema= new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    name:this.name,
    image:this.image,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  place: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place'
  },
  pageUrl: { 
    type: String
    },
},
{
  toJSON: {
    transform(doc, ret) {
      delete ret.__v;
    }
  }, timestamps: true
}
);
module.exports = mongoose.model('Comment', commentSchema);
// const portsaidCommentSchema= new Schema({
//   parentCommentSchema:{
//     type:Schema.Types.ObjectId,
//     ref:'parentCommentSchema'
//   },
//   pageTitle:{ 
//     type: String,
//     value:portsaid,
//   }

// })

// const sinaiCommentSchema= new Schema({
//   parentCommentSchema:{
//     type:Schema.Types.ObjectId,
//     ref:'parentCommentSchema'
//   },
//   pageTitle:{ 
//     type: String,
//     value:sinai,
//   }

// })

// module.exports = mongoose.model('portsaidComment',portsaidCommentSchema);
// module.exports = mongoose.model('sinaiComment', sinaiCommentSchema);