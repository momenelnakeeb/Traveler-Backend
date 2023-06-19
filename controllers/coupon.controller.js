const User = require('../models/user.model');
const Coupon = require('../models/coupon.model');
const moment = require('moment');
const { validationResult } = require('express-validator');
const { ValidationError } = require('../errors/validation.error');
const { AuthError } = require('../errors/auth.error');

exports.addCoupon = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = new ValidationError(`Validation failed - ${errors.array()}`);
        error.data = errors.array();
        throw error;
      }
      const {code,value} = req.body;
      const coupon = new Coupon({
        code:code,
        value:value
      });
  
      const result = await coupon.save();
      res.status(201).json({
        success: true,
        data: result
      });
    } catch (err) {
        next(err);
      }
    };


exports.updateValue = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new ValidationError(`Validation failed - ${errors.array()}`);
      error.data = errors.array();
      throw error;
    }
    const couponId = req.params.couponId;
    const coupon = await Coupon.findById(couponId);
    if (!coupon) {
      throw new AuthError('Coupon not found');
    }
    const { value } = req.body;

    coupon.value = value;
    const updatedCoupon = await coupon.save();

    res.status(200).json({
      success: true,
      message: 'Coupon updated!',
      data: updatedCoupon
    });
  } catch (err) {
    next(err);
  }
};
exports.updateCode = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = new ValidationError(`Validation failed - ${errors.array()}`);
        error.data = errors.array();
        throw error;
      }
      const couponId = req.params.couponId;
      const coupon = await Coupon.findById(couponId);
      if (!coupon) {
        throw new AuthError('Coupon not found');
      }
      const { code } = req.body;
  
      coupon.code = code;
      const updatedCoupon = await coupon.save();
  
      res.status(200).json({
        success: true,
        message: 'Coupon updated!',
        data: updatedCoupon
      });
    } catch (err) {
      next(err);
    }
  };

exports.deleteCoupon = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new ValidationError(`Validation failed - ${errors.array()}`);
            error.data = errors.array();
            throw error;
        }
  
        const couponId = req.params.couponId;
  
        const coupon = await Coupon.findByIdAndDelete(couponId);
        if (!coupon) {
            throw new AuthError('Coupon not found');
        }
  
        res.status(200).json({
            success: true,
            message: 'coupon deleted!',
        });
    } catch (err) {
        next(err);
    }
};

exports.convertPointsToCoupon = async (req, res, next) => {
  try {
    const user = await User.findById(req.userData.userId); 
    const couponValue = parseInt(req.body.couponValue); 

    if (!couponValue || isNaN(couponValue) || couponValue < 10) {
      throw new Error('Invalid coupon value');
    }
    if (!user) {
      throw new AuthError('User not found');
    }

    if (user.loginPoints < couponValue) {
      throw new Error('Insufficient login points');
    }

    let couponCode = null;

    const coupons = await Coupon.find({ value: couponValue });
    if (coupons.length > 0) {
      const randomIndex = Math.floor(Math.random() * coupons.length);
      couponCode = coupons[randomIndex].code;
      // You can perform additional actions with the selected coupon if needed
    }

    user.loginPoints -= couponValue;
    user.coupon.push({ code: couponCode, value: couponValue });

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Points converted to coupon successfully',
      couponCode: couponCode,
    });
  } catch (err) {
    next(err);
  }
};
exports.getUserCoupons = async (req, res, next) =>{
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new ValidationError(`Validation failed - ${errors.array()}`);
        error.data = errors.array();
        throw error;
    }
    const user = await User.findById(req.userData.userId); 
    const coupons = user.coupon;
    res.status(200).json({
      success: true,
      message: 'There are all coupons you have',
      coupons:coupons,
    });
  } catch (err) {
    next(err);
  }
};