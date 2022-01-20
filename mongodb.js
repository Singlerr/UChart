var mongoose = require('mongoose');

var mongodb = {};

mongodb.setPromise = function(promise){
    mongoose.promise = promise;
}

mongodb.connect = function(uri){
    mongoose.connect(uri)
    .then(()=> console.log('몽고DB 연결 성공'))
    .catch(e => console.error(e));
}


module.exports = mongodb;