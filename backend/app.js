const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const urlRoutes = require('./routes/url.js');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api', urlRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/urlshortener');

// URL Schema




// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = { app};