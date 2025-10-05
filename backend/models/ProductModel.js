const { Schema, model } = require('../connection');

const mySchema = new Schema({
    productName: {type : String, required : true},
    brand : {type:String, required : true },
    price : {type: Number, required : true},
    status : {type: String, required : true}
});

module.exports = model('Product', mySchema);