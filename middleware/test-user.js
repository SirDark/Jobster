const { BadRequestError } = require('../errors')

const testUser = (req,res,next) => {
    if(req.user.testUser){
        throw new BadRequestError('not available in demo app, register/login for this')
    }
    next()
}

module.exports = testUser
