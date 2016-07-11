var express = require('express'),
path = require('path'),
logger = require('morgan'),
cookieParser = require('cookie-parser'),
bodyParser = require('body-parser'),
routes = require('./routes/index'),
articleRoutes = require('./routes/article'),
userRoutes = require('./routes/users'),
sassMiddleware = require('node-sass-middleware'),
app = express(),
mongoose = require('mongoose');
require('dotenv').config();
require('events').EventEmitter.prototype._maxListeners = 100;
require('dotenv').config();
var cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

app.db = mongoose.connect(process.env.MLAB_URI, function(err) { if (err) {console.log(err);} });
app.cloudinary = cloudinary;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser());
app.use(
  sassMiddleware({
      src: __dirname + '/scss'
    , dest: path.join(__dirname, '/public/stylesheets')
    , debug: true
    , outputStyle: 'compressed'
    , prefix:  '/stylesheets'  // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/> 
  })
)
app.models = {};
app.models['Article'] = mongoose.model('Article', require('./models/article')); 
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/api/article', articleRoutes(app))
app.use('/api/user', userRoutes(app))
// app.use('/users', users);
app.all('/*', function(req, res) {
    res.sendFile('index.html', { root: path.join(__dirname, '/public') });
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
