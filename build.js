var path = require('path');
var landRegistryElements = require('land-registry-elements');

/**
 * Call the land registry elements pattern library to grab our assets
 */
landRegistryElements({
  'mode': ((process.env.mode === 'PRODUCTION') ? 'production' : 'dev'),
  'destination': path.join(__dirname, 'app/assets/.land-registry-elements'),
  'assetPath': '/public',
  'components': [
    'pages/find-property-information/search-form',
    'pages/find-property-information/search-results',
    'pages/find-property-information/about-this-property',
    'pages/find-property-information/about-this-property-signed-in',
    'pages/find-property-information/confirm-your-purchase',
    'pages/find-property-information/summary',
    'pages/find-property-information/cookies',
    'pages/find-property-information/account/create',
    'pages/land-registry/error-page'
  ]
})
  .then(function(dest) {
    console.log('Assets built to', dest);
  })
  .catch(function(e) {
    console.error(e);
  });
