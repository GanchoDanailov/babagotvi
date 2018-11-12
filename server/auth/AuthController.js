var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var User = require('../user/User');

function AuthSuccess(res, user){
  var token = jwt.sign({ id: user._id }, config.secret, {
    expiresIn: 86400 // expires in 24 hours
  });
  res.status(200).send({ auth: true, idToken: token, expiresIn: 86400, user })
}

router.post('/register', function(req, res) {
  User.countDocuments({email: req.body.email}, function (err, count){
    if(count>0){
        // User exists
        res.status(409).send({ errorMessage: "User email already exist" })
    }
    else{
      var hashedPassword = bcrypt.hashSync(req.body.password, 8);

      User.create({
        name : req.body.name,
        email : req.body.email,
        password : hashedPassword,
        roles: ['User']
      },
      function (err, user) {
        if (err) return res.status(500).send({errorMessage: "There was a problem registering the user." })
        // create a token
        AuthSuccess(res, user)
      });
    }
  }); 
});

router.post('/login', function(req, res) {
  User.findOne({ email: req.body.email }, function (err, user) {
    if (!user) return res.status(404).send({
       errorMessage: 'No user found.'
    });
    if (err) return res.status(500).send('Error on the server.')
    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password)
    if (!passwordIsValid) return res.status(401).send({ 
      auth: false,
      token: null,
      errorMessage: 'Wrong credentials'
    })
    // create a token
    AuthSuccess(res, user)
  });
});

router.get('/me', function(req, res) {
  var token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    
    res.status(200).send(decoded);
  });
});

module.exports = router;
