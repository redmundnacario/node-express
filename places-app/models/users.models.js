const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema;

const userSchema = new Schema({
    id : {type: String, required: true},
    name : {type: String, required: true, unique: true},
    email : {type: String, required: true, minlength: 6},
    password :{type: String, required: true},
    image : {type: String, required: true},
    places : {type: String, required: true}
})

userSchema.plugin(uniqueValidator)

const User = mongoose.model("User", userSchema)

module.exports = User;