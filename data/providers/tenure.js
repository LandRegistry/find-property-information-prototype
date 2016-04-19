module.exports = function(casual) {
  var tenures = ['Leasehold', 'Freehold'];

  var tenure = {
    tenure: function() {
      return casual.random_element(tenures);
    }
  };

  casual.register_provider(tenure);
}
