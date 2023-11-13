const express = require("express");
const app = express();
// const bodyParser = require('body-parser');
const dbConnect = require('./db/dbConnect');
const bcrypt = require('bcrypt');
const User = require('./db/userModel');
const jwt = require('jsonwebtoken');
const auth = require('./auth');


dbConnect() // run database!

app.use(express.json())

// body parser configuration
// app.use(bodyParser.json());
//   app.use(bodyParser.urlencoded({ extended: true }));

app.use((request,response, next)=>{
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
})


//default endpoint!
app.get("/", (request, response, next) => {
  response.json({ message: "Hey! This is your server response!" });
  next();
});


//register endpoint!
app.post('/register', (request, response)=> {
  bcrypt
    .hash(request.body.password, 10)
    .then((hashPassword)=> {
      const user = new User({
        email: request.body.email,
        password: hashPassword,
      })
      user
        .save()
        .then((result)=>{
          response.status(201).send({
            message: 'User Created Successfully!!',
            result,
          });
        })
        .catch((error)=> {
          response.status(500).send({
            message: 'Errod Creating User!',
            error,
          })
        })
    })
    .catch((err)=>{
      response.status(500).send({
        message: 'Password was not hashed successfully!',
        err,
      })
    })
})

//login endpoint!
app.post('/login', (request, response)=> {
  User.findOne({ email: request.body.email })
  .then( (user) =>{
    bcrypt.compare(request.body.password, user.password)
    .then((passwordCheck)=> {
      if(!passwordCheck){
        return response.status(400).send({
          message: 'Password does not match',
          error,
        })
      }

      const token = jwt.sign({
        userId: user._id,
        userEmail: user.email
      }, 
      'RANDOM-TOKEN',
      {
        expiresIn: '12h'
      });

      response.status(200).send({
        message: 'Login Successful!',
        email: user.email,
        token,
      });
    })
    .catch((err)=>{
      response.status(400).send({
        message: 'Password does not match!',
        err,
      });
    });
  })
  .catch((err)=> {
    response.status(404).send({
      message: 'Email not found!',
      err
    });
  });
})


app.get("/free-endpoint", (request, response) => {
  response.json({ message: "You are free to access me anytime" });
});

// authentication endpoint
app.get("/auth-endpoint", auth, (request, response) => {
  response.json({ message: "You are authorized to access me" });
});


module.exports = app;
