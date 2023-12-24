const Job = require('../models/Job')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const getAllJobs = async (req, res) => {
  console.log(req.query);
  const {
    status,
    jobType,
    sort,
    page,
    search
  } = req.query
  const queryObject = {
    createdBy: req.user.userId,
  }

  if(search){
    queryObject.position = {$regex: search, $options: 'i'}
  }
  if(status && status !== 'all'){
    queryObject.status = status
  }
  if(jobType && jobType !== 'all'){
    queryObject.jobType = jobType
  }
  
  let result = Job.find(queryObject)

  if(sort){
    switch (sort) {
      case 'latest':
        result = result.sort('-createdAt')
        break;
      case 'oldest':
        result = result.sort('createdAt')
      break;
      case 'a-z':
        result = result.sort('position')
      break;
      case 'z-a':
        result = result.sort('-position')
      break;
      default:
        break;
    }
  }

  const mpage = Number(page) || 1
  const limit = Number(req.query.limit) || 10
  const skip = (mpage-1)*limit

  result.skip(skip).limit(limit)

  const jobs = await result

  const totalJobs = await Job.countDocuments(queryObject)
  const numOfPages = Math.ceil(totalJobs/limit)

  res.status(StatusCodes.OK).json({ jobs, totalJobs, numOfPages })
}

const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req

  const job = await Job.findOne({
    _id: jobId,
    createdBy: userId,
  })
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`)
  }
  res.status(StatusCodes.OK).json({ job })
}

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId
  const job = await Job.create(req.body)
  res.status(StatusCodes.CREATED).json({ job })
}

const updateJob = async (req, res) => {
  const {
    body: { company, position },
    user: { userId },
    params: { id: jobId },
  } = req

  if (company === '' || position === '') {
    throw new BadRequestError('Company or Position fields cannot be empty')
  }
  const job = await Job.findByIdAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  )
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`)
  }
  res.status(StatusCodes.OK).json({ job })
}

const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req

  const job = await Job.findByIdAndRemove({
    _id: jobId,
    createdBy: userId,
  })
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`)
  }
  res.status(StatusCodes.OK).send()
}

module.exports = {
  createJob,
  deleteJob,
  getAllJobs,
  updateJob,
  getJob,
}
