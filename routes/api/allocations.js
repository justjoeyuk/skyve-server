var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

// models
var Constants = require('../../models/constants')
var Allocation = require('../../models/allocation')
var Week = require('../../models/week')


/**
 * @api {post} /api/allocations/ Create a new week with allocations
 * @apiName CreateAllocations
 * @apiGroup Allocations
 *
 * @apiUse AuthHeader
 *
 * @apiParam {Integer} week_start Any epoch timestamp (seconds) within the week
 * @apiParam {Array} spaces The number of spaces for each day as each element
 *
 * @apiUse AllocationModel
 */
 router.post('/', function(req, res) {
   var startTime = req.body.start_time * 1000
   var spaces = req.body.spaces

   console.log("Creating Allocations For: " + startTime + ", " + spaces);
   var weekStartTime = Constants.getMonday(new Date(startTime))

   // Create or update the week
   Week.findOne({"start_time": weekStartTime}).populate('allocations').exec(function(err, existingWeek) {
     if (err) {
       res.status(400).send({"error": "Couldn't fetch data"}); return;
     }

     if (!existingWeek) {
       existingWeek = new Week({"start_time" : weekStartTime})
     }

     var allocations = existingWeek.allocations ? existingWeek.allocations : []
     var savedAllocations = 0

     for (var i = 0, len = spaces.length; i < len; i++) {
       var allocation;
       var allocationSpaces = spaces[i];

       if (allocations.length == 0) {
         allocation = new Allocation({
           "day": i,
           "allocated_spaces": allocationSpaces,
           "booked_spaces": 0 })
       } else {
         allocation = allocations[i]
         allocations[i] = allocation._id
         allocation.allocated_spaces = allocationSpaces
       }

       allocation.save(function(err, results) {
         if (err) { res.status(400).send(err); return }

         allocations[savedAllocations] = results["_id"]
         savedAllocations += 1

         if (savedAllocations == spaces.length) {

           existingWeek.allocations = allocations
           existingWeek.save(function(err, results) {
             if (err) {
               res.status(400).send({"error": "Couldn't fetch data"}); return;
             }

             res.status(200).send(results)
           })
         }
       })
     }
   })
 })

 /**
  * @api {get} /api/allocations/ Gets all allocations for a given week
  * @apiName GetAllocations
  * @apiGroup Allocations
  *
  * @apiUse AuthHeader
  *
  * @apiParam {Integer} start_time Any epoch timestamp (seconds) within the week
  *
  * @apiUse WeekModel
  */
 router.get('/', function(req, res) {
   var startTime = parseInt(req.query.start_time, 10) * 1000
   var weekStartTime = Constants.getMonday(new Date(startTime))

   console.log("Geting allocations for Week starting " + weekStartTime)
   Week.findOne({"start_time":weekStartTime}).populate({
     path: "allocations",
     populate: {
       path: "bookings",
       model: "Booking",
       populate: {
         path: "_user",
         model: "User"
       }
     }
   }).exec(function(err, existingWeek) {
     if (err) { res.status(500).send(err); return }
     res.status(200).send(existingWeek)
   })
 })

module.exports = router
