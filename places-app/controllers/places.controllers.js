const { v4: uuidv4 }  = require('uuid')

const HttpError = require('../models/http-error');

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

const getPlaceById = (req, res, next) => {
    const placeId = req.params.pid
    const place = DUMMY_PLACES.find((value) => {
        return value.id == placeId
    })

    if (!place){
        return next(new HttpError("Place not found!", 404))
    }
    
    console.log("GET "+req.originalUrl)
    res.status(200).json({place})
}

const getPlacesByUserId = (req, res, next) => {
    const userId = req.params.uid
    const places = DUMMY_PLACES.filter(value => {
        return value.user_id == userId
    })

    if (!places || places.length === 0 ){
        return next(new HttpError("User's place not found!", 404))
    }
    console.log("GET "+req.originalUrl)
    res.status(200).json({places})
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

const updatePlace = (req, res, next) => {
    const { title, description } = req.body
    const placeId = req.params.pid

    const updatedPlace = DUMMY_PLACES.find(value => value.id == placeId)
    // const placeIndex = DUMMY_PLACES.findIndex(value => value.id == placeId)

    updatedPlace.title = title
    updatedPlace.description = description

    res.status(200).json({place:updatedPlace})
}

const deletePlace = (req, res, next) => {
    const placeId = req.params.pid
    console.log(placeId)
    DUMMY_PLACES = DUMMY_PLACES.filter(value => value.id != placeId)

    console.log(DUMMY_PLACES)
    res.status(200).json({message: "Place deleted."})
}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
