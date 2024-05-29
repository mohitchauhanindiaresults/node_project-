require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 8000;
console.log('check1');


mongoose.set('strictQuery', false);
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log('Mongo db connected : $ {conn.connection}');
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
}

app.get('/', (req, res) => {
    res.send('Hello, worldd!');
});


connectDB().then(()=>{
    app.listen(PORT,() => console.log('local server started'));
});


// app.listen(PORT,() => console.log('local server started'));
