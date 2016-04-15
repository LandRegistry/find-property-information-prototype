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

module.exports = router;
