module.exports = function(searchTerm) {
  var results = [];

  for(var i=0;i<50;i++) {
    results.push({
      data: {
      },
      title_number: i + 1 + 'foo',
      address: [i + 1 + ' ' + searchTerm, 'Bar', 'Wibble']
    });
  }

  return results;
};
