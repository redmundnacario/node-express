const { v4: uuidv4 }  = require('uuid')

const HttpError = require('../models/http-error');

let DUMMY_USERS = [
    {
        id: "u1",
        name: "Red",
        email: "rednacky@gmail.com",
        password: "1234"
    },
]

const getUsers = (req, res, next) => {
    res.json({users : DUMMY_USERS})
}

const signUp = (req, res, next) => {
    const { name , email, password }= req.body

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
