module.exports = function(casual) {
  var availableNotes = [
    'As to the part tinted blue on the title plan, only the first floor is included in the title.',
    'As to the part tinted pink on the title plan, only the first and second floors are included in the title.',
    'Only the ground floor flat is included in the title.'
  ];

  var otherNotes = [
    'As to the part tinted blue on the title plan, only the basement level parking space is included in the title.'
  ];

  var notes = {
    leaseholdNotes: function() {
      var ret = [];

      ret.push(casual.random_element(availableNotes));

      if(casual.integer(1,10) > 8) {
        ret.push(casual.random_element(otherNotes));
      }

      return ret;
    }
  };

  casual.register_provider(notes);
}
