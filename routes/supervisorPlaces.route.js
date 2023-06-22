const express = require('express');
const { body } = require('express-validator');
const isAuth = require('../middlewares/isAuth');
const supervisorPlacesController = require('../controllers/SupervisorPlaces.controller');
const isSupervisor = require("../middlewares/isSupervisor.middlware")
const upload = require('../middlewares/upload.middleware');
const router = express.Router();

router.post(
  '/supervisor-places/:pageUrl',
  [
    // Validate the request body
    body('title'),
    body('description'),
  ],
  isSupervisor,
  isAuth,
  upload,
  supervisorPlacesController.createSupervisorPlace
);

router.get('/supervisor-places/:pageUrl', supervisorPlacesController.getSupervisorPlaces);
router.patch(
    '/supervisor-places/:supervisorPlaceId',
    [
      // Validate the request body
      body('title'),
      body('description'),
    ],
    isSupervisor,
    isAuth,
    upload,
    supervisorPlacesController.updateSupervisorPlace
  );
  router.delete(
    '/supervisor-places/:supervisorPlaceId',
    isSupervisor,
    isAuth,
    supervisorPlacesController.deleteSupervisorPlace
  );

module.exports = router;
