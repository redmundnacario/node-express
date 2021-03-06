const express = require('express');
const { check } = require('express-validator')

const placesControllers = require('../controllers/places.controllers');

const router = express.Router()


router.get('/:pid', placesControllers.getPlaceById)

router.get('/user/:uid', placesControllers.getPlacesByUserId)

// title, description, coordinates, user_id
router.post('/', 
            [
                check('title').not().isEmpty(),
                check('description').isLength({min:5}),
                check('coordinates').not().isEmpty(),
                check('user_id').not().isEmpty(),
            ],
            placesControllers.createPlace)

router.patch('/:pid',
            [
                check('title').not().isEmpty(),
                check('description').isLength({min:5})
            ],
            placesControllers.updatePlace)

router.delete('/:pid', placesControllers.deletePlace)

module.exports = router;