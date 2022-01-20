var express = require('express');
var router = express.Router();
var client = require('../app.js');
var collection = client.db('chart').collection('users'); 
var crypto = require('crypto');
var csrf = require('csurf');
var csrfProtection = csrf({cookie:true});
router.post('/',csrfProtection,function(req,res){
   
    const email = req.body.email;
    const token = req.body.token;
    if(email == null || token == null){
        res.set('Content-Type','text/plain');
        res.send(200,'fail');
        return;
    }else if (email.length > 100 || token.length > 500){
        res.set('Content-Type','text/plain');
        res.send(200,'fail');
        return;
    }

    const query = { _id: email };
    collection.findOne(query,function (error, response) {
        if(error || response == null) {
            res.render('signin',{csrfToken:req.csrfToken(),session:req.session,alert:"아이디 또는 비밀번호가 잘못되었습니다."});
            return;
        }else{
            var hash = crypto.createHash('sha512').update(token + "U-chart").digest('base64');

            if(response.token != hash){
                res.render('signin',{csrfToken:req.csrfToken(),session:req.session,alert:"아이디 또는 비밀번호가 잘못되었습니다."});
                return;
            }
            req.session.email = email;
            req.session.save(()=>{res.redirect('index')});
        }
    });

   
});
router.get('/session',function(req,res){
   
    if(req.session.email){
        res.set('Content-Type','text/plain');
        res.send(200,'OK');
    }else{
        res.set('Content-Type','text/plain');
        res.send(200,'Fail');
    }
});
module.exports = router;

