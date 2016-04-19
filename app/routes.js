var express = require('express');
var router = express.Router();
var glob = require('glob');
var path = require('path');

/**
 * Main index page route
 */
router.get('/', function (req, res) {
  res.render('index');
});

/**
 * Database debug route
 */
router.get('/database', function (req, res) {
  var titles = require('../data/titles');

  res.render('titles', {
    titles: titles
  });
});

// Mount version specific routes
glob(path.join(__dirname, 'views/**/routes.js'), function(err, files) {
  if(err) {
    throw err;
  }

  files.forEach(function(file) {
    router.use('/' + path.dirname(path.relative(path.join(__dirname, 'views/'), file)), require(file));
  });
});

module.exports = router;
