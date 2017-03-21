var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var sequelize;


// if(env === 'production'){
    
    var sequelize = new Sequelize('mean_stack', 'root', 'password', {
        host: "localhost",
        dialect: 'mysql'
});
// }else{

//     sequelize = new Sequelize(undefined, undefined, undefined, {
//         'dialect':'sqlite',
//         'storage': __dirname  + '/data/dev-todo-api.sqlite'
//     });
 
// }
var db = {};



db.user = sequelize.import(__dirname + '/models/user.js');
db.message = sequelize.import(__dirname + '/models/message.js');
db.token = sequelize.import(__dirname + '/models/token.js');


db.sequelize = sequelize;
db.Sequelize = Sequelize;


db.message.belongsTo(db.user);
db.user.hasMany(db.message);





module.exports =db;