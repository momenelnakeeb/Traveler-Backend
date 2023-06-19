const mongoose = require('mongoose');

const surveyResponseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  entertainment: {
    type: Boolean,
    default: false
  },
  adventure: {
    type: Boolean,
    default: false
  },
  religious: {
    type: Boolean,
    default: false
  },
  beach: {
    type: Boolean,
    default: false
  },
  medical: {
    type: Boolean,
    default: false
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
  },
  timestamps: true
});
surveyResponseSchema.pre('save', async function(done) {
  const user = await mongoose.model('User').findById(this.user);
  if (user) {
    user.hasSurvey = true;
    await user.save();
  }
  done();
});
surveyResponseSchema.pre('validate', function(next) {
  const fields = ['entertainment', 'adventure', 'religious', 'beach', 'medical'];
  const isAtLeastOneTrue = fields.some(field => this[field] === true);
  if (!isAtLeastOneTrue) {
    const error = new Error('At least one field should be true.');
    error.status = 400;
    return next(error);
  }
  next();
});

module.exports = mongoose.model('SurveyResponse', surveyResponseSchema);