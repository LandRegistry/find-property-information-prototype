module.exports = function(data, searchTerm, callback) {
  searchTerm = searchTerm.trim();

  var searchResults = [];
  var logEntry;
  var searchType;

  // Split the search term into pieces so we can compare each bit
  // (Split by spaces and by commas)
  var terms = searchTerm.split(/[\s,]+/);
  terms.forEach(function(term, index) {
    terms[index] = term.toString().toLowerCase();
  });

  // If it looks like a title number, do a title number search
  if(searchTerm.length === 11 && searchTerm.indexOf('FAKE') !== -1 && searchTerm.indexOf(' ') === -1) {
    logEntry = 'Searching for title number: ' + searchTerm;
    searchType = 'title_number';
  } else {
    logEntry = 'Searching for address: ' + searchTerm;
    searchType = 'address';
  }

  console.time(logEntry);

  // Loop over the complete set of results
  data.forEach(function(result) {

    // Keep track of a "score" for each result which we will sort by later
    result.score = 0;

    // // If it looks like a title number, do a title number search
    if(searchType === 'title_number') {

      if(typeof result.data === 'undefined' || typeof result.data.title_number === 'undefined') {
        // Skip over titles that don't have a title number
        return;
      }

      if (result.data.title_number.toLowerCase() === searchTerm.toLowerCase()) {
        searchResults.push(result);
      }

    } else {

      // Otherwise do an address search
      // Loop over each component of the address
      result.address.forEach(function(addressItem) {
        var compareItem = addressItem.toString().toLowerCase().replace(' ', '');

        // Loop over each component of the search term (Split by commas and spaces earlier)
        terms.forEach(function(term) {

          // Find out position of the search term in this address item
          var pos = compareItem.indexOf(term);

          // If we've found it
          if(pos !== -1) {
            // Assign it a score based on the position within the string
            result.score += (compareItem.length - pos) / compareItem.length;
          }
        })
      });

      // If we've got a non zero score, pop it onto the set of results to return
      if(result.score > 0) {
        searchResults.push(result);
      }

    }
  });

  // Sort the resutls
  searchResults = searchResults.sort(function(a, b) {

    // Initially sort by score
    if(a.score < b.score) return 1;
    if(a.score > b.score) return -1;

    // Otherwise sort by the first component of the address
    if(a.address[0] < b.address[0]) return -1;
    if(a.address[0] > b.address[0]) return 1;

    return 0;
  });

  console.timeEnd(logEntry);

  callback(searchResults);

};
