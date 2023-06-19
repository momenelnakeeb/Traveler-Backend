const { validationResult } = require('express-validator');
const Rating = require('../models/rating.model');
const User = require('../models/user.model');
const Place = require('../models/place.model');
const { AuthError } = require('../errors/auth.error');

exports.createRating = async (req, res, next) => {
  try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          const error = new Error('Validation failed, entered data is incorrect.');
          error.statusCode = 422;
          throw error;
      }

      const { rating } = req.body;
      const pageUrl = req.params.pageUrl;
      const userId = req.userData.userId;

      const existingRating = await Rating.findOne({ user: userId, pageUrl });
      if (existingRating) {
          const error = new Error('You have already rated this place.');
          error.statusCode = 400;
          throw error;
      }

      const user = await User.findById(userId);
      const place = await Place.findOne({ pageUrl });
      if (!place) {
          const error = new Error('Place not found.');
          error.statusCode = 404;
          throw error;
      }

      const ratingObj = new Rating({
          pageUrl: pageUrl,
          user: user,
          rating: rating,
      });

      const addedRating = await ratingObj.save();

      const ratingCount = await Rating.find({ pageUrl });
      let ratings = [];
      for (let i = 0; i < ratingCount.length; i++) {
          ratings.push(ratingCount[i].rating);
      }

      let sum = 0;
      for (let i = 0; i < ratings.length; i++) {
          sum += ratings[i];
      }

      const averageRating = Math.round(sum / ratings.length);
      place.averageRating = averageRating;
      const updatedPlace = await place.save();

      res.status(201).json({
          success: true,
          message: 'Rating created successfully!',
          data: {
              rating: addedRating.rating,
              image: user.image,
              name: user.name,
              date: addedRating.date,
              ratingId: addedRating._id,
          }
      });
  } catch (err) {
      if (!err.statusCode) {
          err.statusCode = 500;
      }
      next(err);
  }
};
 

 
exports.updateRating = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new ValidationError(`Validation failed - ${errors.array()}`);
      error.data = errors.array();
      throw error;
    }

    const ratingId = req.params.ratingId;
    const userId = req.userData.userId;

    const rating = await Rating.findById(ratingId);
    if (!rating) {
      throw new AuthError('Rating not found');
    }

    if (!userId) {
      throw new AuthError('User ID not found');
    }
    if (rating.user && rating.user.toString() !== userId.toString()) {
      throw new AuthError('Not authorized');
    }

    const updatedRating = req.body.rating;
    rating.rating = updatedRating;

    await rating.save();

    const place = await Place.findOne({ pageUrl: rating.pageUrl });
    if (!place) {
      throw new AuthError('Place not found');
    }

    const ratingCount = await Rating.find({ pageUrl: rating.pageUrl });
    const ratings = ratingCount.map((rating) => rating.rating);
    const sum = ratings.reduce((acc, curr) => acc + curr, 0);
    const averageRating = Math.round(sum / ratings.length) || 0;
    place.averageRating = averageRating;

    await place.save();

    res.status(200).json({
      success: true,
      message: 'Rating updated!',
      rating: updatedRating
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteRating = async (req, res, next) => {
  try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          const error = new ValidationError(`Validation failed - ${errors.array()}`);
          error.data = errors.array();
          throw error;
      }

      const ratingId = req.params.ratingId;

      const ratingObj = await Rating.findByIdAndDelete(ratingId);
      if (!ratingObj) {
          throw new AuthError('Rating not found');
      }

      const place = await Place.findOne({ pageUrl: ratingObj.pageUrl });
      if (!place) {
          throw new AuthError('Place not found');
      }

      const ratingCount = await Rating.find({ pageUrl: ratingObj.pageUrl });
      const ratings = ratingCount.map((rating) => rating.rating);
      const sum = ratings.reduce((acc, curr) => acc + curr, 0);
      const averageRating = Math.round(sum / ratings.length) || 0;
      place.averageRating = averageRating;

      const updatedPlace = await place.save();

      res.status(200).json({
          success: true,
          message: 'Rating deleted!',
      });
  } catch (err) {
      next(err);
  }
};
  exports.getRatings = async (req, res, next) => {
    try{
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
      }
      const {pageUrl}=req.params;
      const ratingObj =await Rating.find({pageUrl:req.params.pageUrl});
      const place = await Place.findOne( {pageUrl });
     
      res.status(200).json({
        success: true,
        rating:  place.averageRating,
        data: ratingObj,
        num_of_users :ratingObj.length
      });
      
    }catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  
  };