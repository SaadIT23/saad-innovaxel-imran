const express = require('express');
const { nanoid } = require('nanoid');
const Url = require('../models/Url');

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


// Retrieve original URL
router.get('/shorten/:shortCode', async (req, res) => {
    try {
        const { shortCode } = req.params;

        const url = await Url.findOne({ shortCode });

        if (!url) {
            return res.status(404).json({ error: 'Short URL not found' });
        }

        // Increment access count
        url.accessCount += 1;
        await url.save();

        res.json({
            id: url._id,
            url: url.url,
            shortCode: url.shortCode,
            createdAt: url.createdAt,
            updatedAt: url.updatedAt,
            accessCount: url.accessCount
        });
    } catch (error) {
        console.error('Error retrieving URL:', error);
        res.status(500).json({ error: 'Failed to retrieve URL' });
    }
});

// Update short URL
router.put('/shorten/:shortCode', async (req, res) => {
    try {
        const { shortCode } = req.params;
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        // Validate URL format
        if (!/^https?:\/\/.+\..+/.test(url)) {
            return res.status(400).json({ error: 'Please enter a valid URL' });
        }

        const updatedUrl = await Url.findOneAndUpdate(
            { shortCode },
            { url },
            { new: true }
        );

        if (!updatedUrl) {
            return res.status(404).json({ error: 'Short URL not found' });
        }

        res.json({
            id: updatedUrl._id,
            url: updatedUrl.url,
            shortCode: updatedUrl.shortCode,
            createdAt: updatedUrl.createdAt,
            updatedAt: updatedUrl.updatedAt,
            accessCount: updatedUrl.accessCount
        });
    } catch (error) {
        console.error('Error updating URL:', error);
        res.status(500).json({ error: 'Failed to update URL' });
    }
});

// Delete short URL
router.delete('/shorten/:shortCode', async (req, res) => {
    try {
        const { shortCode } = req.params;

        const deletedUrl = await Url.findOneAndDelete({ shortCode });

        if (!deletedUrl) {
            return res.status(404).json({ error: 'Short URL not found' });
        }

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting URL:', error);
        res.status(500).json({ error: 'Failed to delete URL' });
    }
});

// Get URL statistics
router.get('/shorten/:shortCode/stats', async (req, res) => {
    try {
        const { shortCode } = req.params;

        const url = await Url.findOne({ shortCode });

        if (!url) {
            return res.status(404).json({ error: 'Short URL not found' });
        }

        res.json({
            id: url._id,
            url: url.url,
            shortCode: url.shortCode,
            createdAt: url.createdAt,
            updatedAt: url.updatedAt,
            accessCount: url.accessCount
        });
    } catch (error) {
        console.error('Error retrieving statistics:', error);
        res.status(500).json({ error: 'Failed to retrieve statistics' });
    }
});

// Get all URLs
router.get('/urls', async (req, res) => {
    try {
        const urls = await Url.find().sort({ createdAt: -1 });
        res.json(urls);
    } catch (error) {
        console.error('Error retrieving URLs:', error);
        res.status(500).json({ error: 'Failed to retrieve URLs' });
    }
});

module.exports = router;