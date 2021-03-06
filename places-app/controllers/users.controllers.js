const { v4: uuidv4 }  = require('uuid')
const { validationResult } = require('express-validator')

const HttpError = require('../models/http-error');



const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
    // Build your resulting errors however you want! String, object, whatever - it works!
    // return `${location}[${param}]: ${msg}`;
    if (value == null){
        return `The '${param}' from the input data is not defined or missing.`;
    } else if (param === "password" || param === "confirmnPassword" && value.length < 7){
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


let DUMMY_USERS = [
    {
        id: "u1",
        name: "Red",
        email: "rednacky@gmail.com",
        password: "1234567"
    },
]

const getUsers = (req, res, next) => {
    res.json({users : DUMMY_USERS})
}

const signUp = (req, res, next) => {

    const errors = validationResult(req).formatWith(errorFormatter)
    const hasErrors = !errors.isEmpty()

    if (hasErrors){
        return next(new HttpError(errorArrayFormater(errors.array({ onlyFirstError: true })), 422))
    }


    const { name , email, password , confirmPassword }= req.body

    if(password != confirmPassword){
        return next(new HttpError("Passwords did not match.", 422))
    }

    const hasUser =  DUMMY_USERS.find(value => value.email === email)
    // validate if user not found
    if (hasUser){
        error  = new HttpError("Could not create user, email already used.", 422)
        return next(error)
    }

    const createdUser = {
        id : uuidv4(),
        name,
        email,
        password
    }

    DUMMY_USERS.push(createdUser)

    res.status(201).json({user: createdUser})
}

const logIn = (req, res, next) => {

    const { email, password } = req.body

    const hasUser = DUMMY_USERS.find(value => value.email === email)


    if (!hasUser ||  hasUser.password !== password){
        return next(new HttpError("Credentials given is incorrect.", 422))
    }

    res.status(200).json({message:"Successfully logged in!"})
}


exports.getUsers = getUsers;
exports.signUp = signUp;
exports.logIn = logIn;
