const express = require('express')
const router = express.Router()
const auth = require('../middleware/authentication')
const testUser = require('../middleware/test-user')

const rateLimiter = require('express-rate-limit')

const apiLimiter = rateLimiter({
    windowMs: 15*60*1000,
    max: 100,
    message:{
        msg:'Too many requests from this IP, please try again after 15 minutes'
    }
})

const { register, login, updateUser } = require('../controllers/auth')
router.post('/register',apiLimiter, register)
router.post('/login',apiLimiter, login)
router.patch('/updateUser', auth, testUser, updateUser)

module.exports = router
