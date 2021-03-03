const { v4: uuidv4 }  = require('uuid')

const HttpError = require('../models/http-error');

const DUMMY_PLACES = [
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
    }
]

const getPlacesById = (req, res, next) => {
    const placeId = req.params.pid
    const place = DUMMY_PLACES.find((value) => {
        return value.id == placeId
    })

    if (!place){
        return next(new HttpError("Place not found!", 404))
    }
    
    console.log("GET "+req.originalUrl)
    res.json({place})
}

const getPlacesByUserId = (req, res, next) => {
    const userId = req.params.uid
    const place = DUMMY_PLACES.find(value => {
        return value.user_id == userId
    })

    if (!place){
        return next(new HttpError("User's place not found!", 404))
    }
    console.log("GET "+req.originalUrl)
    res.json({place})
}

const createPlace = (req, res, next) => {
    const { title, description, coordinates, user_id } = req.body;
    console.log(req.body)
    const createdPlace = {
        id : uuidv4(),
        title,
        description,
        coordinates,
        user_id
    }

    DUMMY_PLACES.push(createdPlace)

    res.status(201).json({place : createdPlace});
}

exports.getPlacesById = getPlacesById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
