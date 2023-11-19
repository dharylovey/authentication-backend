const mongoose = require('mongoose');
require('dotenv').config();

async function dbConnect(){
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log('Successfully Connected to Database!')
    } catch (error) {
        console.log('Unable to connect to database!', error)
    } 
}

module.exports = dbConnect;