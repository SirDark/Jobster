const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const register = async (req, res) => {
  const user = await User.create({ ...req.body })
  const token = user.createJWT()
  res.status(StatusCodes.CREATED).json({ 
    user: { 
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name,
      token 
    },})
}

const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password')
  }
  const user = await User.findOne({ email })
  if (!user) {
    throw new UnauthenticatedError('Invalid Credentials')
  }
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid Credentials')
  }
  // compare password
  const token = user.createJWT()
  res.status(StatusCodes.OK).json({ 
    user: { 
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name,
      token 
    },})
}

const updateUser = async (req, res) => {
  if(req.user.testUser){
    throw new UnauthenticatedError('This is not available in Demo mode')
  }
  const {name, email, lastName, location} = req.body
  if(!name || !email || !lastName || !location){
    throw new BadRequestError('please provide all neccessary values')
  }
  const {userId, name: oname} = req.user
  const user = await User.findOne({_id: userId})
  if(!user)
    throw new UnauthenticatedError('Invalid Credentials')

  user.email = email
  user.name = name
  user.lastName = lastName
  user.location = location

  await user.save()
  const token = user.createJWT()

  res.status(StatusCodes.OK).json({ 
    user: { 
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name,
      token 
    },})
}

module.exports = {
  register,
  login,
  updateUser
}
