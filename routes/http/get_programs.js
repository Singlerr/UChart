var express = require('express');
var router = express.Router();
var client = require('../../app.js');
var collection = client.db('chart').collection('program_info'); 

router.get('/',function(req,res){
    var email = req.session.email;
   
    if(email == null){
        res.set('Content-Type','text/plain');
        res.send(200,'fail');
        return;
    }

    const query = { _id: {$regex: email + '\\/.*'} };
    collection.find(query).toArray(function (error, response) {
        if(error || response == null) {
            res.set('Content-Type','text/plain');
            res.send(200,'fail');
            return;
        }else{
            console.log(response);
            res.set('Content-Type','text/json');
            res.send(200,response);
        }
    })

    
    
});

module.exports = router;