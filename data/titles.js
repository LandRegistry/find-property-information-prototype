var casual = require('casual');
var ProgressBar = require('progress');
var fs = require('fs');
var path = require('path');
var extend = require('extend');
var once = require('once');
var moment = require('moment');

// var postcodeGenerator = require('./includes/postcode');

once(function() {
  require('./providers/tenure')(casual);
  require('./providers/cardinalDirection')(casual);
  require('./providers/proprietors')(casual);
  require('./providers/lenders')(casual);
  require('./providers/postcode')(casual);
  require('./providers/companyLocation')(casual);
  require('./providers/leaseholdA1notes')(casual);
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

            var timestamp = casual.integer(946684800000, 1451606400000);

            var item = {
              tenure: casual.tenure,
              last_changed_datetime: moment(timestamp).format(),
              last_changed_date: moment(timestamp).format('D MMMM YYYY'),
              last_changed_time: moment(timestamp).format('H:mm:ss'),
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
            item.lenders = casual.lenders(randomInteger(1,2));

            // A1 notes for leasehold properties
            if(item.tenure === 'Leasehold') {
              item.property_notes = casual.leaseholdNotes;
            }

            // ppi_data
            item.ppi_data = '£' + randomInteger(80, 999) + ',000 the price stated to have been paid on ' + randomInteger(1, 28) + ' June ' + randomInteger(2000, 2015);

            // Based on a random integer between 0 and 100, split the titles
            // into segments. This is just used to help us generate titles of
            // different types
            var segment = randomInteger(0,100);

            if(segment > 90 && segment <= 90) {

              // titles without data
              delete item.data;

            } else if(segment > 90 && segment <= 95) {

              // Standard caution titles
              item.data.is_caution_title = true;

              // Nuke lenders and price paid data - you don't get this for caution titles
              delete item.lenders;
              delete item.ppi_data;

            } else if (segment > 95) {

              // caution titles representing "Land east/west of X"
              // These are inserted in addition to the current title we are generating
              var cautionItem = extend(true, {}, item);

              delete cautionItem.lenders;
              delete cautionItem.ppi_data;
              delete cautionItem.property_notes;

              cautionItem.data.is_caution_title = true;

              cautionItem.data.title_number = 'FAKE' + (++title_number);

              cautionItem.address.unshift('Land to the ' + casual.cardinalDirection + ' of ');

              cautionItem.proprietors = cautionItem.proprietors.slice(0,1);

              results.push(cautionItem);

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
