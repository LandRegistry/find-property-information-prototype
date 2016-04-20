var postcodeStarts = {};
var postcodeEnds = {};

function postcodeGenerator(casual) {

  // var randomInteger = require('../includes/integer')(casual);
  var seed = 1;

  function start(city, preventCollisions) {

    // If we've already generated a postcode start for the provided city, just return it
    if(postcodeStarts.hasOwnProperty(city)) {
      return postcodeStarts[city];
    }

    // First generate a postcode start from the city name
    var postcodeStart = city.substring(0,2).toUpperCase();

    // Check the postcodeStart is unique
    if(preventCollisions) {
      var count = 0;
      var collision;
      while(true) {

        // Detect collisions with existing postcodes
        collision = false;

        for(var cityIndex in postcodeStarts) {
          if(postcodeStarts.hasOwnProperty(cityIndex)) {
            if(postcodeStarts[cityIndex] === postcodeStart) {
              collision = true;

              // If we've found a collision, stop looking for more
              break;
            }
          }
        }

        // If we don't have a collision, bail out and stop trying to generate
        // unique postcode starts
        if(!collision) {
          break;
        }

        console.log(collision, 'Postcode collision', postcodeStart, 'for', city);

        // Generate a new postcode start by rolling through the alphabet
        // 26 * 26 = 676 possible combinations here
        postcodeStart = String.fromCharCode(65 + (count % 26), 65 + (Math.floor(count / 26) % 26));

        console.log('Replacing with', postcodeStart);

        count ++;

        if (count > (26 * 26)) {
          throw new Error('Too many postcode collisions')
        }
      }
    }

    if(preventCollisions) {
      postcodeStarts[city] = postcodeStart;
    }

    return postcodeStart;

  }

  function end(city, street, preventCollisions) {

    // If we've already generated a postcode for this city / street, just return it
    if(typeof postcodeEnds[city] !== 'undefined' && typeof postcodeEnds[city][street] !== 'undefined') {
      return postcodeEnds[city][street];
    }

    var numbers = casual.array_of_digits(2);
    var postcodeEnd = numbers[0] + ' ' + numbers[1];

    postcodeEnd += casual.letter.toUpperCase();
    casual.seed(++seed)
    postcodeEnd += casual.letter.toUpperCase();

    if(preventCollisions) {
      var count = 0;
      var collision;

      while(true) {
        // Detect collisions with existing postcodes
        collision = false;

        postcodeEndCollider:
        for(var cityIndex in postcodeEnds) {
          if(postcodeEnds.hasOwnProperty(cityIndex)) {
            for(var streetIndex in postcodeEnds[cityIndex]) {
              if(postcodeEnds[cityIndex].hasOwnProperty(streetIndex)) {

                if(postcodeEnds[cityIndex][streetIndex] === postcodeEnd) {
                  collision = true;

                  // If we've found a collision, stop looking for more
                  break postcodeEndCollider;
                }
              }
            }
          }
        }

        // If we don't have a collision, bail out and stop trying to generate
        // unique postcode starts
        if(!collision) {
          break;
        }

        console.log('Postcode collision', postcodeEnd);

        postcodeEnd = ((count % 20) + ' ' + ((count + 13) % 20) + String.fromCharCode(65 + (count % 26), 65 + (Math.floor(count / 26) % 26)));

        console.log('Replacing with', postcodeEnd);

        count++;

        if (count > (20 * 20 * 26 * 26)) {
          throw new Error('Too many postcode collisions')
        }
      }

      if(typeof postcodeEnds[city] === 'undefined') {
        postcodeEnds[city] = {};
      }

      postcodeEnds[city][street] = postcodeEnd;
    }

    return postcodeEnd;
  }

  casual.define('postcode', function(city, street, preventCollisions) {

    if(typeof preventCollisions === 'undefined') {
      preventCollisions = false;
    }

    return start(city, preventCollisions) + end(city, street, preventCollisions);
  });
}

module.exports = postcodeGenerator;
