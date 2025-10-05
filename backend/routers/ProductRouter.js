
const express = require('express');
const Model = require('../models/ProductModel');

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
        console.log(err)
        res.status(500).json(err);
    });

});



router.get('/getByBrand/:brand',(req, res) => {
    Model.find({ Brand: req.params.brand })
    .then((result) => {
        res.status(200).json(result);
        
    }).catch((err) => {
        console.log(err)
        res.status(500).json(err);
        
        
    });
})


router.delete('/delete/:id',(req, res) => {
    Model.findByIdAndDelete(req.params.id)
    .then((result) => {
        req.status(200).json(result);
    }).catch((err) => {
        console.log(err);
        req.status(500).json(err);
    });
})




// getall
// getbyid
// delete
// update

module.exports = router;
