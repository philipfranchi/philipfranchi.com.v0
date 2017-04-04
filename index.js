let express = require('express'),
    app = express(),
    fs = require('fs')


//Use the dist folder to serve public static files
app.use(express.static('./public'));

/*
//setup routes
app.use(require('./controllers/index.js'))

app.get('/', function (req, res) {
  res.sendFile('assets/index.html');
})
*/
app.get('/resume', (req, res) =>{
    res.sendFile(__dirname +'/public/resume_franchipereira.pdf')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})