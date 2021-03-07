const { v4: uuidv4 }  = require('uuid');// id generator
const { validationResult } = require('express-validator');// validator in express

// place model
const Place = require('../models/places.models');

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


let DUMMY_PLACES = [
    {
        id: 1,
        title: "Mandaluyong City",
        description: "tiger city",
        coordinates: {
            lat: 14.5794,
            lon: 121.0359
        },
        user_id: "u1"
    },
    {
        id: 2,
        title: "Pasig City",
        description: "Mayor Vico's city",
        coordinates: {
            lat: 14.5764,
            lon: 121.0851
        },
        user_id: "u2"
    },
    {
        id: 3,
        title: "Naga City",
        description: "Ang maogmang lugar",
        coordinates: {
            lat: 13.6218,
            lon: 123.1948
        },
        user_id: "u1"
    }
]

// GET
const getPlaceById = async(req, res, next) => {
    const placeId = req.params.pid
    let place

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
    let places

    try {
        places = await Place.find({user_id : userId})
    } catch(err) {
        return next(new HttpError('Something went wrong in accessing the places. Try again', 500))
    }

    if (!places || places.length === 0 ){
        return next(new HttpError("User's place not found!", 404))
    }
    res.status(200).json({places: places.map(place => place.toObject({getters: true}))})
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

    try{
        await createdPlace.save()
    } catch(err){
        return next( new HttpError("Creating place failed. Try again.", 500))
    }

    res.status(201).json({place : createdPlace});
}

// PATCH
const updatePlace = (req, res, next) => {
    const errors = validationResult(req).formatWith(errorFormatter)
    const hasErrors = !errors.isEmpty()

    if (hasErrors){
        return next(new HttpError(errors.array(), 422))
    }
    
    const { title, description } = req.body
    const placeId = req.params.pid

    const updatedPlace = DUMMY_PLACES.find(value => value.id == placeId)
    // const placeIndex = DUMMY_PLACES.findIndex(value => value.id == placeId)

    updatedPlace.title = title
    updatedPlace.description = description

    res.status(200).json({place:updatedPlace})
}

// DELETE
const deletePlace = (req, res, next) => {
    const placeId = req.params.pid
    // console.log(placeId)
    DUMMY_PLACES = DUMMY_PLACES.filter(value => value.id != placeId)

    // console.log(DUMMY_PLACES)
    res.status(200).json({message: "Place deleted."})
}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
