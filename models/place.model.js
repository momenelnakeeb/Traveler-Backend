const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema(
  {
    pageUrl: {
      type: String,
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
      type: String
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
    ratings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rating'
      }
    ],
    averageRating: {
      type: Number,
      default: 0
    },
    similarityScore: {
      type: Number,
      default: 0
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        delete ret.similarityScore;
      }
    },
    timestamps: true
  }
);

placeSchema.methods.updateSimilarityScore = function (surveyResponse) {
  const place = this;
  const { entertainment, adventure, religious, beach, medical } = surveyResponse;

  let similarityScore = 0;

  if (entertainment && place.entertainment) {
    similarityScore++;
  }

  if (adventure && place.adventure) {
    similarityScore++;
  }

  if (religious && place.religious) {
    similarityScore++;
  }

  if (beach && place.beach) {
    similarityScore++;
  }

  if (medical && place.medical) {
    similarityScore++;
  }

  place.similarityScore += similarityScore;

  return place.save();
};

placeSchema.statics.updateAllSimilarityScores = async function (surveyResponse) {
  const Place = this;
  const places = await Place.find({});

  for (let i = 0; i < places.length; i++) {
    await places[i].updateSimilarityScore(surveyResponse);
  }
};

module.exports = mongoose.model('Place', placeSchema);