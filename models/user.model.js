const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { PasswordManager } = require('../services/passwordManager.service');

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,

    },
    loginPoints: {
        type:Number,
        default: 0
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true
    },
    date: {
        type: Schema.Types.Date,
        required: true,
        get: function (date) {
            return date.toLocaleDateString('en-US', { day: 'numeric', month: 'numeric', year: 'numeric' });
        }
    },
    image: {
        type: String
        // public_id: {
        //   type: String,
        //   default: null
        // },
        // url: {
        //     type: String,
        //     default: null
        // }
    },
    lastLogin: {
        type: Date,
        default: null,
    },
    timezone: {
        type: String,
        default: 'UTC',
      },
    isSupervisor:{
        type : Boolean,
        default: false
    }
    ,
    hasSurvey: {
        type: Boolean,
        default: false
    }
    ,
    commentNumber: {
        type:Number,
        default: 0
    },
    ratingNumber: {
        type:Number,
        default: 0
    }
    ,
    passwordResetOTP: {
        otp: {
          type: Number,
        },
        expiresAt: {
          type: Date}},
          
          coupon: [
            {
                code: {
                    type: String,
                    required: true
                },
                value: {
                    type: Number,
                    required: true
                }
            }
        ]

},

    {
        toJSON: {
            transform(doc, ret) {
                delete ret.password;
                delete ret.__v;
            }
        }, timestamps: true
    }
);
userSchema.virtual('age').get(function() {
    const today = new Date();
    const birthDate = new Date(this.date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
});
userSchema.pre('save', async function (done) {
    if (this.isModified('password')) {
        const hashedPassword = await PasswordManager.hash(this.get('password'));
        this.set('password', hashedPassword);
    }

    done();
});

module.exports = mongoose.model('User', userSchema);