module.exports = function(casual) {
  var rands = []

  // Generate an array of random numbers
  // Pick one of these numbers based on the min and max and use them instead of
  // making more calls to casual.integer() or any of the random number
  // generation functions because each call to these functions changes the
  // sequence and destroys the predictability of our set of results.
  while(rands.length < 100) {
    rands.push(casual.random);
  }

  return function(min, max) {

    // For a given set of min and max values, return a predictable random number
    // Note, the passed in instance of casual is seeded per property
    // The goal here is for a given seed, to always return a predictable random
    // number regardless of the number of times it is called
    var pointer = (min + max) % (rands.length - 1);
    return Math.floor((rands[pointer] * (max - min + 1)) + min);
  }
}
