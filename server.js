var path = require('path');
var express = require('express');
var nunjucks = require('express-nunjucks');
var basicAuth = require('basic-auth');
var bodyParser = require('body-parser');


var packageJson = require('./package.json');
var utils = require('./lib/utils.js');
var config = require('./app/config.js');
var routes = require('./app/routes.js');
var port = (process.env.PORT || config.port);

var app = express();

// Grab environment variables specified in Procfile or as Heroku config vars
var releaseVersion = packageJson.version;
var username = process.env.USERNAME;
var password = process.env.PASSWORD;
var env      = process.env.NODE_ENV || 'development';
var useAuth  = process.env.USE_AUTH || config.useAuth;

env      = env.toLowerCase();
useAuth  = useAuth.toLowerCase();

// Authenticate against the environment-provided credentials, if running
// the app in production (Heroku, effectively)
if (env === 'production' && useAuth === 'true'){
  app.use(utils.basicAuth(username, password));
}

// Application settings
app.set('view engine', 'html');
app.set('views', [
  __dirname + '/app/views',
  __dirname + '/lib/'
]);

nunjucks.setup({
  autoescape: true,
  watch: true,
  noCache: true
}, app);

// Middleware to serve static assets
app.use('/public', express.static('./app/assets/.land-registry-elements/assets'));

// Support for parsing data in POSTs
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Add variables that are available in all views
app.locals.asset_path="/public/";
app.locals.serviceName=config.serviceName;
app.locals.cookieText=config.cookieText;
app.locals.releaseVersion="v" + releaseVersion;

// Disallow search index idexing
app.use(function (req, res, next) {
  // Setting headers stops pages being indexed even if indexed pages link to them.
  res.setHeader('X-Robots-Tag', 'noindex');
  next();
});

app.get('/robots.txt', function (req, res) {
  res.type('text/plain');
  res.send("User-agent: *\nDisallow: /");
});

// routes (found in app/routes.js)
app.use("/", routes);

// auto render any view that exists
app.get(/^\/([^.]+)$/, function (req, res) {

  var path = (req.params[0]);

  res.render(path, function(err, html) {
    if (err) {
      res.render(path + "/index", function(err2, html) {
        if (err2) {
          console.log(err);
          res.status(404).send(err + "<br>" + err2);
        } else {
          res.end(html);
        }
      });
    } else {
      res.end(html);
    }
  });

});

// start the app
utils.findAvailablePort(app);
