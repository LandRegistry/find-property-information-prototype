module.exports = function(casual) {
  var cardinalDirections = ['north', 'east', 'south', 'west'];

  var cardinalDirection = {
    cardinalDirection: function() {
      return casual.random_element(cardinalDirections);
    }
  };

  casual.register_provider(cardinalDirection);
}
