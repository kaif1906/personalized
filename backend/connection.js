const mongoose = require ('mongoose');
const url = 'mongodb+srv://dbUser1:kaif12345@cluster0.ws1cheh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

mongoose.connect(url)
    .then((result) => {
        console.log('database connected');
    })
    .catch((err) => {
        console.log(err);
    });

module.exports = mongoose;