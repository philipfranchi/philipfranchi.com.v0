let Sequelize = require('sequelize');
let sequelize = new Sequelize('blog', 'prh-dev', 'Penguin1', {
    host: 'localhost',
    dialect: 'mysql',

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
});

sequelize.authenticate()
    .then(function(err) {
        console.log('Connection has been established successfully.');
    })
    .catch(function (err) {
        console.log('Unable to connect to the database:', err);
        process.exit(1);
    });

module.exports = sequelize;