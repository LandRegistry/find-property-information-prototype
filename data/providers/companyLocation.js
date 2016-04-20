module.exports = function(casual) {
  var companyLocations = ['OV', 'NI', 'SC'];

  var companyLocation = {
    companyLocation: function() {
      if(casual.integer(0,10) > 8) {
        return  casual.random_element(companyLocations);
      } else {
        return null;  // Null means UK
      }
    }
  };

  casual.register_provider(companyLocation);
}
