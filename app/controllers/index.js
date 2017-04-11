let express = require('express');
let router = express.Router();


//router.use(express.static(__dirname + './app/resources'));

router.use('/blog', require('./blog-api.js'));
/*
router.get('/', (req, res) => {
    res.sendFile('index.html', {root: './app/resources'});
})*/
router.get('/resume', (req, res) =>{
    res.sendFile('resume_franchipereira.pdf', {root: './app/resources/assets'});
})

module.exports = router;