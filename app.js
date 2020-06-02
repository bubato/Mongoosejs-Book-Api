var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    console.log("Connected to mongod server");
});

mongoose.connect('mongodb://localhost/mongodb_tutorial');

var Book = require('./models/book');
var User = require('./models/user');
var bookOwner = require('./models/bookOwner');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var cors = require('cors')
app.use(cors());

var port = process.env.PORT || 8081;

var router = require('./routes')(app, Book, User, bookOwner);

var server = app.listen(port, function(){
 console.log("Express server has started on port " + port)
});