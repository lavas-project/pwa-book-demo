/**
 * @file server.prod.js
 * @author lavas
 */

var LavasCore = require('lavas-core-vue');
var express = require('express');
var app = express();

var port = process.env.PORT || 3000;

var core = new LavasCore(__dirname);

process.env.NODE_ENV = 'production';

core.init(process.env.NODE_ENV)
    .then(function () {
        core.runAfterBuild()
    })
    .then(function () {
        app.use(core.expressMiddleware());
        app.listen(port, function () {
            console.log('server started at localhost:' + port);
        });
    }).catch(function (err) {
        console.log(err);
    });

// catch promise error
process.on('unhandledRejection', function (err, promise) {
    console.log('in unhandledRejection');
    console.log(err);
    // cannot redirect without ctx!
});

