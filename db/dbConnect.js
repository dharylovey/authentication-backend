const mongoose = require('mongoose');
require('dotenv').config();

async function dbConnect(){
    mongoose.connect(process.env.DB_URL)
    .then(()=> console.log('Successfully Connected to Database!!'))
    .catch((err)=> {
        console.log('Unable to connect to database!');
        console.error(err);
    })
}

module.exports = dbConnect;