const Place = require('../models/place.model');
const Comment=require('../models/comment.model');
const Rating=require('../models/rating.model');
const User=require('../models/user.model');
const path = require('path')
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { ValidationError } = require('../errors/validation.error');
const { AuthError } = require('../errors/auth.error');
const SurveyResponse = require("../models/survey.model")
exports.recommendPlaces = async (req, res, next) => {
    try {
      const defaultSurvey = {
        adventure: false,
        religious: false,
        beach: false,
        medical: false,
        entertainment: false,
      };
  
      const userId = req.userData.userId;
      let userSurvey = defaultSurvey;
  
      if (userId) {
        const surveyResponse = await SurveyResponse.findOne({ user: userId });
        if (surveyResponse) {
          userSurvey = surveyResponse.survey;
        }
      }
  
      const matchedPlaces = await Place.find({
        $or: [
          { adventure: userSurvey.adventure },
          { religious: userSurvey.religious },
          { beach: userSurvey.beach },
          { medical: userSurvey.medical },
          { entertainment: userSurvey.entertainment },
        ],
      })
        .sort({ averageRating: -1 })
        .lean();
  
      const unmatchedPlaces = await Place.find({
        $nor: [
          { adventure: userSurvey.adventure },
          { religious: userSurvey.religious },
          { beach: userSurvey.beach },
          { medical: userSurvey.medical },
          { entertainment: userSurvey.entertainment },
        ],
      })
        .sort({ averageRating: -1 })
        .lean();
  
      const recommendedPlaces = [...matchedPlaces, ...unmatchedPlaces];
  
      req.recommendedPlaces = recommendedPlaces;
      next();
    } catch (err) {
      next(err);
    }
  };
  