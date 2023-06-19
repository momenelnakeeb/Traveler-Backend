const UserStatistics = require('../models/UserStatistics.model');
const User = require('../models/user.model');
const SurveyResponse = require('../models/survey.model');

exports.getSurveyStatistics = async (req, res) => {
  try {
    const surveyTypes = {
      entertainment: { count: 0, users: { under18: 0, '18-25': 0, '26-35': 0, '36-45': 0, '46-55': 0, over55: 0 } },
      adventure: { count: 0, users: { under18: 0, '18-25': 0, '26-35': 0, '36-45': 0, '46-55': 0, over55: 0 } },
      religious: { count: 0, users: { under18: 0, '18-25': 0, '26-35': 0, '36-45': 0, '46-55': 0, over55: 0 } },
      beach: { count: 0, users: { under18: 0, '18-25': 0, '26-35': 0, '36-45': 0, '46-55': 0, over55: 0 } },
      medical: { count: 0, users: { under18: 0, '18-25': 0, '26-35': 0, '36-45': 0, '46-55': 0, over55: 0 } }
    };

    const ageStatistics = {
      under18: 0,
      '18-25': 0,
      '26-35': 0,
      '36-45': 0,
      '46-55': 0,
      over55: 0
    };

    const surveyResponses = await SurveyResponse.find();

    for (const response of surveyResponses) {
      for (const surveyType in response.toObject()) {
        if (
          surveyType !== 'user' &&
          surveyType !== '_id' &&
          surveyType !== 'date' &&
          surveyType !== 'updatedAt' &&
          surveyType !== 'createdAt' &&
          response[surveyType]
        ) {
          surveyTypes[surveyType].count++;

          const user = await User.findById(response.user);
          const age = user.age;

          if (age < 18) {
            surveyTypes[surveyType].users.under18++;
            ageStatistics.under18++;
          } else if (age >= 18 && age <= 25) {
            surveyTypes[surveyType].users['18-25']++;
            ageStatistics['18-25']++;
          } else if (age >= 26 && age <= 35) {
            surveyTypes[surveyType].users['26-35']++;
            ageStatistics['26-35']++;
          } else if (age >= 36 && age <= 45) {
            surveyTypes[surveyType].users['36-45']++;
            ageStatistics['36-45']++;
          } else if (age >= 46 && age <= 55) {
            surveyTypes[surveyType].users['46-55']++;
            ageStatistics['46-55']++;
          } else {
            surveyTypes[surveyType].users.over55++;
            ageStatistics.over55++;
          }
        }
      }
    }

    const totalUsers = await User.countDocuments();

    const userStatistics = new UserStatistics({
      totalUsers: totalUsers,
      gender: { male: 0, female: 0 },
      age: ageStatistics
    });

    // Save user statistics to the database
    await userStatistics.save();

    return res.status(200).json({
      success: true,
      message: 'Survey statistics retrieved successfully!',
      data: {
        surveyTypes: surveyTypes,
        // ageStatistics: ageStatistics,
        // totalUsers: totalUsers
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve survey statistics.',
      error: error.message
    });
  }
};
