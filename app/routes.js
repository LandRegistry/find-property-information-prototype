var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  console.log('here');
  res.render('index');
});

module.exports = router;
