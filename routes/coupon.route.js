const express = require('express');
const { body } = require('express-validator');
const isAuth = require('../middlewares/isAuth')
const isSupervisor = require("../middlewares/isSupervisor.middlware")
const couponController = require('../controllers/coupon.controller');
const User = require('../models/user.model');
const path = require('path');
const checkAuth = require("../middlewares/checkAuth.middleware")

const router = express.Router();
router.post('/add-coupon',isSupervisor, isAuth, couponController.addCoupon);
router.patch(
    '/update-value/:couponId',
    [
      body('value').notEmpty(),
    ],
    isAuth,isSupervisor, // Add the isAuth middleware here
    couponController.updateValue
  );

router.patch(
    '/update-code/:couponId',
    [
      body('code').notEmpty(),
    ],
    isAuth,isSupervisor, // Add the isAuth middleware here
    couponController.updateCode
  );

router.post(
    '/delete-coupon/:couponId',
    [
    body('couponValue').notEmpty(),
  ]
  ,isAuth,isSupervisor, couponController.deleteCoupon);
router.post('/get-coupon',isAuth,couponController.convertPointsToCoupon);
router.get('/get-allCoupons',isAuth,couponController.getUserCoupons);
module.exports = router;
