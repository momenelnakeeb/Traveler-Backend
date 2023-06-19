const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ratingSchema=new Schema({
      place: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Place'
      },
      pageUrl: { 
        type: String
      },
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      rating:{
        type: Number,
        min:0.5, max:5,
        required:true
    },
    date: {
        type: Date,
        default: Date.now
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

module.exports = mongoose.model('Rating', ratingSchema);