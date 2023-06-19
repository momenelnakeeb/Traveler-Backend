const express = require('express');
const { body } = require('express-validator');
const isAuth = require('../middlewares/isAuth')
const ratingController = require('../controllers/rating.controller');
//const User = require('../models/user.model');
const path = require('path');

const router = express.Router();

router.post('/create-rating/:pageUrl',[
    body('rating').notEmpty()
  ], isAuth, ratingController.createRating);

  router.get('/ratings/:pageUrl' ,ratingController.getRatings);
  router.patch(
    '/update-rating/:ratingId',
    [
      body('rating')
        .isFloat({ min: 0.5, max: 5.0 })
        .withMessage('Rating must be a number between 0.5 and 5.0')
    ],
    isAuth,
    ratingController.updateRating
  );
  router.post('/delete-rating/:ratingId', isAuth, ratingController.deleteRating);
  module.exports = router;