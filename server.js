var express =  require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var pets = require('./routes/pets');
var owners = require('./routes/owners');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/pets', pets);
app.use('/owners', owners);

// serve the index page at /
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, './public/views/index.html'));
});

var port = process.env.PORT || 3000;
var server = app.listen(port, function () {
  console.log('Listening on port ', server.address().port);
  console.log('Press Control + C to exit');
});
