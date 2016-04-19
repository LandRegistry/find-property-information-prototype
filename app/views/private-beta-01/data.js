var results = require('../../../data/generate');

module.exports = function(searchTerm, callback) {
  searchTerm = searchTerm.trim();

  var terms = searchTerm.split(/[\s,]+/);
  terms.forEach(function(term, index) {
    terms[index] = term.toString().toLowerCase();
  });

  var searchResults = [];
  var logEntry;
  var searchType;

  // If it looks like a title number, do a title number search
  if(searchTerm.length === 11 && searchTerm.indexOf('FAKE') !== -1 && searchTerm.indexOf(' ') === -1) {
    logEntry = 'Searching for title number: ' + searchTerm;
    searchType = 'title_number';
  } else {
    logEntry = 'Searching for address: ' + searchTerm;
    searchType = 'address';
  }

  console.time(logEntry);

  results.forEach(function(result) {
    result.score = 0;

    // // If it looks like a title number, do a title number search
    if(searchType === 'title_number') {

      if (result.title_number.toLowerCase() === searchTerm.toLowerCase()) {
        searchResults.push(result);
      }

    } else {

      // Otherwise do an address search
      result.address.forEach(function(addressItem) {
        var compareItem = addressItem.toString().toLowerCase();

        terms.forEach(function(term) {
          var pos = compareItem.indexOf(term);

          if(pos !== -1) {
            result.score += (compareItem.length - pos) / compareItem.length;
          }
        })
      });

      if(result.score > 0) {
        searchResults.push(result);
      }

    }
  });

  searchResults = searchResults.sort(function(a, b) {

    // Initially sort by score
    if(a.score < b.score) return 1;
    if(a.score > b.score) return -1;

    // Otherwise sort by number
    if(a.address[0] < b.address[0]) return -1;
    if(a.address[0] > b.address[0]) return 1;

    return 0;
  });

  console.timeEnd(logEntry);
  callback(searchResults);

};
