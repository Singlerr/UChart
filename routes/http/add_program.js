var express = require('express');
var router = express.Router();
var client = require('../../app.js');
var type = require('../../type.js');
var collection = client.db('chart').collection('program_chart'); 
var collection2 = client.db('chart').collection('program_info'); 

router.post('/',function(req,res){
    var key_and_type = req.body.key_and_type;
    var email = req.session.email;
    var program_name = req.body.program_name;
    var language = req.body.language;

    if(key_and_type == null || email == null || program_name == null || language == null){
        res.set('Content-Type','text/plain');
        res.send(200,'ERR_NO_DATA');
        return;
    }else if (key_and_type.length > 10000 || program_name.length > 500 || language.length > 100){
        res.set('Content-Type','text/plain');
        res.send(200,'ERR_OUT_OF_LENGTH');
        return;
    }

    var date = new Date();
    date.setHours(date.getHours(),0,0,0);
    var query2 = {_id:email + '/' + program_name,language:language,creation_time:date};


    var query = 
    { _id: email + '/' + program_name + '/' + date.toISOString(),
      key_and_type:[],
      total: [],
      users:[]
    }
   

    var split = key_and_type.split(',');

    for (let index = 0; index < split.length; ++index) {
        let value = split[index].split(";");
        if(value.length < 2){
            res.set('Content-Type','text/plain');
            res.send(200,'ERR_INCORRECT_KEYANDVALUES');
            return;
        }
        query.key_and_type.push({key: value[0],type: value[1]});
        type.init(value[0],value[1],query);
        
    }

    collection.insertOne(query, function (error, response) {
        if(error) {
            res.set('Content-Type','text/plain');
            res.send(200,'ERR_DATABASE');
            return;
        } else {
            collection2.insertOne(query2, function (error, response) {//트랜잭션 나중에
                if(error) {
                    res.set('Content-Type','text/plain');
                    res.send(200,'ERR_DATABASE');
                    return;
                } else {
                    res.set('Content-Type','text/plain');
                    res.send(200,'success');
                    return;
                }
            });;
        }
    });

    
    
});

module.exports = router;
