'use strict';
var Routes = require('./routes'),
    Plugins = require('./plugins'),
    mongoose=require('mongoose');
const Hapi = require('hapi'),
    server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 8500
});
server.register(Plugins, function (err) {
        if (err) {
            server.error('Error while loading Plugins : ' + err)
        } else {
            server.log('info', 'Plugins Loaded')
        }
    }
);
mongoose.connect('mongodb://localhost/Tweetydb');
mongoose.connection.once('connected', function() {
    console.log("Connected to database Tweetydb")
});

server.route({
    method: '*',
    path: '/login',
    handler: function (request, reply) {
        reply.view('./signin');
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