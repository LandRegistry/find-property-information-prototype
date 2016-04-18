var casual = require('casual').functions();
var db = require('./db');
var ProgressBar = require('progress');
var fs = require('fs');
var path = require('path');

if(fs.existsSync(path.join(__dirname, 'db/titles'))) {
  fs.unlinkSync(path.join(__dirname, 'db/titles'));
}

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
    var postcodeStart = city.substring(0,2).toUpperCase();

    // Streets
    for(var j=1;j<=totalStreets;j++) {

      (function() {
        casual.seed(i * j);
        var street = casual.street();
        var postcode = postcodeStart + j + ' ' + casual.integer(1,9) + casual.state_abbr();

        // Individual properties
        for(var k=1;k<=totalProperties;k++) {
          casual.seed(i * j * k);

          bar.tick();

          (function() {

            db.titles.insert({
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
