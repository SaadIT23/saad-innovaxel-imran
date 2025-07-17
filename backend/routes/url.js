const express = require('express');
const { nanoid } = require('nanoid');
const { Url } = require('../app');

const router = express.Router();

// Create short URL
router.post('/shorten', async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        // Validate URL format
        if (!/^https?:\/\/.+\..+/.test(url)) {
            return res.status(400).json({ error: 'Please enter a valid URL' });
        }

        // Generate unique short code
        let shortCode;
        let isUnique = false;

        while (!isUnique) {
            shortCode = nanoid(6);
            const existingUrl = await Url.findOne({ shortCode });
            if (!existingUrl) {
                isUnique = true;
            }
        }

        const newUrl = new Url({
            url,
            shortCode,
            accessCount: 0
        });

        await newUrl.save();

        res.status(201).json({
            id: newUrl._id,
            url: newUrl.url,
            shortCode: newUrl.shortCode,
            createdAt: newUrl.createdAt,
            updatedAt: newUrl.updatedAt,
            accessCount: newUrl.accessCount
        });
    } catch (error) {
        console.error('Error creating short URL:', error);
        res.status(500).json({ error: 'Failed to create short URL' });
    }
});