const User = require('../models/user')
const Task = require('../models/task')

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((u) => u.toJSON())
}

const tasksInDb = async () => {
  const tasks = await Task.find({})
  return tasks.map((t) => t.toJSON())
}

module.exports = {
  usersInDb,
  tasksInDb,
}
