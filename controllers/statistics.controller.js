const User = require('../models/user.model');

// Controller function to get user statistics
exports.getUserStatistics = async (req, res) => {
  try {
    // Get the total number of users
    const totalUsers = await User.countDocuments();

    // Get the count of male and female users
    const genderStatistics = await User.aggregate([
      {
        $group: {
          _id: '$gender',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get the age statistics
const ageStatistics = await User.aggregate([
    {
      $group: {
        _id: null,
        under18: { $sum: { $cond: [{ $lt: [{ $divide: [{ $subtract: [new Date(), '$date'] }, 31536000000] }, 18] }, 1, 0] } },
        '18-25': { $sum: { $cond: [{ $and: [{ $gte: [{ $divide: [{ $subtract: [new Date(), '$date'] }, 31536000000] }, 18] }, { $lt: [{ $divide: [{ $subtract: [new Date(), '$date'] }, 31536000000] }, 26] }] }, 1, 0] } },
        '26-35': { $sum: { $cond: [{ $and: [{ $gte: [{ $divide: [{ $subtract: [new Date(), '$date'] }, 31536000000] }, 26] }, { $lt: [{ $divide: [{ $subtract: [new Date(), '$date'] }, 31536000000] }, 36] }] }, 1, 0] } },
        '36-45': { $sum: { $cond: [{ $and: [{ $gte: [{ $divide: [{ $subtract: [new Date(), '$date'] }, 31536000000] }, 36] }, { $lt: [{ $divide: [{ $subtract: [new Date(), '$date'] }, 31536000000] }, 46] }] }, 1, 0] } },
        '46-55': { $sum: { $cond: [{ $and: [{ $gte: [{ $divide: [{ $subtract: [new Date(), '$date'] }, 31536000000] }, 46] }, { $lt: [{ $divide: [{ $subtract: [new Date(), '$date'] }, 31536000000] }, 56] }] }, 1, 0] } },
        over55: { $sum: { $cond: [{ $gte: [{ $divide: [{ $subtract: [new Date(), '$date'] }, 31536000000] }, 56] }, 1, 0] } }
      }
    },
    {
      $project: {
        _id: 0
      }
    }
  ]);
    const statistics = {
      totalUsers: totalUsers,
      gender: {
        male: 0,
        female: 0
      },
      age: ageStatistics[0]
    };

    for (const stat of genderStatistics) {
      if (stat._id === 'male') {
        statistics.gender.male = stat.count;
      } else if (stat._id === 'female') {
        statistics.gender.female = stat.count;
      }
    }

    res.json(statistics);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

