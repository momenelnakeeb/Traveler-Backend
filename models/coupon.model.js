const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            default: null,
          },
        value: {
            type: Number,
            default: 0,
          },
    },
    {
      toJSON: {
        transform(doc, ret) {
          delete ret.__v;
          delete ret.similarityScore;
        }
      },
      timestamps: true
    }
  );
module.exports = mongoose.model('Coupon', couponSchema);