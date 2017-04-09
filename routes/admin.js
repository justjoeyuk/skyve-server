var express = require('express');
var path    = require("path");
var router = express.Router();

// import models
var User = require('../models/user')


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
  res.render('admin/admin-home', getPageParameters({}, req, 0));
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