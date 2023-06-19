const Place = require('../models/place.model');
const Comment=require('../models/comment.model');
const Rating=require('../models/rating.model');
const User=require('../models/user.model');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { ValidationError } = require('../errors/validation.error');
const { AuthError } = require('../errors/auth.error');
const SurveyResponse = require("../models/survey.model")
const cloudinary = require('../util/cloudinary');
const path = require('path');

// const fs = require('fs');

// const multer = require('multer');
// const uuidv4 = require('uuid');


// const fileStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'placePictures');
//   },
//   filename: (req, file, cb) => {
//     cb(null, uuidv4() + ':' + file.originalname);
//   }
// });

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype === 'placePicture/jpeg' || file.mimetype === 'placePicture/png' || file.mimetype === 'placePicture/jpg') {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };


exports.addPlace = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new ValidationError(`Validation failed - ${errors.array()}`);
      error.data = errors.array();
      throw error;
    }

    const { similarityScore, title, description, pageUrl, entertainment, history, adventure, religious, beach, medical } = req.body;

    // check if a place with the same pageUrl already exists
    const existingPlace = await Place.findOne({ pageUrl });
    if (existingPlace) {
      const error = new Error('A place with the same pageUrl already exists.');
      error.statusCode = 409;
      throw error;
    }

    // upload image
    const { file } = req;
    const imagePath = (file && file.path) || null;

    const place = new Place({
      title: title,
      description: description,
      image: imagePath,
      pageUrl: pageUrl,
      entertainment: entertainment || false,
      history: history || false,
      adventure: adventure || false,
      religious: religious || false,
      beach: beach || false,
      medical: medical || false,
      similarityScore: similarityScore || false
    });

    const result = await place.save();
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (err) {
    if (req.image) {
      const publicId = req.image.split('/').pop().split('.')[0];

      // Delete image from Cloudinary
      await cloudinary.uploader.destroy(publicId);
    }
    next(err);
  }
};





// exports.uploadPicture = async (req, res, next) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       const error = new ValidationError(`Validation failed - ${errors.array()}`);
//       error.data = errors.array();
//       throw error;
//     }
    
//     const place = await Place.findById(req.placeData.placeId);
//     if (!place) {
//       throw new AuthError('Place not found');
//     }
    
//     if (req.file) {
//       place.image = req.file.path;
//     }
   
//     const updatedPlace = await place.save();

//     res.status(200).json({
//       success: true,
//       message: 'Place picture uploaded!',
//       data: updatedPlace
//     });
//   } catch (err) {
//     next(err);
//   }
// };

exports.updatePlacepicture = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new ValidationError(`Validation failed - ${errors.array()}`);
      error.data = errors.array();
      throw error;
    }
    const placeId = req.params.placeId;
    const place = await Place.findById(placeId);
    if (!place) {
      throw new AuthError('Place not found');
    }
    if (req.file.path) {
      // Delete the old image if it exists
      if (place.image) {
        const publicId = place.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }
      place.image = req.file.path;
    }
  
   
    const updatedPlace = await place.save();
  
    res.status(200).json({
      success: true,
      message: 'Place picture updated!',
      data: updatedPlace
    });
  } catch (err) {
    next(err);
  }
};

exports.updateTitle = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new ValidationError(`Validation failed - ${errors.array()}`);
      error.data = errors.array();
      throw error;
    }
    const placeId = req.params.placeId;
    const place = await Place.findById(placeId);
    if (!place) {
      throw new AuthError('Place not found');
    }
    const { title } = req.body;

    place.title = title;
    const updatedPlace = await place.save();

    res.status(200).json({
      success: true,
      message: 'Place updated!',
      data: updatedPlace
    });
  } catch (err) {
    next(err);
  }
};


exports.updatePageUrl = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new ValidationError(`Validation failed - ${errors.array()}`);
      error.data = errors.array();
      throw error;
    }

    const { pageUrl } = req.body;
    const placeId = req.params.placeId;
    const place = await Place.findById(placeId);
    if (!place) {
      throw new AuthError('Place not found');
    }

    place.pageUrl = pageUrl;
    const updatedPlace = await place.save();

    res.status(200).json({
      success: true,
      message: 'Place updated!',
      data: updatedPlace
    });
  } catch (err) {
    next(err);
  }
};


exports.updateDescription = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new ValidationError(`Validation failed - ${errors.array()}`);
      error.data = errors.array();
      throw error;
    }

    const { description } = req.body;
    const placeId = req.params.placeId;
    const place = await Place.findById(placeId);
    if (!place) {
      throw new AuthError('Place not found');
    }

    place.description = description;
    const updatedPlace = await place.save();

    res.status(200).json({
      success: true,
      message: 'Place updated!',
      data: updatedPlace
    });
  } catch (err) {
    next(err);
  }
};


