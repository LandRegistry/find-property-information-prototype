var db = require('../../../data/db');

module.exports = function(searchTerm, callback) {
  searchTerm = searchTerm.trim();

  var logEntry;
  var conditions = {
    $or: []
  };

  // If it looks like a title number, do a title number search
  if(searchTerm.length === 11 && searchTerm.indexOf('FAKE') !== -1 && searchTerm.indexOf(' ') === -1) {

    logEntry = 'Searching for title number: ' + searchTerm;

    conditions['$or'].push({
      title_number: {
        $regex: new RegExp(searchTerm, 'i')
      }
    });

  } else {

    var terms = searchTerm.split(/[\s,]+/);
    // var terms = searchTerm.split(',');
console.log(terms);
    terms.forEach(function(term) {

      logEntry = 'Searching for address string: ' + searchTerm;

      // var subConditions = {
      //   $or: []
      // };

      // term.split(' ').forEach(function(subTerm) {
      //   subConditions['$or'].push({
      //     address: {
      //       $regex: new RegExp(subTerm, 'i')
      //     }
      //   });
      // })

      // conditions['$and'].push(subConditions)

      conditions['$or'].push({
        address: {
          $regex: new RegExp(term, 'gi')
        }
      });

    });

    console.log(conditions)

  }

  console.time(logEntry);

  db.titles
    .find(conditions)
    .limit(50)
    .exec(function(err, docs) {
      if(err) {
        throw err;
      }

      callback(docs);

      console.timeEnd(logEntry);
    });
};