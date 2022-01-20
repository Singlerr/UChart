var express = require('express');
var router = express.Router();
var client = require('../app.js');
var collection = client.db('chart').collection('users'); 
var crypto = require('crypto');
var csrf = require('csurf');
var csrfProtection = csrf({cookie:true});
router.post('/',csrfProtection,function(req,res){//todo xss
    const email = req.body.email;
    const user_name = req.body.name;
    const token = req.body.token;

    if(email == null ||user_name == null || token == null){
        res.render('register',{csrfToken:req.csrfToken(),session:req.session,alert:"회원가입 도중 오류가 발생했습니다."});
        return;
    }else if (email == "" ||user_name == "" || token == ""){
        res.render('register',{csrfToken:req.csrfToken(),session:req.session,alert:"회원가입 도중 오류가 발생했습니다."});
        return;
    }else if (email.length > 100 ||user_name.length > 100 || token.length > 500){
        res.render('register',{csrfToken:req.csrfToken(),session:req.session,alert:"회원가입 도중 오류가 발생했습니다."});
        return;
    }

    var query = { _id: email };
    var fail = false;
    const account = collection.findOne(query,function (error, response) {
        
        if(error) {
            res.render('register',{csrfToken:req.csrfToken(),session:req.session,alert:"회원가입 도중 오류가 발생했습니다."});
          
        }else{
            var hash = crypto.createHash('sha512').update(token + "U-chart").digest('base64');

            console.log(hash);
        
            query = { _id: email,
                user_name: user_name,//todo valid
                token_type: 0,
                token: hash};
        
            fail = false;
        
            collection.insertOne(query, function (error, response) {
                if(error) {
                    res.render('register',{csrfToken:req.csrfToken(),session:req.session,alert:"회원가입 도중 오류가 발생했습니다."});
                    return;
                } else {
                    req.session.email = email;
                    req.session.save(()=>{res.redirect('index')});
                    return;
                }
            });
             
        }
    });
    
});

module.exports = router;
