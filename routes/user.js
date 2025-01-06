const express = require('express')

const router = express.Router()

const {
    protect
} = require('../controllers/middleware')

const {
    signup,
    login,
    logout,
    deleteAccount
} = require('../controllers/user')

router
    
    .post('/signup', signup)
    .post('/login', login)
    // These routes are protected by the middleware function
    .get('/logout', protect, logout)
    .delete('/delete', protect, deleteAccount)

module.exports = router;