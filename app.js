const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');


dotenv.config();

const routeCatcher = require('./middlewares/catchAllRoutes.middleware');
const errorHandler = require('./middlewares/errorHandler.middleware');
const upload = require('./middlewares/upload.middleware');

// routes
const authRoutes = require('./routes/auth.route');
const commentRoutes = require('./routes/comment.route');
const ratingRoutes = require('./routes/rating.route');
const placeRoutes=require('./routes/place.route');
const couponRoutes=require('./routes/coupon.route');
const statisticsRoutes = require('./routes/statistics.route');

const app = express();
// const fileStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, './public');
//     },
//     filename: (req, file, cb) => {
//       cb(null, uuidv4() + ':' + file.originalname);
//     }
//   });
  
//   const fileFilter = (req, file, cb) => {
//     console.log(file.mimetype);
//     if (
//       file.mimetype === 'image/png' ||
//       file.mimetype === 'image/jpg' ||
//       file.mimetype === 'image/jpeg'
//     ) {
//       cb(null, true);
//     } else {
//       cb(null, false);
//     }
//   };
//   const upload = multer({ storage: fileStorage, fileFilter: fileFilter }).single('profilePicture');
app.use(cors());
app.use(bodyParser.json());
// registerd routes
app.use('/auth', authRoutes);
app.use('/supervisor',placeRoutes);
app.use('/admin', commentRoutes);
app.use('/admin', ratingRoutes);
app.use('/coupon',couponRoutes);
app.use('/statistics', statisticsRoutes);
// add multer middleware
// app.use(multer().single('profilePicture'));

  
app.use(
   upload)
  ;
  app.use(express.static(path.join(__dirname, 'public')));
  app.use('/public', express.static(path.join(__dirname, 'public')));
  
app.all('*', routeCatcher);
app.use(errorHandler);
// app.use(uploadHandler);


module.exports = app;