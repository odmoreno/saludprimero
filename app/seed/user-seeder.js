var User = require('../models/user_login');

var mongoose = require('mongoose');
//mongodb://admin:SaludPrimero@ds153835.mlab.com:53835/saludprimero30
//mongodb://admin:oscarpol@ds161295.mlab.com:61295/practicanode
mongoose.connect('mongodb://admin:SaludPrimero@ds153835.mlab.com:53835/saludprimero30');
require('../config/passport');


var users = [
    new User ({
      email: 'oscarmoreno_ds@hotmail.com',
      password: '1234',
      rol: 'cliente'
    }),
    new User ({
        email: 'veronica@hotmail.com',
        password: '1234',
        rol: 'operario'
    }),
    new User ({
        email: 'edgar@hotmail.com',
        password: '1234',
        rol: 'laboratorista'
    }),
    new User ({
        email: 'carlos@hotmail.com',
        password: '1234',
        rol: 'cliente'
    })
];

var done = 0;
for (var i=0; i< users.length; i++){
    users[i].password = users[i].encryptPassword(users[i].password);
    users[i].save(function(err,result){
        done++;
        if(done === users.length){
            exit();
        }
    });
}
function exit(){
    mongoose.disconnect();
}
