require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const User = require('./User'); // Import the User model
const multer = require('multer');
const path = require('path');


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

// Set up multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
  });
  
  const upload = multer({ storage: storage });

// New API endpoint to handle user registration
app.post('/register', upload.single('image'), async (req, res) => {
    try {
        const { name, number, password } = req.body;
        
        // Check if file upload failed
        if (!req.file) {
            return res.status(400).send('No file uploaded');
        }

        const image = req.file.path; // Path to the uploaded image

        if (!name || !number || !image || !password) {
            return res.status(400).send('Name, number, image, and password are required');
        }

        const newUser = new User({ name, number, image, password });
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
