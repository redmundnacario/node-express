const express = require('express');
const { check } = require('express-validator')

const usersControllers = require('../controllers/users.controllers');

const router = express.Router()



router.get('/', usersControllers.getUsers)

//name , email, password
router.post('/signup',
            [
                check('name').not().isEmpty(),
                check('email').normalizeEmail().isEmail(),
                check('password').isLength({min:7}),
                check('confirmPassword').isLength({min:7}),
            ],
            usersControllers.signUp)

// email, password
router.post('/login',
            usersControllers.logIn)

module.exports = router;