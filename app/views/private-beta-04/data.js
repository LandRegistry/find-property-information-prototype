var data = require('../../../data/titles');
var search = require('../../../data/search');

// Use this space to insert any prototype specific entries onto the available
// set of data.
// To inspect the structure of the data, uncomment the following line. This will
// log the data structure to your console which you can then copy and paste here
// before making any modifications you wish to.

data.forEach(function(item) {
  if(item.data && item.data.title_number === 'FAKE1001200') {
    item.last_changed_date = '8th June 2016';
    item.lenders = item.lenders.slice(0,1);
    item.lenders[0].name = 'HSBC bank';
  }
});

module.exports = function(searchTerm, callback) {
  search(data, searchTerm, function(results) {

    // Limit the results returned to 50
    // (This limit is performed here rather than in the search so that future prototypes
    // can more easily experiment with derestricting the results)
    results = results.slice(0, 50);

    callback(results);
  });
};
