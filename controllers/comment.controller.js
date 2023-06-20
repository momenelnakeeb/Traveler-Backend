const fs = require('fs');
const path = require('path');
const badWords = require('bad-words');

const { validationResult } = require('express-validator');

const Comment = require('../models/comment.model');
const User = require('../models/user.model');
const Place = require('../models/place.model');
const filter= new badWords();

exports.createComment = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      throw error;
    }

    const { content } = req.body;
    const userId = req.userData.userId;

    if (filter.isProfane(content)) {
      throw new Error('Comment contains bad words.');
    }

    const { pageUrl } = req.params;
    const place = await Place.findOne({ pageUrl });

    if (!place) {
      throw new Error('Place not found.');
    }

    const user = await User.findById(userId);

    if (!user.commentedPageUrls.includes(pageUrl)) {
      user.commentedPageUrls.push(pageUrl);
      user.loginPoints += 1; // Increase login points for the first comment on this pageUrl
      await user.save();
    }

    const comment = new Comment({
      pageUrl: pageUrl,
      user: userId,
      content: content
    });
    user.commentNumber += 1;
    await user.save();
    const addedComment = await comment.save();

    res.status(201).json({
      success: true,
      message: 'Comment created successfully!',
      data: {
        content,
        image: user.image,
        name: user.name,
        date: comment.date
      }
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};



exports.getComments = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      throw error;
    }

    const comments = await Comment.aggregate([
      { $match: { pageUrl: req.params.pageUrl } },
      { $lookup: {
          from: 'ratings',
          let: { userId: '$user' },
          pipeline: [
            { $match: { $expr: { $and: [{ $eq: ['$user', '$$userId'] }, { $eq: ['$pageUrl', req.params.pageUrl] }] } } },
          ],
          as: 'ratings'
        }
      },
      { $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      { $project: {
          _id: 1,
          content: 1,
          createdAt: 1,
          updatedAt: 1,
          'user._id': 1,
          'user.name': 1,
          'user.image': 1,
          'rating': { $ifNull: [{ $arrayElemAt: ['$ratings.rating', 0] }, 0] }
        }
      }
    ]);

    if (!comments) {
      const error = new Error('Could not find comments on this page.');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: comments
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};


exports.updateComment = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new ValidationError(`Validation failed - ${errors.array()}`);
      error.data = errors.array();
      throw error;
    }

    const { content } = req.body;
    const commentId = req.params.commentId;
    const user = await User.findById(req.userData.userId);
    const comment = await Comment.findById(commentId);
    if (!comment) {
      throw new AuthError('comment not found');
    }

    comment.content = content;
    const updatedComment = await comment.save();

    res.status(200).json({
      success: true,
      message: 'Comment updated!',
      data: updatedComment.content, image:user.image,name:user.name,date:updatedComment.date
    });
  } catch (err) {
    next(err);
  }
};


exports.deleteComment = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new ValidationError(`Validation failed - ${errors.array()}`);
      error.data = errors.array();
      throw error;
    }

    const commentId = req.params.commentId;

    const comment = await Comment.deleteOne({ _id: commentId});
    if (!comment) {
      throw new AuthError('comment not found');
    }


    res.status(200).json({
      success: true,
      message: 'Comment deleted!',
    });
  } catch (err) {
    next(err);
  }
};
