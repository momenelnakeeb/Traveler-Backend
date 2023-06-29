const mongoose = require('mongoose');
require('dotenv').config();
const app = require('./app');

(() => {
    try {
        mongoose.set('strictQuery', false);
        mongoose.connect(process.env.DB_URI, (err) => {
            if (err) {
                console.log(err);
            }

            app.listen(process.env.PORT || 8080, () => {
                console.log(`server is up and running on port ${process.env.PORT || 8080}`);
            });
        });
    } catch (err) {
        console.log(err);
    }
})();