exports.getPlace = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      throw error;
    }
    const {pageUrl} = req.params;
    const place = await Place.findOne({pageUrl});
  
    if (!place) {
      const error = new Error('Could not find places on this page.');
      error.statusCode = 404;
      throw error;
    }
    const comments = await Comment.find({ pageUrl }).populate('user', 'name image');
    
    if (!comments) {
      const error = new Error('Could not find comments on this page.');
      error.statusCode = 404;
      throw error;
    }
    const ratingObj =await Rating.find({pageUrl});
    //const {rating} = req.body;
      if (ratingObj===0) {
        const error = new Error('Could not find ratings on this page.');
      }
      let ratings=[];
      for(let i=0; i<ratingObj.length; i++){
        ratings.push(ratingObj[i].rating);
       }
      let sum=0;
      for(let i=0; i<ratings.length; i++){
        sum+=ratings[i];
       }
      
      const averageRating = Math.round(sum/ratings.length);
    res.status(200).json({
      success: true,
      data:{place,comments,averageRating}
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
exports.getAllPlaces = async (req, res, next) => {
  try {
    const userId = req.userData.userId;
    const userSurvey = await SurveyResponse.findOne({ user: userId });
    console.log(userId);
    console.log(userSurvey);

    // set default values if userSurvey is null
    const defaultSurvey = {
      adventure: false,
      religious: false,
      beach: false,
      medical: false,
      entertainment: false,
    };
    const survey = userSurvey || defaultSurvey;

    let matchedPlaces = [];
    if (userSurvey) {
      // continue with the rest of the code
      if (
        !survey.adventure &&
        !survey.religious &&
        !survey.beach &&
        !survey.medical &&
        !survey.entertainment
      ) {
        const places = await Place.find();
        matchedPlaces = places.sort((a, b) => b.averageRating - a.averageRating);
      } else {
        const places = await Place.find();

        places.forEach((place) => {
          if (
            (userSurvey.adventure && place.adventure) ||
            (userSurvey.religious && place.religious) ||
            (userSurvey.beach && place.beach) ||
            (userSurvey.medical && place.medical) ||
            (userSurvey.entertainment && place.entertainment)
          ) {
            matchedPlaces.push(place);
          }
        });
        matchedPlaces.sort((a, b) => b.averageRating - a.averageRating);
      }
    } else {
      // userSurvey is null, display most rated places
      const places = await Place.find();
      matchedPlaces = places.sort((a, b) => b.averageRating - a.averageRating);
    }

    // Step 2: Retrieve all other places, sorted by their similarity to the most highly rated places
    const mostHighlyRatedPlaceIds = matchedPlaces.map((place) => place._id);
    const otherPlaces = await Place.find({
      _id: { $nin: mostHighlyRatedPlaceIds },
    })
      .lean()
      .select("-ratings");

    const similarityScores = otherPlaces.map((place) => {
      let similarityScore = 0;
      if (place.entertainment === userSurvey.entertainment) similarityScore += 1;
      if (place.adventure === userSurvey.adventure) similarityScore += 1;
      if (place.religious === userSurvey.religious) similarityScore += 1;
      if (place.beach === userSurvey.beach) similarityScore += 1;
      if (place.medical === userSurvey.medical) similarityScore += 1;
      return { place, similarityScore };
    });

    const sortedSimilarityScores = similarityScores.sort(
      (a, b) => b.similarityScore - a.similarityScore
    );
    const otherPlacesSorted = sortedSimilarityScores.map(
      (score) => score.place
    );
    otherPlacesSorted.sort((a, b) => b.averageRating - a.averageRating);
    if (otherPlacesSorted.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          matchedPlaces,
        },
      });
    }
    console.log(otherPlacesSorted);
    res.status(200).json({
      success: true,
      data: {
        matchedPlaces,
        otherPlacesSorted,
        //  recommendedPlaces,
      },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
exports.getAllGuests = async (req, res, next) => {
  try {
    const { entertainment, adventure, religious, beach, medical } = req.query;

    let pipeline;

    if (entertainment || adventure || religious || beach || medical) {
      pipeline = [
        {
          $addFields: {
            similarityScore: {
              $sum: [
                { $cond: [{ $eq: ['$entertainment', entertainment] }, 1, 0] },
                { $cond: [{ $eq: ['$adventure', adventure] }, 1, 0] },
                { $cond: [{ $eq: ['$religious', religious] }, 1, 0] },
                { $cond: [{ $eq: ['$beach', beach] }, 1, 0] },
                { $cond: [{ $eq: ['$medical', medical] }, 1, 0] },
              ],
            },
          },
        },
        {
          $sort: { similarityScore: -1, averageRating: -1 },
        },
      ];
    } else {
      pipeline = [
        {
          $sort: { similarityScore: -1, averageRating: -1 },
        },
      ];
    }

    const places = await Place.aggregate(pipeline);
    
    res.status(200).json({
      success: true,
      data: {
        places,
      },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};


