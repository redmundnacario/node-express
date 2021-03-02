const express = require('express');

const router = express.Router()


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

router.get('/:pid', (req, res, next) => {
    const placeId = req.params.pid
    const place = DUMMY_PLACES.find((value) => {
        return value.id == placeId
    })
    
    console.log("GET "+req.originalUrl)
    res.json({place})
})


router.get('/user/:uid', (req, res, next) => {
    const userId = req.params.uid
    const place = DUMMY_PLACES.find(value => {
        return value.user_id == userId
    })
    console.log("GET "+req.originalUrl)
    res.json({place})
})


module.exports = router;