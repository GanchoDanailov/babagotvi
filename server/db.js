var mongoose = require('mongoose')
var bcrypt = require('bcryptjs')

mongoose.connect('mongodb://gogo:test1234@ds125273.mlab.com:25273/babagotvi',null ,function(error) {
  setTimeout(() => {
    if (error) console.log('error connection', error)
    console.log('DB connected')
    var User = require('./user/User')
    User.find({}).then(users => {
      if (users.length === 0) {
        var hashedPassword = bcrypt.hashSync("admin123", 8)
  
        User.create({
          name : 'ADMIN of all admins',
          email : 'admin@gmail.com',
          password : hashedPassword,
          roles: ['Admin']
        },
        function () {
          console.log('Admin account has been created')
        })
      }
    })
  }, 10000)
})