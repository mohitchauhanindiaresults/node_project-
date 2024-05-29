const mongoose = require("mongoose");

// Define a schema for the user
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
});

// Create a model for the user
const User = mongoose.model('User', userSchema);

module.exports = User;
