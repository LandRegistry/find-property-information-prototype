var casual = require('casual').functions();
var ProgressBar = require('progress');
var fs = require('fs');
var path = require('path');

var postcodeGenerator = require('./includes/postcode');

var results = [];

var totalCities = 10;
var totalStreets = 50;
var totalProperties = 100;
var title_number = 1000000;

var bar = new ProgressBar(':bar', { total: totalCities * totalStreets * totalProperties });

// Cities
for(var i=1;i<=totalCities;i++) {

  (function() {

    casual.seed(i);
    var city = casual.city();
    var postcodeStart = postcodeGenerator.start(city, i);

    // Streets
    for(var j=1;j<=totalStreets;j++) {

      (function() {
        casual.seed(casual.integer(0, 999999999));

        var street = casual.street();

        // Filter out
        if(street === 'Gaylord Point') {
          casual.seed(casual.integer())
          street = casual.street();
          casual.seed(i * j);
        }

        var postcode = postcodeStart + postcodeGenerator.end(i * j);

        // Individual properties
        for(var k=1;k<=totalProperties;k++) {
          // casual.seed(i * j * k);

          bar.tick();

          (function() {

            results.push({
              data: {
              },
              title_number: 'FAKE' + (++title_number),
              address: [
                k,
                street,
                city,
                postcode
              ]
            });

          })();

        }

      })();
    }

  })();
}

console.log(totalCities * totalStreets * totalProperties + ' properties generated');

module.exports = results;
