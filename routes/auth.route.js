const express = require('express');
const { body } = require('express-validator');
const isAuth = require('../middlewares/isAuth')
const authController = require('../controllers/auth.controller');
const User = require('../models/user.model');
const upload = require('../middlewares/upload.middleware');
// const path = require('path');
const multer = require('multer');
const SurveyResponse = require("../models/survey.model")
const Place = require('../models/place.model');

const router = express.Router();

// POST /survey
// Add or update a survey response for the current user
router.post('/survey', isAuth, async (req, res, next) => {
  try {
    const { entertainment, adventure, religious, beach, medical } = req.body;

    // Find the current user
    const userId = req.userData.userId;

    // Check if the user has already submitted a survey response
    let surveyResponse = await SurveyResponse.findOne({ user: userId });

    if (surveyResponse) {
      // If the user has already submitted a survey response, return an error message
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a survey response.'
      });
    }

    // Check if the user has selected at least one favorite place
    if (!entertainment && !adventure && !religious && !beach && !medical) {
      return res.status(400).json({
        success: false,
        message: 'Please select at least one favorite place.'
      });
    }

    // Check if at least one of the values is truthy
    if (!(entertainment || adventure || religious || beach || medical)) {
      return res.status(400).json({
        success: false,
        message: 'Please select at least one favorite place.'
      });
    }

    // Create a new survey response
    surveyResponse = new SurveyResponse({
      user: userId,
      entertainment,
      adventure,
      religious,
      beach,
      medical
    });

    // Save the survey response
    const savedSurveyResponse = await surveyResponse.save();

    // Update all similarity scores for all places
    await Place.updateAllSimilarityScores(savedSurveyResponse);

    res.status(200).json({
      success: true,
      message: 'Survey response saved!',
      data: savedSurveyResponse
    });
  } catch (err) {
    next(err);
  }
});







router.post('/upload-profilePicture',
upload,
  isAuth,
  authController.uploadPicture
);
router.patch('/update-profilePicture',
upload,
  isAuth,
  authController.updatePicture
);
router.delete('/delete-profilePicture',
  isAuth,
  authController.deletePicture
);
router.get('/get-profilePicture', isAuth, authController.getPicture);

router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post(
    '/signup',upload,
    [
        body('email')
            .isEmail(),
        body('password')
            .notEmpty(),
        body('name')
            .trim()
            .notEmpty(),
        body('gender')
            .notEmpty(),
        body('date')
            .notEmpty()
    ],
    authController.signup
);

router.post(
    '/login',
    [
        body('email')
            .isEmail(),
        body('password')
            .notEmpty(),
    ],
    authController.login
);


router.patch(
    '/update-name',
    [
      body('name').notEmpty(),
    ],
    isAuth, // Add the isAuth middleware here
    authController.updateName
  );

  router.patch(
    '/update-password',
    [
      body('currentPassword')
        .notEmpty(),
      body('newPassword')
        .notEmpty()
        .isLength({ min: 6 })
        .trim()
    ],
    isAuth,
    authController.updatePassword
  );
  
  router.patch(
    '/update-email',
    [
      body('email').isEmail(),
      isAuth
    ],
    authController.updateEmail
  );
  
  router.patch(
    '/update-gender',
    [
      body('gender').notEmpty(),
      isAuth
    ],
    authController.updateGender
  );
  
  router.patch(
    '/update-date-of-birth',
    [
      body('date').notEmpty(),
      isAuth
    ],
    authController.updateDateOfBirth
  );
// Password reset request route
router.post('/password-reset-request', [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email'),
], authController.requestPasswordReset);

// Password reset route
router.post('/password-reset', [
  body('email')
    .isEmail(),
  body('otp')
    .isNumeric()
    .withMessage('Please enter a valid OTP'),
  body('newPassword')
  
], authController.resetPassword);
router.post('/logout', authController.postLogout);
module.exports = router;
