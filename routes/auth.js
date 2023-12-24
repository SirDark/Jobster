const express = require('express')
const router = express.Router()
const auth = require('../middleware/authentication')
const { register, login, updateUser } = require('../controllers/auth')
router.post('/register', register)
router.post('/login', login)
router.patch('/updateUser', auth, updateUser)

module.exports = router
