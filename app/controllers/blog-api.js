let express = require('express');
let router = express.Router();
let BlogPost = require('../model/BlogPost.js');

//Return all Posts
router.get('/', (req, res) => {
    BlogPost.findAll({where: {active: 1}}).then( (entries) =>{
        res.send(entries);
    })
})

router.get('/:id', (req, res) => {
    BlogPost.findById(req.params.id).then( (entries) =>{
        res.send(entries);
    })
})

//Add a new entry
router.post('/new_entry', (req, res) =>{
    console.log(req.body);
    BlogPost.create({title: req.body.title, text: req.body.text, active: 1});
    res.redirect('/blog')
})


module.exports = router;