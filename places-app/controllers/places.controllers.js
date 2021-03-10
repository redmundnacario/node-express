const { v4: uuidv4 }  = require('uuid');// id generator
const { validationResult } = require('express-validator');// validator in express
const mongoose = require('mongoose');

// place model
const Place = require('../models/places.models');
const User = require('../models/users.models');
//error model
const HttpError = require('../models/http-error');


const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
    // Build your resulting errors however you want! String, object, whatever - it works!
    // return `${location}[${param}]: ${msg}`;
    if (value == null){
        return `The '${param}' from the input data is not defined or missing.`;
    } else if (param === "description" && value.length < 5){
        return `The length of '${param}' should be greater than 4 characters.`;
    } else {
        return `Error in '${param}': ${msg} ${value} `;
    }
};


// GET
const getPlaceById = async(req, res, next) => {
    const placeId = req.params.pid
    let place

    // findById Get places by given id
    try{
        place = await Place.findById(placeId)
    } catch(err) {
        console.log(err)
        return next(new HttpError("Something went wrong in accessing the places. Try again.", 500))
    }


    if (!place){
        return next(new HttpError("Place not found!", 404))
    }
    
    res.status(200).json({place: place.toObject({getters: true})})
}

// GET
const getPlacesByUserId = async(req, res, next) => {
    const userId = req.params.uid
    let userWithPlaces

    // find -> find place not by default id but other query
    try {
        userWithPlaces = await Place.find({user_id : userId}).populate('places');
    } catch(err) {
        return next(new HttpError('Something went wrong in accessing the places. Try again', 500))
    }

    if (!userWithPlaces || userWithPlaces.length === 0 ){
        return next(new HttpError("User's place not found!", 404))
    }
    res.status(200).json({places: userWithPlaces.map(place => place.toObject({getters: true}))})
}

// POST
const createPlace = async(req, res, next) => {
    const errors = validationResult(req).formatWith(errorFormatter)
    const hasErrors = !errors.isEmpty()

    if (hasErrors){
        return next(new HttpError(errors.array(), 422))
    }

    const { title, description, image, coordinates, user_id } = req.body;

    const createdPlace = new Place({
        title,
        description,
        image,
        coordinates,
        user_id
    })

    let user;
    try{
        user = await User.findById(user_id)
    }catch (error) {
        console.log(error)
        return next(new HttpError("Something went wrong in finding user. Try again", 500))
    }
    // console.log("user",user)
    if (!user){
        return next(new HttpError("User does not exist",404))
    }

    // when updating two tables/document, needs session
    // advantage is to rollback if place creation failed or user update failed
    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();

        await createdPlace.save({session: sess})
        user.places.push(createdPlace)
        await user.save({session: sess})

        await sess.commitTransaction();
    } catch(err){
        console.log(err)
        return next( new HttpError("Creating place failed. Try again.", 500))
    }


    res.status(201).json({place : createdPlace.toObject({getters:true})});
}

// PATCH
const updatePlace = async(req, res, next) => {
    const errors = validationResult(req).formatWith(errorFormatter)
    const hasErrors = !errors.isEmpty()

    if (hasErrors){
        return next(new HttpError(errors.array(), 422))
    }
    
    const { title, description } = req.body
    const placeId = req.params.pid

    try{
        place = await Place.findById(placeId)
    } catch(err) {
        console.log(err)
        return next(new HttpError("Something went wrong in accessing the places. Try again.", 500))
    }

    place.title = title
    place.description = description

    // save edited data in db
    try{
        await place.save()
    } catch(err){
        console.log(err)
        return next( new HttpError("Updating place failed. Try again.", 500))
    }

    res.status(200).json({place:place.toObject({getters: true})})
}

// DELETE
const deletePlace = async(req, res, next) => {
    const placeId = req.params.pid
    // console.log(placeId)
    //Get place
    try{
        place = await Place.findById(placeId).populate('user_id')
    } catch(err) {
        console.log(err)
        return next(new HttpError("Something went wrong in accessing the places. Try again.", 500))
    }
    // Delete data from db
    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();

        await place.remove({session: sess})
        place.user_id.places.pull(place)
        await place.user_id.save({session: sess});

        await sess.commitTransaction();
    } catch(err){
        return next( new HttpError("Deleting place failed. Try again.", 500))
    }


    // console.log(DUMMY_PLACES)
    res.status(200).json({message: "Place deleted."})
}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
