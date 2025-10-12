const { Schema, model } = require('../connection');

const mySchema = new Schema({
    name: String,
    email: { type: String, unique: true, required: true, },
    password: { type: String, required: true },
    city: { type: String, required:true, default: 'Unknown' }
}, {
    timestamps: true // This will automatically add createdAt and updatedAt fields
});

module.exports = model('User', mySchema);



