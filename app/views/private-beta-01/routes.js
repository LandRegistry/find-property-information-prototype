var express = require('express');
var router = express.Router();

/**
 * Landing page form
 */
router.get('/landing_page', function (req, res) {
  res.render('private-beta-01/landing_page');
});

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
  res.render('private-beta-01/landing_page');
});


/**
 * Search results
 */
router.get('/search_results', function (req, res) {
  var rpp = 20;

  // Equivalent to the form failing validation, except we don't have any server side in the proto
  if(!req.query.search_term) {
    res.render('private-beta-01/search');
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

    return res.render('private-beta-01/search_results', data);

  });

});

/**
 * Confirm order route
 */
router.get('/confirm_selection', function (req, res) {

  require('./data')(req.query.title_number, function(titles) {
    res.render('private-beta-01/confirm_selection', {
      title: titles.shift()
    });
  });

});

/**
 * Display title route
 */
router.get('/display_title', function (req, res) {

  if(typeof req.query.title_number === 'undefined') {
    return res.sendStatus(404);
  }

  require('./data')(req.query.title_number, function(titles) {
    res.render('private-beta-01/display_title', {
      title: titles.shift()
    });
  });

});


module.exports = router;
