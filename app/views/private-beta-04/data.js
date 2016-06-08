var data = require('../../../data/titles');
var search = require('../../../data/search');

// Use this space to insert any prototype specific entries onto the available
// set of data.
// To inspect the structure of the data, uncomment the following line. This will
// log the data structure to your console which you can then copy and paste here
// before making any modifications you wish to.

// console.log(data[0]);
//
//FAKE1001200

// One lender of HSBC
// Date to be today


// data.forEach(function(item) {
//   if(item.data.title_number === 'FAKE1001200') {
//     console.log('HERE');
//   }
// });

// Fix it so that


module.exports = function(searchTerm, callback) {
  search(data, searchTerm, function(results) {

    // Limit the results returned to 50
    // (This limit is performed here rather than in the search so that future prototypes
    // can more easily experiment with derestricting the results)
    results = results.slice(0, 50);

    callback(results);
  });
};
