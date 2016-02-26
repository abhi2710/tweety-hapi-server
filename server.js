'use strict';
var Routes = require('./routes'),
    Plugins = require('./plugins'),
    mongoose=require('mongoose'),
    bootstrap=require('./bootstrap'),
    PORTS=require('./Config/Constants').PORTS;
const Hapi = require('hapi'),
    server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: PORTS.LIVE
});
server.register(Plugins, function (err) {
        if (err) {
            server.error('Error while loading Plugins : ' + err)
        } else {
            server.log('info', 'Plugins Loaded')
        }
    }
);
var dboptions={
    user:"inter_5",
    pass:"inter_5_pwd"
};
//mongoose.connect('mongodb://localhost/twitter_5');
mongoose.connect('mongodb://localhost/twitter_5',dboptions);
mongoose.connection.once('connected', function() {
    console.log("Connected to database twitter_5")
});

//bootstrap.init();
server.route({
    method: '*',
    path: '/admin/map',
    handler: function (request, reply) {
        reply.view('./map');
    }
});

server.route({
    method: '*',
    path: '/',
    handler: function (request, reply) {
        reply('Welcome to Tweety');
    }
});

Routes.forEach(function (api) {
    server.route(api);
});
server.views({
    engines:{
        html:require('handlebars')
    },
    relativeTo:__dirname,
    path:'views'
});

server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});