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
 * @apiParam {Array<Integer>} spaces The number of spaces for each day as each element
 *
 * @apiUse AllocationModel
 */
 router.post('/', function(req, res) {
   var startTime = req.body.week_start * 1000
   var spaces = req.body.spaces

   console.log("Creating Allocations For: " + startTime + ", " + spaces);

   var weekStartTime = Constants.getMonday(new Date(startTime)).getTime() / 1000

   // Create or update the week
   Week.findOne({"start_time": weekStartTime}, function(err, existingWeek) {
     if (err) {
       res.status(400).send({"error": "Couldn't fetch data"}); return;
     }

     if (!existingWeek) {
       existingWeek = new Week({"start_time" : weekStartTime})
     }

     var allocations = existingWeek.allocations ? existingWeek.allocations : []

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
         allocation.allocated_spaces = allocationSpaces
       }
     }

     existingWeek.allocations = allocations
     existingWeek.save(function(err, results) {
       if (err) {
         res.status(400).send({"error": "Couldn't fetch data"}); return;
       }

       res.status(200).send(results)
     })
   })
 })

module.exports = router
