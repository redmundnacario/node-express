const express = require('express');
const bodyParser = require('body-parser');
const configEnv = require('dotenv').config();
const mongoose = require('mongoose')

const placesRoutes = require('./routes/places.routes');
const usersRoutes = require('./routes/users.routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

app.use('/api/users', usersRoutes);

app.use('/api/places', placesRoutes);

app.use((req, res, next)=>{
    const error = new HttpError("404 Not found!","404")
    return next(error)
})

app.use((error, req, res, next) => {
    if (res.headerSent){
        return next(error)
    }
    console.log("Error : ", req.method, req.originalUrl , error.code, error.message)
    res.status(error.code || 500)
    res.json({ message: error.message || "Unknown error occured!"});
})

mongoose
    .connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_KEY}@cluster0.dl8sn.mongodb.net/${process.env.MONGODB_NAME}?retryWrites=true&w=majority`)
    .then(() => {
        app.listen(5000)
    })
    .catch(error => {
        console.log(error)
    })