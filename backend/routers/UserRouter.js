const express = require('express');
const Model = require('../models/UserModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const router = express.Router();

router.post('/add', (req, res) => {
    console.log(req.body);

    new Model(req.body).save()
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
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

router.get('/getbyid/:id',(req, res) => {
    Model.findById(req.params.id)
    .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            res.status(500).json(err);
        });
})


router.delete('/delete/:id',(req, res) => {
    Model.findByIdAndDelete(req.params.id)
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
            
        });
})



router.put('/update/:id',(req, res) => {
    Model.findByIdAndUpdate(req.params.id, req.body,{ new:true })
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
            
        });
});

router.post('/authenticate', (req, res) => {
  const { email, password } = req.body;

  Model.findOne({ email, password })
    .then((result) => {
      if (result) {
        const { _id, name } = result;
        jwt.sign(
          { _id, name },
          process.env.JWT_SECRET || 'mytopsecret', // ✅ use env variable if available
          { expiresIn: '1h' },
          (err, token) => {
            if (err) {
              console.log(err);
              return res.status(500).json({ error: 'Token generation failed', details: err });
            }

            res.status(200).json({
              message: 'Login successful ✅',
              token,
              user: {
                _id,
                name,
                email: result.email,
                createdAt: result.createdAt
              }
            });
          }
        );
      } else {
        res.status(401).json({ message: 'Authentication failed ❌ Invalid email or password' });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: 'Server error', details: err });
    });
});

module.exports = router;