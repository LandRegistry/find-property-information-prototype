module.exports = function(casual) {

  var proprietors = {
    proprietor: function(probableAddress) {

      var address;

      // If we've been given a "probable" address for the proprietor, use it in
      // 8 out of 10 cases. For the remaining 2 cases, we will generate a random
      // address
      if(typeof probableAddress !== 'undefined') {
        if(casual.integer(0,10) <= 8) {
          address = probableAddress;
        } else {
          address = [
            casual.street,
            casual.city,
            casual.postcode(casual.city, casual.street)
          ];
        }
      }


      var proprietor = {
        name: casual.name,
        addresses: [
          // TODO: multiple addresses, most have single
          address
        ]
        // co_reg_no (optional)
        // company_location
        // addresses
      };

      return proprietor;
    }
  };

  casual.register_provider(proprietors);

  casual.define('proprietors', function(number, probableAddress) {
    var items = [];

    for(i=0;i<number;i++) {
      items.push(proprietors.proprietor(probableAddress));
    }

    return items;
  });
}

