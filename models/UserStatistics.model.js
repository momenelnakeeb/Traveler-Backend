const mongoose = require('mongoose');

const userStatisticsSchema = new mongoose.Schema({
  totalUsers: {
    type: Number,
    required: true
  },
  gender: {
    type: {
      male: {
        type: Number,
        default: 0
      },
      female: {
        type: Number,
        default: 0
      }
    },
    required: true
  },
  age: {
    type: {
      under18: {
        type: Number,
        default: 0
      },
      '18-25': {
        type: Number,
        default: 0
      },
      '26-35': {
        type: Number,
        default: 0
      },
      '36-45': {
        type: Number,
        default: 0
      },
      '46-55': {
        type: Number,
        default: 0
      },
      over55: {
        type: Number,
        default: 0
      }
    },
    required: true
  }
});

module.exports = mongoose.model('UserStatistics', userStatisticsSchema);
