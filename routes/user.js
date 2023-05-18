const express = require('express')

const router = express.Router()

const {
    signup,
    login,
    logout,
    deleteAccount
} = require('../controllers/user')

router
    .post('/signup', signup)
    .post('/login', login)
    .get('/logout', logout)
    .delete('/delete', deleteAccount)

module.exports = router;