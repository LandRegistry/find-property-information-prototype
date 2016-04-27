var express = require('express');
var router = express.Router();
var path = require('path');
var moment = require('moment');
var casual = require('casual');
var yaml = require('js-yaml');


var countries = require('./country-records.json');
countries = countries.sort(function(a, b) {
  if(a.entry.name < b.entry.name) {
    return -1;
  }

  if(a.entry.name > b.entry.name) {
    return 1;
  }

  return 0;
});

/**
 * Expose variables to all routes
 */
router.use(function (req, res, next) {
  res.locals.price_text = '£3 inc VAT'
  next();
});

router.all('/create_account:variant', function(req, res) {

  res.render(path.join(__dirname, 'create_account' + req.params.variant), {
    countries: countries
  });
})

module.exports = router;
