var casual = require('casual').functions();

var postcodeStarts = [];
var postcodeEnds = [];


function start(cityName, seed) {

  casual.seed(seed);

  // First generate a postcode start from the city name
  var postcodeStart = cityName.substring(0,2).toUpperCase();

  // Check the postcodeStart is unique
  while(true) {

    if(postcodeStarts.indexOf(postcodeStart) === -1) {
      break;
    }

    console.log('Postcode collision', postcodeStart);

    casual.seed(++seed)
    postcodeStart = casual.letter();
    casual.seed(++seed)
    postcodeStart += casual.letter();

    postcodeStart = postcodeStart.toUpperCase();

    console.log('Replacing with', postcodeStart);

  }

  postcodeStarts.push(postcodeStart);

  return postcodeStart;

}

function end(seed) {

  casual.seed(seed);

  var numbers = casual.array_of_digits(2);
  var postcodeEnd = numbers[0] + ' ' + numbers[1] + casual.state_abbr()

  while(true) {
    if(postcodeEnds.indexOf(postcodeEnd) === -1) {
      break;
    }

    console.log('Postcode collision', postcodeEnd);
    postcodeEnd = end(++seed);
    console.log('Replacing with', postcodeEnd);
  }

  return postcodeEnd;
}

module.exports = {
  start: start,
  end: end
};
