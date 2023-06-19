const express = require('express');
const { body } = require('express-validator');
const isAuth = require('../middlewares/isAuth')
const commentController = require('../controllers/comment.controller');
const User = require('../models/user.model');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
router.post('/create-comment/:pageUrl',[
    body('content').notEmpty().isLength({  max: 500 }),
  ], isAuth, commentController.createComment);

router.get('/comments/:pageUrl', commentController.getComments);
router.patch(
    '/update-comment/:commentId',
    [
        body('content').notEmpty().isLength({  max: 500 }),
    ],
    isAuth, // Add the isAuth middleware here
    commentController.updateComment
  );

router.post('/delete-comment/:commentId', isAuth, commentController.deleteComment);

module.exports = router;