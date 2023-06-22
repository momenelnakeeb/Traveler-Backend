const { validationResult } = require('express-validator');
const User = require('../models/user.model');
const Place = require('../models/place.model');
const SupervisorPlace = require('../models/supervisorPlaces.model');

exports.createSupervisorPlace = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      throw error;
    }

    const { title, description } = req.body;
    const { file } = req;
    const imagePath = (file && file.path) || null;
    const userId = req.userData.userId;
    const { pageUrl } = req.params;
    const place = await Place.findOne({ pageUrl });

    if (!place) {
      throw new Error('Place not found.');
    }

    const user = await User.findById(userId);

    const supervisorPlace = new SupervisorPlace({
    pageUrl: pageUrl,
    user: userId,
    title: title,
    description: description,
    image: imagePath,
    });

    const savedSupervisorPlace = await supervisorPlace.save();

    res.status(201).json({
      success: true,
      message: 'SupervisorPlace created successfully!',
      data: {
        supervisorPlace: savedSupervisorPlace,
        // user: {
        //   _id: user._id,
        //   name: user.name,
        //   image: user.image
        // }
      }
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getSupervisorPlaces = async (req, res, next) => {
    try {
      const { pageUrl } = req.params;
  
      // Validate pageUrl
      if (!pageUrl) {
        const error = new Error('Page URL is required.');
        error.statusCode = 422;
        throw error;
      }
  
      const supervisorPlaces = await SupervisorPlace.find({ pageUrl })
        .sort({ createdAt: -1 }) // Sort by createdAt field in descending order (newest first)
        .exec();
  
      if (!supervisorPlaces || supervisorPlaces.length === 0) {
        const error = new Error('Could not find supervisor places for this page.');
        error.statusCode = 404;
        throw error;
      }
  
      res.status(200).json({
        success: true,
        data: supervisorPlaces,
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };
  


  exports.updateSupervisorPlace = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        throw error;
      }
  
      const { title, description } = req.body;
      const { file } = req;
      const imagePath = (file && file.path) || null;
      const supervisorPlaceId = req.params.supervisorPlaceId;
  
      const supervisorPlace = await SupervisorPlace.findById(supervisorPlaceId);
      if (!supervisorPlace) {
        throw new Error('SupervisorPlace not found.');
      }
  
      supervisorPlace.title = title;
      supervisorPlace.description = description;
      supervisorPlace.image = imagePath;
  
      const updatedSupervisorPlace = await supervisorPlace.save();
  
      res.status(200).json({
        success: true,
        message: 'SupervisorPlace updated successfully!',
        data: updatedSupervisorPlace,
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };
  

exports.deleteSupervisorPlace = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error(`Validation failed - ${errors.array()}`);
      error.data = errors.array();
      throw error;
    }

    const supervisorPlaceId = req.params.supervisorPlaceId;
    const supervisorPlace = await SupervisorPlace.findById(supervisorPlaceId);

    if (!supervisorPlace) {
      throw new Error('Supervisor place not found.');
    }

    await supervisorPlace.remove();

    res.status(200).json({
      success: true,
      message: 'SupervisorPlace deleted!'
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
