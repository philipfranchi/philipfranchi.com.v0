let express = require('express'),
    app = express(),
    fs = require('fs'),
    bodyParser = require('body-parser')

//Routes and Middleware
app.use(express.static(__dirname + '/app/resources'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

//parse application/json
app.use(bodyParser.json())

app.use('/', require('./app/controllers'));


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})