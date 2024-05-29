require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const User = require('./User'); // Import the User model


const app = express();
const PORT = process.env.PORT || 8000;

// Middleware to parse JSON requests
app.use(express.json());

console.log('check1');

mongoose.set('strictQuery', false);
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
}

// Print Hello world
app.get('/', (req, res) => {
    res.send('Hello, world!');
});

// New API endpoint to handle user registration
app.post('/register', async (req, res) => {
    try {
        const { name, password } = req.body;
        if (!name || !password) {
            return res.status(400).send('Name and password are required');
        }

       // const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, password });
        await newUser.save();

        res.status(200).send('User registered successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

// New API endpoint to get the names of all users
app.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, 'name'); // Fetch only the 'name' field
        const userNames = users.map(user => user.name);
        res.status(200).json(userNames);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
