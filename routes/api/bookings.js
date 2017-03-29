var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

// models
var User = require('../../models/user')
var Booking = require('../../models/booking')


/**
 * @api {post} /api/bookings/ Create a new booking
 * @apiName CreateBooking
 * @apiGroup Booking
 *
 * @apiUse AuthHeader
 *
 * @apiParam {Integer} start_time The epoch timestamp (seconds) of the booking start time (midnight)
 *
 * @apiUse BookingModel
 *
 * @apiErrorExample {json} Booking-Exists:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Already booked"
 *     }
 */
router.post('/', function(req, res) {
  var startTime = req.body.start_time

  // check to see if the user has already booked this time off
  Booking.findOne({"start_time": startTime, "_user": req.user._id}, function(err, existingBooking) {
    if (err || existingBooking) { res.status(400).send({"error" : "Already booked"}); return }

    var newBooking = new Booking({
      "start_time": startTime,
      "_user": req.user
    })

    newBooking.save(function (err, results) {
      res.send(results)
    })
  })
})

/**
 * @api {get} /api/bookings/ List all bookings
 * @apiDescription Returns a list of bookings from the time given. If no 'to' is given, it defaults to 30 days
 *
 * @apiName GetBookings
 * @apiGroup Booking
 *
 * @apiUse AuthHeader
 *
 * @apiParam {Integer} from The epoch timestamp (seconds) of the earliest booking
 * @apiParam {Integer} [to="(+30 days)"] The epoch timestamp (seconds) of the latest booking
 *
 * @apiSuccessExample Success-Response:
 * [{Booking}, {Booking}, ...]
 */
router.get('/', function(req, res) {
  var from = parseInt(req.query.from, 10)
  var to = from + 2592000

  if (req.query.to) { to = parseInt(req.query.to, 10) }

  Booking.find({"start_time" : {"$gte":from, "$lte":to}}).exec(function(err, results) {
    res.send(results)
  })
})

module.exports = router
