const express = require('express');
const Model = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');   // ✅ ADD THIS LINE
require('dotenv').config();



const router = express.Router();

router.post('/add', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 🔴 Check if user already exists
    const existingUser = await Model.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists with this email',
      });
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create new user
    const newUser = new Model({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      message: 'User registered successfully ✅',
      user: savedUser,
    });

  } catch (err) {
    console.error(err);

    // ✅ duplicate email error fallback (extra safety)
    if (err.code === 11000) {
      return res.status(400).json({
        message: 'User already registered with this email',
      });
    }

    res.status(500).json({
      message: 'Server error during signup',
    });
  }
});


router.get('/getall', (req, res) => {
    Model.find()
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });

});

router.get('/getbycity/:city', (req, res) => {
    Model.find({ city: req.params.city })
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            res.status(500).json(err);
        });
});

router.get('/getbyemail/:email', (req, res) => {
    Model.findOne({ email: req.params.email })
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            res.status(500).json(err);
        });
})

router.get('/getbyid/:id', (req, res) => {
    Model.findById(req.params.id)
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            res.status(500).json(err);
        });
})


router.delete('/delete/:id', (req, res) => {
    Model.findByIdAndDelete(req.params.id)
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);

        });
})



router.put('/update/:id', (req, res) => {
    Model.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);

        });
});

router.post('/authenticate', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Model.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: 'Authentication failed ❌ Invalid email or password',
            });
        }

        // 🔐 Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: 'Authentication failed ❌ Invalid email or password',
            });
        }

        const { _id, name } = user;

        jwt.sign(
            { _id, name },
            process.env.JWT_SECRET || 'mytopsecret',
            { expiresIn: '1h' },
            (err, token) => {
                if (err) {
                    return res.status(500).json({ error: 'Token generation failed' });
                }

                res.status(200).json({
                    message: 'Login successful ✅',
                    token,
                    user: {
                        _id,
                        name,
                        email: user.email,
                        createdAt: user.createdAt,
                    },
                });
            }
        );

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;