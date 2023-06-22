const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('../models/user.model');
const Place = require('../models/place.model');

const supervisorPlacesSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        name:this.name,
        image:this.image,
        required: true
      },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  place: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place'
  },
  pageUrl: { 
    type: String
    },

  // Add any other fields you need for supervisor places
}, {
  toJSON: {
    transform(doc, ret) {
      delete ret.__v;
    }
  },
  timestamps: true
});

module.exports = mongoose.model('SupervisorPlace', supervisorPlacesSchema);
