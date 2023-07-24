const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

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
const SupervisorPlaces = require('./routes/supervisorPlaces.route');


const app = express();
app.use(cors());
app.use(bodyParser.json());
// registerd routes
app.use('/auth', authRoutes);
app.use('/supervisor',placeRoutes);
app.use('/admin', commentRoutes);
app.use('/admin', ratingRoutes);
app.use('/coupon',couponRoutes);
app.use('/statistics', statisticsRoutes);
app.use('/SupervisorPlaces', SupervisorPlaces);


  
app.use(upload);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
  res.send('hello from the app');
});

app.all('*', routeCatcher);
app.use(errorHandler);

module.exports = app;