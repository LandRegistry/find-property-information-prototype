var path = require('path');
var landRegistryElements = require('land-registry-elements');

/**
 * Call the land registry elements pattern library to grab our assets
 */
landRegistryElements({
  'destination': path.join(__dirname, 'dist'),
  'assetPath': 'assets',
  'components': [
    'elements/govuk/layout',
    'elements/govuk/core',
    'elements/govuk/typography',
    'elements/govuk/phase-banner',
  ]
})
  .then(function(dest) {
    console.log('Assets built to', dest);
  })
  .catch(function(e) {
    console.error(e);
  });
