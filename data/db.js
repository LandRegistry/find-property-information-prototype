var Datastore = require('nedb');
var path = require('path');
var mkdirp = require('mkdirp');

var destination = path.join(__dirname, 'db');
mkdirp.sync(destination);

var titles = new Datastore({
  filename: path.join(destination, 'titles'),
  autoload: true
});

module.exports = {
  titles: titles
};
