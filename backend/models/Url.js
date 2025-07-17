const mongoose = require('mongoose');

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

module.exports = mongoose.model('Url', urlSchema);
