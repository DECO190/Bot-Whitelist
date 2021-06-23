var knex = require('knex')({
    client: 'mysql',
    connection: {
		host: '127.0.0.1',
     	user : 'root',
      	password : '',
      	database : 'vrp_test' // nome do banco de dados
    }
});

module.exports = knex