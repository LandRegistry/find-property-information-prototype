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
  res.locals.price_text = '£3 inc VAT';

  if(typeof req.query.account_creation_variant !== 'undefined') {
    res.locals.account_creation_variant = req.query.account_creation_variant
  }

  if(typeof req.body.account_creation_variant !== 'undefined') {
    res.locals.account_creation_variant = req.body.account_creation_variant
  }

  next();
});

/**
 * Landing page form
 * GET route is handled by the default set of routes. This is here to handle POSTs
 */
router.post('/landing_page', function (req, res) {
  // Route people to the appropriate places dependant on what they chose
  switch(req.body.information) {
    case 'title_summary':
      return res.redirect('search?account_creation_variant=' + (res.locals.account_creation_variant ? res.locals.account_creation_variant : ''));

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
  }

  var data = {
    display_page_number: req.query.page ? req.query.page : 1,
    search_term: req.query.search_term,
    results: {
    }
  };

  require('./data')(req.query.search_term, function(titles) {
    data.results.titles = titles;

    data.account_creation_variant = res.locals.account_creation_variant;

    // Total result count
    data.results.number_results = data.results.titles.length;
    data.results.number_pages = Math.ceil(data.results.number_results / rpp);

    // Restrict results to this page
    data.results.titles = data.results.titles.slice((data.display_page_number - 1) * rpp, data.display_page_number * rpp);

    return res.render(path.join(__dirname, 'search_results'), data);

  });

});

/**
 * Confirm order route
 */
router.get('/confirm_selection', function (req, res) {

  require('./data')(req.query.title_number, function(titles) {
    res.render(path.join(__dirname, 'confirm_selection'), {
      title: titles.shift(),
      display_page_number: req.query.page,
      search_term: req.query.search_term
    });
  });

});

/**
 * Sign in page
 */
router.all('/sign_in', function (req, res) {
  var title_number;

  if(typeof req.body.title_number !== 'undefined') {
    title_number = req.body.title_number;
  }

  res.render(path.join(__dirname, 'sign_in'), {
    'title_number': title_number
  });
});

/**
 * Worldpay routes
 */
router.all('/worldpay_:stage', function (req, res) {
  var title_number;

  if(typeof req.body.title_number !== 'undefined') {
    title_number = req.body.title_number;
  }

  res.render(path.join(__dirname, 'worldpay_' + req.params.stage), {
    'title_number': title_number
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
    address1: 'Land Registry',
    address2: 'Trafalgar house',
    address3: '1 Bedford Park',
    address4: 'Croydon',
    postcode: 'CR0 2AQ',
    reg_number: 'GB 8888 181 53'
  }

  require('./data')(req.query.title_number, function(titles) {
    var title = titles.shift();

    console.log('---');
    console.log(yaml.safeDump(title));
    console.log('---');

    res.render(path.join(__dirname, 'display_title'), {
      title: title,
      receipt: receipt
    });

  });

});

/**
 * Account creation forms
 */
router.all('/create_account:variant?', function(req, res) {
  var title_number;

  if(typeof req.query.title_number !== 'undefined') {
    title_number = req.query.title_number;
  }

  var variant = '';
  if(typeof req.params.variant !== 'undefined') {
    variant = req.params.variant;
  }

  res.render(path.join(__dirname, 'create_account' + variant), {
    countries: countries,
    title_number: title_number
  });
})

module.exports = router;
