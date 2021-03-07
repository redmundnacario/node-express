const mongoose = require('mongoose')

// Schema Class
const Schema = mongoose.Schema;

// Schema
const placesSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    image: {type: String, required: true},
    coordinates: {
        lat: {type: Number, required: true},
        lon: {type: Number, required: true}
    },
    user_id: {type: String, required: true}
})

// Model
const Place = mongoose.model("Place", placesSchema)

// Export Model
module.exports = Place