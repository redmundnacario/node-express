const express = require('express');
const bodyParser = require('body-parser');// parser used  in parsing body in requests in express
const configEnv = require('dotenv').config();// the dotenv
const mongoose = require('mongoose'); // related to MongoDB

// import all routes
const placesRoutes = require('./routes/places.routes');
const usersRoutes = require('./routes/users.routes');
// error model
const HttpError = require('./models/http-error');
//helpers
const demoLogger = require('./helpers');



const app = express();

// parser of body if json type
app.use(bodyParser.json());

// log request url
app.use(demoLogger)


// users and places routes

app.use('/api/users', usersRoutes);

app.use('/api/places', placesRoutes);

// fall back error if no routes detected
app.use((req, res, next)=>{
    const error = new HttpError("404 Not found!","404")
    return next(error)
})

// handles error when next(error) was trigger in routes
app.use((error, req, res, next) => {
    if (res.headerSent){
        return next(error)
    }
    console.log("Error : ", req.method, req.originalUrl , error.code, error.message)
    res.status(error.code || 500)
    res.json({ message: error.message || "Unknown error occured!"});
})

// connect to mongoDB, if success, start the server
mongoose
    .connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_KEY}@cluster0.dl8sn.mongodb.net/${process.env.MONGODB_NAME}?retryWrites=true&w=majority`)
    .then(() => {
        app.listen(5005)
    })
    .catch(error => {
        console.log(error)
    })