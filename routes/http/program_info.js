var express = require('express');
var router = express.Router();
var client = require('../../app.js');
var collection = client.db('chart').collection('program_chart'); 

router.get('/',function(req,res){
    var program_name = req.query.program_name;
  
    if(program_name == null){
        res.set('Content-Type','text/plain');
        res.send(200,'fail');
        return;
    }else if (program_name.length > 500){
        res.set('Content-Type','text/plain');
        res.send(200,'fail');
        return;
    }


    const query = { _id: {$regex: program_name + '\\/.*'} };
    console.log(query);
    collection.find(query).toArray(function (error, info) {
        if(error) {
            res.set('Content-Type','text/plain');
            res.send(200,'fail');
            return;
        }else{ 
            res.set('Content-Type','text/json');
          
            res.send(200,info);
        
            return;
        }
    });
    
});

module.exports = router;