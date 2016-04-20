var casual = require('casual');
var ProgressBar = require('progress');
var fs = require('fs');
var path = require('path');
var extend = require('extend');
var once = require('once');

// var postcodeGenerator = require('./includes/postcode');

once(function() {
  require('./providers/tenure')(casual);
  require('./providers/cardinalDirection')(casual);
  require('./providers/proprietors')(casual);
  require('./providers/postcode')(casual);
})();

var results = [];

var totalCities = 10;
var totalStreets = 50;
var totalProperties = 60;
var title_number = 1000000;

var bar = new ProgressBar(':bar', { total: totalCities * totalStreets * totalProperties });


// Cities
for(var i=1;i<=totalCities;i++) {

  (function() {

    casual.seed(i);
    var city = casual.city;
    // var postcodeStart = postcodeGenerator.start(city, i);

    // Streets
    for(var j=1;j<=totalStreets;j++) {

      (function() {
        casual.seed(title_number);

        var street = casual.street;

        // Filter out
        if(street === 'Gaylord Point') {
          return;
        }

        var postcode = casual.postcode(city, street, true);

        // Individual properties
        for(var k=1;k<=totalProperties;k++) {
          casual.seed(title_number);

          var randomInteger = require('./includes/integer')(casual);

          bar.tick();

          (function() {

            var item = {
              // 25% leasehold
              tenure: casual.tenure,
              data: {
                title_number: 'FAKE' + (++title_number)
              },
              address: [
                k + ' ' + street,
                city,
                postcode
              ]
            };


            item.proprietors = casual.proprietors(randomInteger(1,3), item.address);


            // lenders
            // name
            // name_extra_info
            // co_reg_no?
            // company_location
            // addresses

            // ppi_data
            item.ppi_data = '£' + randomInteger(80, 999) + ',000 the price stated to have been paid on ' + randomInteger(1, 28) + ' June ' + randomInteger(2000, 2015);

            // caution titles
            // These are generated as "Land east/west of X" and are inserted
            // in addition to the current title we are generating
            if(randomInteger(0,100) > 95) {
              var cautionItem = extend(true, {}, item);

              cautionItem.data.title_number = 'FAKE' + (++title_number);
              cautionItem.tenure = 'Freehold';

              cautionItem.data.is_caution_title = true;

              if(randomInteger(0,100) > 95) {
                cautionItem.address.unshift('Land to the ' + casual.cardinalDirection + ' of ');
              }
              results.push(cautionItem);
            }

            // no data
            if(randomInteger(0,100) > 95) {
              delete item.data;
            }

            results.push(item);

          })();

        }

      })();
    }

  })();
}

console.log(results.length + ' properties generated');

module.exports = results;
