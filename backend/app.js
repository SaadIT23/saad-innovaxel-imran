const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const urlRoutes = require('./routes/url.js');

const app = express();

// Middleware
app.use('/api', urlRoutes);
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/urlshortener', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// URL Schema
const urlSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^https?:\/\/.+\..+/.test(v);
            },
            message: 'Please enter a valid URL'
        }
    },
    shortCode: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    accessCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Url = mongoose.model('Url', urlSchema);



// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = { app, Url };