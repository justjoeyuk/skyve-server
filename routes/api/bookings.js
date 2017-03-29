var express = require('express');
var router = express.Router();


/**
 * @api {post} /bookings/ Create a new booking
 * @apiName CreateBooking
 * @apiGroup Booking
 *
 * @apiUse AuthHeader
 *
 * @apiParam {Integer} start_time The unix timestamp (millis) of the booking start
 * @apiParam {Integer} length The length of time (minutes) of the booking
 */
router.post('/', function(req, res) {
  var startTime = req.body.start_time
  var length = req.body.length

  res.send({"TODO" : {
    "user" : req.user,
    "start_time" : startTime,
    "length" : length
  }})
})


module.exports = router
