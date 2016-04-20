module.exports = function(casual) {

  var availableLenders = ['Barclays bank', 'HSBC bank', 'TSB bank', 'Cooperative bank'];
  var bankStreets = ['High street', 'Queen street', 'Fore street', 'Royal Parade'];

  var lenders = {
    lender: function() {

      var street = casual.random_element(bankStreets);
      var lender = {
        name: casual.random_element(availableLenders),
        addresses: [
          [
            street,
            casual.city,
            casual.postcode(casual.city, street)
          ]
        ]
      };

      return lender;
    }
  };

  casual.register_provider(lenders);

  casual.define('lenders', function(number) {
    var items = [];

    for(i=0;i<number;i++) {
      items.push(lenders.lender());
    }

    return items;
  });

}

