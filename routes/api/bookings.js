var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

// models
var User = require('../../models/user')
var Booking = require('../../models/booking')
var Allocation = require('../../models/allocation')


/**
 * @api {post} /api/bookings/ Create a new booking
 * @apiName CreateBooking
 * @apiGroup Booking
 *
 * @apiUse AuthHeader
 *
 * @apiParam {String} allocation_id The ID of the allocation which to book
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
  var allocationID = req.body.allocation_id

  Allocation.findOne({"_id":allocationID}, function(err, allocation) {
    if (err || !allocation) { res.status(400).send({"error" : "No such allocation"}); return }

    Booking.findOne({"allocation_id": allocationID, "_user": req.user._id}, function(err, existingBooking) {
      if (err || existingBooking) { res.status(400).send({"error" : "Already booked"}); return }

      var newBooking = new Booking({
        "allocation_id": allocationID,
        "_user": req.user
      })

      newBooking.save(function (err, results) {
        if (err) { res.status(400).send({"error" : "Could not save booking"}); return }
        allocation.bookings.push(newBooking)

        allocation.save(function(err, results) {
          if (err) { res.status(400).send({"error" : "Could not update allocation"}); return }
          res.send(newBooking)
        })
      })
    })
  })
  // check to see if the user has already booked this time off

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
