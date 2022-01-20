var express = require('express');
var router = express.Router();
var client = require('../../app.js');
var type = require('../../type.js');
const { median } = require('../../type.js');
var collection = client.db('chart').collection('program_chart'); 

router.post('/',function(req,res){
    var program_name = req.body.program_name;
    var os = req.body.os;
    var uuid = req.body.uuid;
    var key_and_value = req.body.key_and_value;

    if(key_and_value == null || program_name == null || os == null || uuid == null){
        res.set('Content-Type','text/plain');
        console.log('nu');
        res.send(200,'fail');
        return;
    }else if (key_and_value.length > 100000 || program_name.length > 1000 || os.length >100 || uuid.length >1000){
        res.set('Content-Type','text/plain');
        console.log('nuu');
        res.send(200,'fail');
        return;
    }

    var split = key_and_value.split(",");

    var date = new Date();
    date.setHours(date.getHours(),0,0,0);
    var program_date =program_name + '/' + date.toISOString();

    const query = { _id: program_date};// ,users:{ $eq:{uuid: uuid} } };
    collection.findOne(query,function (error, info) {
        if(error) {
            res.set('Content-Type','text/plain');
            res.send(200,'fail');
            return;
        }else{  

            if(info.users.length == 0){
                collection.findOne({_id: program_date},function (error, info) {
                    if(error || info == null){
                        res.set('Content-Type','text/plain');
                        console.log('1');
                        res.send(200,'fail');
                        return;
                    }else{
    
                        let update = {uuid:uuid,os:os,attribute:[]};
    
                        for (let index = 0; index < info.key_and_type.length; ++index) {
                            let key_and_type = info.key_and_type[index];
                            
                            for(let i = 0;i<split.length;++i){
                                let value = split[i].split(";");
                                if(value.length < 2){
                                    res.set('Content-Type','text/plain');
                                    console.log('2');
                                    res.send(200,'fail');
                                    return;
                                }
                                if(key_and_type.key == value[0]){
                                    update.attribute.push({key:key_and_type.key,value: value[1]});
                                    if(!type.total(key_and_type.key,value[1],info)){
                                        res.set('Content-Type','text/plain');
                                        res.send(200,'fail');
                                        return;
                                    }
                                }
                            }
    
                        }
                        
                        collection.update({_id: program_date},{$set:{total: info.total},$push:{users:update}},function (error, info) {
                            if(error) {
                                res.set('Content-Type','text/plain');
                                console.log('3');
                                res.send(200,'fail');
                                return;
                            }else{
                                res.set('Content-Type','text/plain');
                                res.send(200,'success');
                                return;
                            }
                        });
                    }
                });
            }else{

                var user = info.users[0];

                for (let index = 0; index < info.users.length; ++index) {
                    if(info.users[index].uuid = uuid){
                        user = info.users[index];
                        break;
                    }
                }//나중에 수정

                console.log(user);

                for (let index = 0; index < split.length; ++index) {
                    let value = split[index].split(";");
                    if(value.length < 2){
                        res.set('Content-Type','text/plain');
                        console.log('4');
                        res.send(200,'fail');
                        return;
                    }
                    
                    let find = false;
                    for(let i = 0;i<user.attribute.length;++i){
                        let attr = user.attribute[i];
                        if(attr.key == value[0]){
                            if(!type.totalChange(attr.key,info,attr.value,value[1])){
                                res.set('Content-Type','text/plain');
                                res.send(200,'fail');
                                return;
                            }
                            attr.value = value[1];
                            find = true;
                            break;
                        }
                    }
                    if(!find){
                        user.attribute.push({key:value[0],value: value[1]});
                        if(!type.total(value[0],value[1],info)){
                            res.set('Content-Type','text/plain');
                            res.send(200,'fail');
                            return;
                        }
                    }
                }
                console.log(user);
                //트랜잭션 추가하기
                collection.update(query,info,function (error, info) {
                    if(error) {
                        res.set('Content-Type','text/plain');
                        console.log('5');
                        console.log(error);
                        res.send(200,'fail');
                        return;
                    }
                });
                collection.update({_id: program_date},{$set:{total: info.total}},function (error, info) {
                    if(error) {
                        res.set('Content-Type','text/plain');
                        console.log('5');
                        console.log(error);
                        res.send(200,'fail');
                        return;
                    }else{  
                        res.set('Content-Type','text/plain');
                        res.send(200,'success');
                        return;
                    }
                });
            }
        }
    });

});
module.exports = router;