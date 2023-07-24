const express = require('express');
const { body } = require('express-validator');
const isAuth = require('../middlewares/isAuth')
const isSupervisor = require("../middlewares/isSupervisor.middlware")
const placeController = require('../controllers/place.controller');
const upload = require('../middlewares/upload.middleware');
const User = require('../models/user.model');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const checkAuth = require("../middlewares/checkAuth.middleware")

const router = express.Router();
router.post('/add-place',
upload(),isSupervisor, isAuth, placeController.addPlace);
router.patch('/update-placePicture/:placeId',
upload(),isSupervisor,
  isAuth,
  placeController.updatePlacepicture
);

router.patch(
    '/update-title/:placeId',
    [
      body('title').notEmpty(),
      body('latitude').notEmpty().isNumeric(),
      body('longitude').notEmpty().isNumeric()
    ],
    isAuth,isSupervisor, // Add the isAuth middleware here
    placeController.updateTitle
  );
router.patch(
    '/update-pageUrl/:placeId',
    [
      body('pageUrl').notEmpty(),
    ],
    isAuth,isSupervisor, // Add the isAuth middleware here
    placeController.updatePageUrl
);
router.patch(
  '/update-description/:placeId',
  [
    body('description').notEmpty(),
  ],
  isAuth,isSupervisor, // Add the isAuth middleware here
  placeController.updateDescription
);
router.get('/place/:pageUrl', placeController.getPlace);
router.get('/placesUsers',isAuth, placeController.getAllPlaces);
router.get('/placesSortedByRating', placeController.getAllGuests);
module.exports = router;
