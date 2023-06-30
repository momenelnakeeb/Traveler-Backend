const User = require('../models/user.model');
const path = require('path')
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { PasswordManager } = require('../services/passwordManager.service');
const { AuthError } = require('../errors/auth.error');
const { ValidationError } = require('../errors/validation.error');
const SurveyResponse = require("../models/survey.model")
const fs = require('fs');
const moment = require('moment-timezone');


const cloudinary = require('../util/cloudinary');

const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const transporter = nodemailer.createTransport(
//   sendgridTransport({
//     auth: {
//       api_key:
//       process.env.SENDGRID_API_KEY
//     }
//   })
// );
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GOOGLE_FROM_EMAIL,
    pass: process.env.PASSWORD
  }
});
exports.uploadPicture = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new ValidationError(`Validation failed - ${errors.array()}`);
      error.data = errors.array();
      throw error;
    }

    const user = await User.findById(req.userData.userId);
    if (!user) {
      throw new AuthError('User not found');
    }

    if (req.file.path) {
      if (user.image) {
        // const publicId = user.image.split('/').pop().split('.')[0];
        throw new Error('You have already uploaded a profile picture');
      }

      // Upload file to Cloudinary

      user.image = req.file.path;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile picture uploaded!',
      data: updatedUser
    });
  } catch (err) {
    next(err);
  }
};
exports.getPicture = async (req, res, next) => {
  try {
    const user = await User.findById(req.userData.userId);
    if (!user) {
      throw new AuthError('User not found');
    }

    res.status(200).json({
      success: true,
      message: 'Profile picture retrieved!',
      data: user.image
    });
  } catch (err) {
    next(err);
  }
};

exports.updatePicture = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new ValidationError(`Validation failed - ${errors.array()}`);
      error.data = errors.array();
      throw error;
    }

    const user = await User.findById(req.userData.userId);
    if (!user) {
      throw new AuthError('User not found');
    }

    if (req.file.path) {
      // Delete the old image if it exists
      if (user.image) {
        const publicId = user.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }
      user.image = req.file.path;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile picture updated!',
      data: updatedUser
    });
  } catch (err) {
    next(err);
  }
};



exports.deletePicture = async (req, res, next) => {
  try {
    const user = await User.findById(req.userData.userId);
    if (!user) {
      throw new AuthError('User not found');
    }

    if (user.image) {
      // Extract public_id from image URL
      const publicId = user.image.split('/').pop().split('.')[0];

      // Delete image from Cloudinary
      await cloudinary.uploader.destroy(publicId);

      // Update user record
      user.image = undefined;
      await user.save();

      return res.status(200).json({
        success: true,
        message: 'Profile picture deleted!',
        data: user
      });
    } else {
      throw new Error('No profile picture to delete');
    }
  } catch (err) {
    next(err);
  }
};



