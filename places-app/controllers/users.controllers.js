const { v4: uuidv4 }  = require('uuid')
const { validationResult } = require('express-validator')

// Models
const User = require('../models/users.models');
const HttpError = require('../models/http-error');



const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
    // Build your resulting errors however you want! String, object, whatever - it works!
    // return `${location}[${param}]: ${msg}`;
    if (value == null){
        return `The '${param}' from the input data is not defined or missing.`;
    } else if (param === "password" && value.length < 7){
        return `The length of '${param}' should be greater than 6 characters.`;
    } else {
        return `${msg} ${value}`;
    }
};

const errorArrayFormater = (errorMap) => {
    errors = ""
    for (const error of errorMap) {
        if (errors == ""){
            errors = errors + error
        } else {
            errors = errors + " " + error
        }
    }
    return errors
}





const getUsers = async(req, res, next) => {
    let users;
    // get all users, excluding the password attribute
    try {
        users = await User.find({},"-password")
    } catch(error){
        return next(new HttpError("Something went wrong in loading users. Try again.", 500))
    }


    res.json({users : users.map(user => user.toObject({getters: true}))})
}

const signUp = async(req, res, next) => {

    const errors = validationResult(req).formatWith(errorFormatter)
    const hasErrors = !errors.isEmpty()

    if (hasErrors){
        return next(new HttpError(errorArrayFormater(errors.array({ onlyFirstError: true })), 422))
    }


    const { name , email, password }= req.body

    // findOne -> find one data / locate data from db if existing
    let existingUser;
    try {
        existingUser = await User.findOne({email: email})
    } catch(error){
        console.log(error)
        return next(new HttpError("Something went wrong. Try again.", 500))
    }
    // validate if user not found
    if (existingUser){
        return next( new HttpError('User exists already, please login instead.', 422))
    }

    const newUser = new User({
        name,
        email,
        password,
        image : "https://via.placeholder.com/150",
        places :[]
    })

    try {
        await newUser.save()
    }catch(error){
        console.log(error)
        return next(new HttpError("Something went wrong in creating user. Try again.", 500))
    }

    res.status(201).json({user: newUser.toObject({getters:true})})
}

const logIn = async(req, res, next) => {

    const { email, password } = req.body

    let existingUser;
    try {
        existingUser = await User.findOne({email: email})
    } catch(error){
        console.log(error)
        return next(new HttpError("Something went wrong. Try again.", 500))
    }

    if (!existingUser ||  existingUser.password !== password){
        return next(new HttpError("Credentials given is incorrect.", 401))
    }

    res.status(200).json({message:"Successfully logged in!"})
}


exports.getUsers = getUsers;
exports.signUp = signUp;
exports.logIn = logIn;
