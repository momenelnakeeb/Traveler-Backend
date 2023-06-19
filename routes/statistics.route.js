const express = require('express');
const statisticsController = require('../controllers/statistics.controller');
const statisticsSurveyController = require('../controllers/statisticsSurvey.controller');
const router = express.Router();

// Endpoint to get user statistics
router.get('/statistics', statisticsController.getUserStatistics);
router.get('/statisticsSurvey', statisticsSurveyController.getSurveyStatistics);

module.exports = router;