exports.requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      throw new AuthError('not valid login credentials');
    }

    // Generate a random OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Store the OTP and its expiry time in the user document
    user.passwordResetOTP = {
      otp: otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // OTP expires in 10 minutes
    };
    await user.save();

    // Send the OTP to the user's email using nodemailer
    await transporter.sendMail({
      from: process.env.GOOGLE_FROM_EMAIL,
      to: user.email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is ${otp}`,
      html: `<!DOCTYPE html>
      <html>
      <head>
        <style>
          .container1 {
            background: linear-gradient(to bottom right, #d0ae96, #483434, #c6a288);
            border-radius: 15px;
            padding: 15px; 
            width: 40%;
            
          }
          .container {
            display: flex;
            flex-direction: row;
            background-color: #ffffff;
            border-radius: 15px;
            padding: 10px;
          }
          .Traveller {
            font-size: 40px;
            font-weight: bold;
            font-family: cursive;
            color: #483434;
          }
          .otp-image {
            width: 220px;
            height: 200px;
            border-radius: 50%;
          }
          .word {
            font-weight: bold;
            font-family: Arial, sans-serif;
            margin-top: 10px;
            font-size: 20px;
          }
          .word1 {
            font-weight: bold;
            font-family: Arial, sans-serif;
            margin-bottom: 10px;
            font-size: 20px;
          }
          .otp {
            font-weight: bold;    
            font-family: Arial, sans-serif;  
            margin-bottom: 10px;
            font-size: 28px;
          }
          .time {
            color: red;
            font-weight: bold;
            margin-bottom: 10px;
            font-family: Arial, sans-serif;  
            font-size: 20px;
          }
          @media only screen and (max-width: 1300px) {
            .otp-image {
              width: 150px;
              height: 220px;
              border-radius: 50%;
            }
            .word, .word1, .time {
              font-size: 13px;
            }
            .Traveller {
              font-size: 28px;
            }
            .otp {
              font-size: 18px;
            }  
            .container {
              display: flex;
            flex-direction: row;
            background-color: #ffffff;
            border-radius: 15px;
            padding: 10px;
              width: 100%;
            } 
          }
          .container2 {
            margin-right: 10px;
            margin-left: 10px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
        </style>
      </head>
      <body>
        <div class="container1">
          <div class="container">
            <div class="container2">
              <div class="Traveller">Traveller</div>
              <div class="word">Here is your (OTP)</div>
              <div class="word1">to reset password</div>
              <div class="otp">${otp}</div>
              <div class="time">It's valid for 10 minutes only</div>
              <div>If you didn't request this OTP, please ignore this message</div> 
            </div>
            <img class="otp-image" src="https://i.ibb.co/rpfWqNt/20230623040639-fpdl-in-security-otp-one-time-password-smartphone-shield-9904-104-normal.jpg" alt="OTP Image">
          </div>
        </div>
      </body>
      </html>`
    });

    res.status(200).json({
      success: true,
      message: 'Password reset OTP sent to your email',
    });
  } catch (err) {
    next(err);
  }
};




exports.resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      throw new AuthError('not valid login credentials');
    }

    // Verify the OTP
    if (!user.passwordResetOTP || user.passwordResetOTP.otp !== otp ||
      user.passwordResetOTP.expiresAt < new Date()) {
      throw new AuthError('invalid OTP or OTP expired');
    }

    // Reset the password
    user.password = newPassword;
    user.passwordResetOTP = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful',
    });
  } catch (err) {
    next(err);
  }
};

// const multer = require('multer');
// const uuidv4 = require('uuid');

// const fileStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'profilePictures');
//   },
//   filename: (req, file, cb) => {
//     cb(null, uuidv4() + ':' + file.originalname);
//   }
// });

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype === 'profilePicture/jpeg' || file.mimetype === 'profilePicture/png' || file.mimetype === 'profilePicture/jpg') {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };

//const upload = multer({ storage: fileStorage, fileFilter: fileFilter });

exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new ValidationError(`Validation failed - ${errors.array()}`);
      error.data = errors.array();
      throw error;
    }

    const { email, name, password, gender, date } = req.body;
    
    const existedUser = await User.findOne({ $or: [{ email: email }, { name: name }] });
    if (existedUser) {
      if (existedUser.email === email) {
        throw new ValidationError('The email you have entered is already used by a different user');
      }

      if (existedUser.name === name) {
        throw new ValidationError('The name you have entered is already used by a different user');
      }
    }

    const newUser = new User({
      email: email,
      password: password,
      name: name,
      date: date,
      gender: gender,
      image: req.file ? req.file.path : null
    });

    const addedUser = await newUser.save();

    res.status(201).json({
      success: true,
      message: 'User created!',
      data: addedUser,
    });
  } catch (err) {
    next(err);
  }
};


exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      throw new AuthError('not valid login credentials');
    }

    await PasswordManager.compare(password, user.password);

    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    // // Store the JWT token in an HTTP-only cookie
    // res.cookie('token', token, { httpOnly: true });
    // Search for the user's survey response
    // console.log(user.age); // Output: 24
    const currentDate = moment();
    const lastLoginDate = user.lastLogin
      ? moment(user.lastLogin).startOf('day')
      : null;

    // Check if a day or more has passed since the last login
    if (!lastLoginDate || !currentDate.isSame(lastLoginDate, 'day')) {
      // Increment the loginPoints and update the lastLogin field
      user.loginPoints = (user.loginPoints || 0) + 1;
      user.lastLogin = currentDate.toISOString();
      await user.save();
    }

    const surveyResponse = await SurveyResponse.findOne({ user: user._id });
    // Update the `hasSurvey` field if a survey response is found
    if (surveyResponse) {
      user.hasSurvey = true;
      await user.save();
    }



    res.status(200).json({
      success: true,
      message: 'user logged In',
      data: user,
      token: token,
    });
  } catch (err) {
    next(err);
  }
};
exports.postLogout = async (req, res, next) => {
  try {
    // Clear the JWT token from the client-side storage
    res.clearCookie('token');
    res.status(200).json({ message: 'User logged out successfully' });
  } catch (err) {
    next(err);
  }
};

//logging out with storing the jwt in database by applying this line of code in the login-controller
// await User.findOneAndUpdate({ email }, { token });
// and the coming code for a postLogout function
// exports.postLogout = async (req, res, next) => {
//   const { email } = req.body;

//   try {
//     await User.findOneAndUpdate({ email }, { token: null });
//     res.json({ message: 'Logout successful' });
//   } catch (err) {
//         next(err);
//     }
// };


exports.updateName = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new ValidationError(`Validation failed - ${errors.array()}`);
      error.data = errors.array();
      throw error;
    }

    const { name } = req.body;

    const user = await User.findById(req.userData.userId);
    if (!user) {
      throw new AuthError('User not found');
    }

    user.name = name;
    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'User updated!',
      data: updatedUser
    });
  } catch (err) {
    next(err);
  }
};



exports.updateEmail = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new ValidationError(`Validation failed - ${errors.array()}`);
      error.data = errors.array();
      throw error;
    }

    const { email } = req.body;

    const user = await User.findById(req.userData.userId);
    if (!user) {
      throw new AuthError('User not found');
    }

    const repetitionEmail = await User.findOne({ email: email });
    if (repetitionEmail) {
      throw new ValidationError('The email you have entered is already used by another user');
    }

    user.email = email;
    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Email updated!',
      data: updatedUser
    });
  } catch (err) {
    next(err);
  }
};



exports.updatePassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new ValidationError(`Validation failed - ${errors.array()}`);
      error.data = errors.array();
      throw error;
    }

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.userData.userId);
    if (!user) {
      throw new AuthError('User not found');
    }

    await PasswordManager.compare(currentPassword, user.password);
    user.password = newPassword;
    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated!',
      data: updatedUser
    });
  } catch (err) {
    next(err);
  }
};


exports.updateDateOfBirth = async (req, res, next) => {
  try {
    const { date } = req.body;


    const user = await User.findById(req.userData.userId);
    if (!user) {
      throw new AuthError('not valid login credentials');
    }
    user.date = date;
    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Date of birth updated successfully!',
      data: updatedUser,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateGender = async (req, res, next) => {
  try {
    const { gender } = req.body;


    const user = await User.findById(req.userData.userId);
    if (!user) {
      throw new AuthError('not valid login credentials');
    }

    user.gender = gender;
    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Gender updated successfully!',
      data: updatedUser,
    });
  } catch (err) {
    next(err);
  }
};


