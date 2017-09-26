var express = require('express');
var router = express.Router();
var path = require('path');
var moment = require('moment');
var casual = require('casual');
var yaml = require('js-yaml');
var glob = require('glob');

router.use('/images', express.static(path.join(__dirname, 'images')));

var prototypeVersion = path.basename(__dirname);

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
 * Sign in / out hack
 */
router.use(function (req, res, next) {
  // In order to quickly prototype sign in, if the GET or POST data sent to the
  // server contains either do_sign_in or do_sign_out values we will act
  // accordingly and sign the user in or out. No passwords are checked, no
  // accounts exist anywhere in any databases. This is a straight up hack
  // for prototyping purposes only. Move along now.

  // Default to not being logged in
  if(typeof req.session.isLoggedIn === 'undefined') {
    req.session.isLoggedIn = false;
  }

  // If we've been asked to sign in, reflect this in the session
  if(typeof req.query.do_sign_in !== 'undefined' || typeof req.body.do_sign_in !== 'undefined') {
    req.session.isLoggedIn = true;
    return next();
  }

  // If we've been asked to sign out, destroy the session
  else if(typeof req.query.do_sign_out !== 'undefined' || typeof req.body.do_sign_out !== 'undefined') {
    req.session.destroy(function(err) {
      next();
    });
  }

  else {
    next();
  }

});

/**
 * Sign in route
 */
router.get('/sign_in', function(req, res) {
  req.session.isLoggedIn = false;

  req.session.destroy(function() {
    res.render(path.join(__dirname, 'sign_in'));
  })
});

/**
 * Sign out route
 */
router.get('/sign_out', function(req, res) {
  req.session.isLoggedIn = false;

  req.session.destroy(function() {
    return res.render(path.join(__dirname, 'signed_out'));
  })
});

router.get('/', function(req, res) {
  res.render(path.join(__dirname, 'start'));
});

/**
 * Basic routes for templates
 */
glob(path.join(__dirname, '*.html'), function(err, files) {
  files.forEach(function(file) {
    router.get('/' + path.basename(file, '.html'), function(req, res) {
      res.render(prototypeVersion + '/' + path.basename(file, '.html'));
    })
  });
});

/**
 * Landing page form
 */
router.post('/landing_page', function (req, res) {

  // Route people to the appropriate places dependant on what they chose
  switch(req.body.information) {
    case 'title_summary':
      return res.redirect('search');

      break;

    case 'full_title_documents':
      return res.redirect('https://eservices.landregistry.gov.uk/wps/portal/Property_Search');

      break;

    case 'official_copy':
      return res.redirect('https://www.gov.uk/government/publications/official-copies-of-register-or-plan-registration-oc1');

      break;
  }

  // Otherwise just render the form again
  // Equivalent to the form failing validation, except we don't have any server side in the proto
  res.render(path.join(__dirname, 'landing_page'));

});


/**
 * Search results
 */
router.get('/search_results', function (req, res) {
  var rpp = 20;

  // Equivalent to the form failing validation, except we don't have any server side in the proto
  if(!req.query.search_term) {
    res.render(path.join(__dirname, 'search'));
    return;
  }

  var data = {
    display_page_number: req.query.page ? req.query.page : 1,
    search_term: req.query.search_term,
    results: {
    }
  };

  require('./data')(req.query.search_term, function(titles) {
    data.results.titles = titles;

    // Total result count
    data.results.number_results = data.results.titles.length;
    data.results.number_pages = Math.ceil(data.results.number_results / rpp);

    // Restrict results to this page
    data.results.titles = data.results.titles.slice((data.display_page_number - 1) * rpp, data.display_page_number * rpp);

    return res.render(path.join(__dirname, 'search_results'), data);

  });

});

/**
 * Display title route
 */
router.get('/display_title', function (req, res) {

  if(typeof req.query.title_number === 'undefined') {
    return res.sendStatus(404);
  }

  // VAT receipt data
  var receipt = {
    date: moment().format('D MMM YYYY'),
    trans_id: casual.integer(4000000000, 5000000000),
    title_number: req.query.title_number,
    net: '2.50',
    vat: '0.50',
    total: '3.00',
    address1: 'HM Land Registry',
    address2: 'Trafalgar house',
    address3: '1 Bedford Park',
    address4: 'Croydon',
    postcode: 'CR0 2AQ',
    reg_number: 'GB 8888 181 53'
  }

  res.render(path.join(__dirname, 'display_title'), {
    receipt: receipt
  });

});

/**
 * Account creation forms
 */
router.all('/create_account:variant?', function(req, res) {
  var variant = '';
  if(typeof req.params.variant !== 'undefined') {
    variant = req.params.variant;
  }

  res.render(path.join(__dirname, 'create_account' + variant), {
    countries: countries
  });
});

/**
 * Password reset forms
 */
router.all('/reset/:item/:section', function(req, res) {

  res.render(path.join(__dirname, 'reset_' + req.params.section), {
    item: req.params.item,
  });

});

/**
 * Send summary and vat recepits
 */
router.all('/send/:item/:section', function(req, res) {

  // VAT receipt data
  var receipt = {
    date: moment().format('D MMM YYYY'),
    title_number: req.query.title_number,
    net: '2.50',
    vat: '0.50',
    total: '3.00',
    address1: 'HM Land Registry',
    address2: 'Trafalgar house',
    address3: '1 Bedford Park',
    address4: 'Croydon',
    postcode: 'CR0 2AQ',
    reg_number: 'GB 8888 181 53'
  }

  res.render(path.join(__dirname, 'send_' + req.params.section), {
    item: req.params.item,
    receipt: receipt
  });

});

module.exports = router;

