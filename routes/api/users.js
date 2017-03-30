var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs')
var jwt = require('jsonwebtoken');


// import models
var constants = require('../../models/constants')
var User = require('../../models/user')


// routes

/**
 * @api {post} /api/users/ Create a new user
 * @apiName CreateUser
 * @apiGroup User
 *
 * @apiParam {String} email User's email address
 * @apiParam {String} pwd User's password
 *
 * @apiUse UserModel
 */
router.post('/', function(req, res) {
  var email = req.body.email
  var rawPwd = req.body.pwd

  // find any existing users and return error if exists
  User.findOne({ 'email': email }, 'email', function(err, userDoc) {
    if (userDoc || err) { res.send({"error":"User exists."}); return }

    // create a new user and bcrypt the passsword
    var pwdHash = bcrypt.hashSync(rawPwd);
    var user = new User({ email: email, pwd: pwdHash })

    // save the user and then fetch it (so we don't return hashed password)
    user.save(function (err, results) {
      User.findOne(results._id, function(err, newUserDoc) {
        res.send(newUserDoc || err)
      })
    });
  })
})


/**
 * @api {post} /api/users/login Authenticate a User
 * @apiName AutenticateUser
 * @apiGroup User
 *
 * @apiParam {String} email User's email address
 * @apiParam {String} pwd User's password
 *
 * @apiUse UserModel
 */
router.post("/login", function(req, res) {
  var email = req.body.email
  var rawPwd = req.body.pwd

  // find the user and include the pwd field
  User.find({"email" : email}).select('+pwd -token').exec(function(err, results) {
    if (results.count == 0 || err) { res.send(err || {"error":"Incorrect Credentials"}); return }

    // compare hashes to see if pwd is correct
    var validPassword = bcrypt.compareSync(rawPwd, userDoc.pwd);
    if (!validPassword) { res.send({"error":"Incorrect Credentials"}); return }

    // the password is valid, so generate a JWT token
    var token = jwt.sign(userDoc, constants.JWT_SECRET);

    // save the token to the user and return a newly fetched document
    User.update({"_id": userDoc._id}, {"$set" : {"token": token}}, function(err, updatedDoc) {
      User.findOne(userDoc._id, function(err, newUserDoc) {
        res.send(newUserDoc)
      })
    })
  })
})

module.exports = router
