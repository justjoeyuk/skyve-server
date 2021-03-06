var express = require('express');
var path    = require("path");
var moment = require('moment');
var router = express.Router();

// import models
var User = require('../models/user');
var Week = require('../models/week');
var Constants = require('../models/constants');


function getButtons(index) {
  var buttons = [
    {title: "DASHBOARD", route: "/admin/"},
    {title: "WORKSHEET", route: "/admin/worksheet"},
    {title: "WAVE DOC", route: "/admin/wavedoc"},
    {title: "ROUTE SHEET", route: "/admin/routesheet"},
    {title: "WORKERS", route: "/admin/workers"},
  ]
  buttons[index].current = true
  return buttons
}

function getPageParameters(currentParams, req, pageIndex) {
  currentParams.user = req.user
  currentParams.buttons = getButtons(pageIndex)
  return currentParams
}


/* GET home page. */
router.get('/', function(req, res, next) {
  var mondayStartTime = Constants.getMonday(new Date()) / 1000;
  var formattedMonday = moment(mondayStartTime * 1000).format('DD/MM/YYYY');

  console.log(mondayStartTime)

  Week.findOne({"start_time":mondayStartTime})
  .populate({path: "allocations", populate: { path: "bookings", model: "Booking", populate: { path: "_user", model: "User", select: "-token" }}})
  .exec(function(err, existingWeek) {
    res.render('admin/admin-home', getPageParameters({
      weekStart: mondayStartTime,
      week: existingWeek,
      formattedWeekStart: formattedMonday
    }, req, 0));
  })
});


/** GET workers page */
router.get('/workers', function(req, res, next) {
  User.find({"manager": req.user._id}).exec(function(err, results) {
    if (err != null) { next(err) }
    else {
      var workers = {"workers" : results}
      res.render('admin/admin-workers', getPageParameters(workers, req, 4));
    }
  })
})

module.exports = router;
