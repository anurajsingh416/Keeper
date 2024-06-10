const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.URI)
.then(() => {
    console.log('MongoDB connection established successfully');
})
.catch((err) => {
    console.error('MongoDB connection error:', err);
});

module.exports = mongoose;
