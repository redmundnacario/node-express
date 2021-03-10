const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name : {type: String, required: true, unique: true},
    email : {type: String, required: true, minlength: 6},
    password :{type: String, required: true},
    image : {type: String, required: true},
    places : [{type: mongoose.Types.ObjectId, required: true , ref: "Place"}]
})

// use this to validate uniqueness
userSchema.plugin(uniqueValidator)

const User = mongoose.model("User", userSchema)

module.exports = User;