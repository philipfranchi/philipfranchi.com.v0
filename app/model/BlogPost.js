let Sequelize = require('sequelize');
let sequelize = require('./database.js');

let BlogPost = sequelize.define('blog_post', {
    title: {
        type: Sequelize.STRING
    },
    text: {
        type: Sequelize.TEXT
    },
    active:{
        type: Sequelize.INTEGER
    }
});

BlogPost.sync({force: false}).then(function () {
  // Table created
});
module.exports = BlogPost;