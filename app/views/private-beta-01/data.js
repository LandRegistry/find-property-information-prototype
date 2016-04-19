var data = require('../../../data/titles');
var search = require('../../../data/search');

// Use this space to insert any prototype specific entries onto the available
// set of data.
// For example:
data.push({
  data: {},
  title_number: 'FAKE123123',
  address: [
    'Seaton Court',
    '2',
    'William Prance Rd',
    'Plymouth',
    'PL6 5WS'
  ]
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
