const express = require('express');
const NewsletterModel = require('../models/NewsletterModel');

const router = express.Router();

// Subscribe to newsletter
router.post('/subscribe', async (req, res) => {
    try {
        const { email } = req.body;

        // Basic validation
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid email address'
            });
        }

        // Check if email already exists
        const existingSubscription = await NewsletterModel.findOne({ email: email.toLowerCase() });
        
        if (existingSubscription) {
            if (existingSubscription.isActive) {
                return res.status(409).json({
                    success: false,
                    message: 'This email is already subscribed to our newsletter!'
                });
            } else {
                // Reactivate subscription
                existingSubscription.isActive = true;
                await existingSubscription.save();
                
                return res.status(200).json({
                    success: true,
                    message: 'Welcome back! Your newsletter subscription has been reactivated.'
                });
            }
        }

        // Create new subscription
        const newSubscription = new NewsletterModel({
            email: email.toLowerCase(),
            isActive: true
        });

        await newSubscription.save();

        res.status(201).json({
            success: true,
            message: 'Thank you for subscribing! You\'ll receive our latest recipe recommendations and updates.'
        });

    } catch (error) {
        console.error('Newsletter subscription error:', error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again later.'
        });
    }
});

// Get all subscribers (admin endpoint)
router.get('/subscribers', async (req, res) => {
    try {
        const subscribers = await NewsletterModel.find({ isActive: true })
            .select('email subscribedAt')
            .sort({ subscribedAt: -1 });

        res.status(200).json({
            success: true,
            count: subscribers.length,
            subscribers
        });
    } catch (error) {
        console.error('Error fetching subscribers:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch subscribers'
        });
    }
});

// Unsubscribe endpoint
router.post('/unsubscribe', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        const subscription = await NewsletterModel.findOne({ email: email.toLowerCase() });
        
        if (!subscription) {
            return res.status(404).json({
                success: false,
                message: 'Email not found in our subscription list'
            });
        }

        subscription.isActive = false;
        await subscription.save();

        res.status(200).json({
            success: true,
            message: 'You have been successfully unsubscribed from our newsletter.'
        });

    } catch (error) {
        console.error('Unsubscribe error:', error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again later.'
        });
    }
});

module.exports = router;
