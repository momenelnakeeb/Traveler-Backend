const jwt = require('jsonwebtoken');
const { AuthError } = require('../errors/auth.error');
const SurveyResponse = require("../models/survey.model")
const User=require('../models/user.model');

exports.checkAuth = async (req, res, next) => {
  try {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
      req.userData = { userId: null }; // set userId to null for guest requests
    } else {
      const token = authHeader.split(' ')[1];
      if (!token) {
        throw new AuthError('Token is missing');
      }

      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      req.userData = { userId: decodedToken.userId }; // set userId to decoded token for user requests
    }

    // Set default survey response values in case the user is not authenticated
    const defaultSurvey = {
      adventure: false,
      religious: false,
      beach: false,
      medical: false,
      entertainment: false,
    };

    const userId = req.userData.userId;
    let userSurvey = defaultSurvey;
    console.log(userId);

    if (userId) {
      const surveyResponse = await SurveyResponse.findOne({ user: userId });
      if (surveyResponse) {
        userSurvey = surveyResponse.survey;
      }
    } 

    req.userSurvey = userSurvey;

    next();
  } catch (err) {
    next(err);
  }
};
