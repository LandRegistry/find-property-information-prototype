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
  search(data, searchTerm, callback);
};
