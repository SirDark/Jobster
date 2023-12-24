const express = require('express')
const router = express.Router()
const auth = require('../middleware/authentication')
const testUser = require('../middleware/test-user')
const { register, login, updateUser } = require('../controllers/auth')
router.post('/register', register)
router.post('/login', login)
router.patch('/updateUser', auth, testUser, updateUser)

module.exports = router
