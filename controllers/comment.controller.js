const fs = require('fs');
const path = require('path');
const badWords = require('bad-words');

const { validationResult } = require('express-validator');

const Comment = require('../models/comment.model');
const User = require('../models/user.model');
const Place = require('../models/place.model');
const filter= new badWords();

exports.createComment= async (req, res, next) => {
  try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed, entered data is incorrect.');
      error.statusCode = 422;
      throw error;
    }
    const {content} = req.body;
    const user = await User.findById(req.userData.userId);
    if(filter.isProfane(content))
   {
      throw new Error('comment contains bad words.')
    }
    const {pageUrl}=req.params;
    const place = await Place.findOne({ pageUrl} );
    if(!place){
      throw new Error('Place not found.')
    }
    const comment = new Comment({ 
      pageUrl:pageUrl,
      user:user,
      content: content
     });
     const addedComment = await comment.save();
    res.status(201).json({
      success: true,
      message: 'comment created successfully!',
      data: {content,image:user.image,name:user.name,date:comment.date}

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




// exports.getPosts = async (req, res, next) => {
//   const currentPage = req.query.page || 1;
//   const perPage = 2;
//   let totalItems;
//   try {
//     totalItems = await Post.find().countDocuments();
//     const posts = await Post.find().skip((currentPage - 1) * perPage).limit(perPage);
//     res.status(200).json({
//       message: 'Fetched posts successfully.',
//       posts: posts,
//       totalItems: totalItems
//     });
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     next(err);
//   }
// };

// exports.createPost = async (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     const error = new Error('Validation failed, entered data is incorrect.');
//     error.statusCode = 422;
//     throw error;
//   }
//   if (!req.file) {
//     const error = new Error('No image provided.');
//     error.statusCode = 422;
//     throw error;
//   }
//   const imageUrl = req.body.imageUrl;
//   //const imageUrl = req.file.path;
//   const title = req.body.title;
//   const content = req.body.content;
//   let creator;
//   const post = new Post({
//     title: title,
//     content: content,
//     imageUrl: imageUrl,
//     creator: req.userId
//   });
//   try {
//     const result = await post.save();
//     const user = await User.findById(req.userId);
//     creator = user;
//     user.posts.push(post);
//     await user.save();
//     res.status(201).json({
//       message: 'Post created successfully!',
//       post: post,
//       creator: { _id: creator._id, name: creator.name }
//     });
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     next(err);
//   }
// };

// exports.getPost = async (req, res, next) => {
//   try {
//     const postId = req.params.postId;
//     const post = await Post.findById(postId);
//     if (!post) {
//       const error = new Error('Could not find post.');
//       error.statusCode = 404;
//       throw error;
//     }
//     res.status(200).json({ message: 'Post fetched.', post: post });
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     next(err);
//   }
// };

// exports.updatePost = async (req, res, next) => {
//   const postId = req.params.postId;
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     const error = new Error('Validation failed, entered data is incorrect.');
//     error.statusCode = 422;
//     throw error;
//   }
//   const title = req.body.title;
//   const content = req.body.content;
//   let imageUrl = req.body.image;
//   if (req.file) {
//     imageUrl = req.file.path;
//   }
//   if (!imageUrl) {
//     const error = new Error('No file picked.');
//     error.statusCode = 422;
//     throw error;
//   }
//   try {
//     const post = await Post.findById(postId);
//     if (!post) {
//       const error = new Error('Could not find post.');
//       error.statusCode = 404;
//       throw error;
//     }
//     if (post.creator.toString() !== req.userId) {
//       const error = new Error('Not authorized!');
//       error.statusCode = 403;
//       throw error;
//     }
//     if (imageUrl !== post.imageUrl) {
//       clearImage(post.imageUrl);
//     }
//     post.title = title;
//     post.imageUrl = imageUrl;
//     post.content = content;
//     const result = await post.save();
//     res.status(200).json({ message: 'Post updated!', post: result });
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     next(err);
//   }
// };

// exports.deletePost = async (req, res, next) => {
//   const postId = req.params.postId;
//   try {
//     const post = await Post.findById(postId);
//     if (!post) {
//       const error = new Error('Could not find post.');
//       error.statusCode = 404;
//       throw error;
//     }
//     if (post.creator.toString() !== req.userId) {
//       const error = new Error('Not authorized!');
//       error.statusCode = 403;
//       throw error;
//     }
//     clearImage(post.imageUrl);
//     await Post.findByIdAndRemove(postId);
//     const user = await User.findById(req.userId);
//     user.posts.pull(postId);
//     await user.save();
//     res.status(200).json({ message: 'Deleted post.' });
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     next(err);
//   }
// };

const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => console.log(err));
};
