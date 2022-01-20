


const { MongoClient } = require("mongodb");
const { allowedNodeEnvironmentFlags } = require("process");

const uri =
  "mongodb+srv://samjong:yXX8PynQUa6uvrR9@cluster0.ppmft.mongodb.net?retryWrites=true&w=majority";

const client = new MongoClient(uri);

var date = new Date();
date.setHours(date.getHours() - 1,0,0,0);

async function run() {
    //
    try {
        var options = {
        server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
        replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
        };
        await client.connect(options);

        console.log("Connected mongodb");
    }catch(err){
        console.log("mongodb connection failed");
    }
    
    module.exports = client;

    var http = require('http');
    var https = require('https');
    //
    var csrf = require('csurf');
    var csrfProtection = csrf({cookie:true});
    var express = require('express');
    var bodyParser = require('body-parser');
    var cookieParser = require('cookie-parser');
    require('dotenv').config();
    var app = express();
    var port = 80;
    //웹 어플리케이션 로드
    const server = require('./server.js');
    const p = require('process');
    //파일 서버용
    var util = require('util');
    var url = require('url');
    var path = require('path');
    var fs = require('fs');
    //세션
    const session = require('express-session');


    
    app.use(express.static(__dirname+'/views'));
    app.use(express.static(__dirname+'/files'));
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(bodyParser.json());
    app.use(session({
        key: 'sid',
        secret: 'secret',
        resave: false,
        saveUninitialized: true,
        cookie: {
          maxAge: 24000 * 60 * 60 
        }
      }));
    app.use(cookieParser());
    app.set('view engine','ejs');
    app.engine('html',require('ejs').renderFile);
    let loginRouter = require('./routes/login.js');
    let registerRouter = require('./routes/register.js');
    let addProgramRouter = require('./routes/http/add_program.js');
      app.use(function(req,res,next){
        if(! req.secure){
            res.redirect("https://u-chart.kr"+req.url);
        }else{
            next();
        }
      });
    app.use('/login',loginRouter);
    app.use('/register',registerRouter);
    app.use('/addProgram',addProgramRouter);

    var addInfoRouter = require('./routes/http/add_info.js');
    app.use('/addInfo',addInfoRouter);

    let getPrograms = require('./routes/http/get_programs.js');
    let programInfo = require('./routes/http/program_info.js');

    app.use('/getPrograms',getPrograms);
    app.use('/programInfo',programInfo);
    app.get('/',function(req,res){
        res.render('index',{session:req.session});
    });
    app.get('/signin',csrfProtection,function(req,res){
        res.render('signin',{csrfToken:req.csrfToken(),session:req.session,alert:""});
    });
    app.get('/register',csrfProtection,function(req,res){
        res.render('register',{csrfToken:req.csrfToken(),session:req.session,alert:""});
    })
    app.get('/programlist',function(req,res){
        res.render('programlist',{session:req.session});
    })
    app.get('/view_program',function(req,res){
        res.render('view_program'),{session:req.session};
    })
    app.get('/add_program',function(req,res){
        res.render('add_program',{session:req.session});
    })
    app.get('/GetStarted',function(req,res){
        res.render('GetStarted',{session:req.session});
    })
    app.get('/index',function(req,res){
        res.render('index',{session:req.session});
    })
    app.get('/about_Droid',function(req,res){
        res.render('about_Droid');
    })
    app.get('/logout',function(req,res){
        req.session.destroy();
        res.clearCookie('sid');
        res.redirect('index');
    });
    app.get('/googled6e5c7caa93a7458.html',function(req,res){

     fs.readFile(__dirname+'/files/googled6e5c7caa93a7458.html',function(err,content){
         res.writeHead(200,{'Content-Type':'text/html'});
         res.end(content,'utf-8');
        });
    });
   app.get('/naverbd876f4d4ecf6aa1b8a76f23d6617dbb.html',function(req,res){
    fs.readFile(__dirname+'/files/naverbd876f4d4ecf6aa1b8a76f23d6617dbb.html',function(err,content){
   res.writeHead(200,{'Content-Type':'text/html'});
  res.end(content,'utf-8');
}); 
    app.get('/robots.txt',function(req,res){
        fs.readFile(__dirname+"/files/robots.txt",function(err,content){
            res.writeHead(200,{'Content-Type':'text/plain'});
            res.end(content,'utf-8');
        });
    });
 });
    app.get('/sitemap',function(req,res){
        fs.readFile(__dirname+"/files/sitemap.xml",function(err,content){
            res.writeHead(200,{'Content-Type':'text/xml'});
            res.end(content,'utf-8');
        });
    });
    app.get('/feed',function(req,res){
        fs.readFile(__dirname+"/files/5208460052166258.xml",function(err,content){
            res.writeHead(200,{'Content-Type':'text/xml'});
            res.end(content,'utf-8');
        });
    });
    try{
    const options_ = {
        key: fs.readFileSync(__dirname+'/keys/private.key'),
        cert: fs.readFileSync(__dirname+'/keys/certificate.crt'),
        ca: fs.readFileSync(__dirname+'/keys/ca_bundle.crt')
    };
   	http.createServer(app).listen(port,"198.13.46.132");
	https.createServer(options_,app).listen(443,"198.13.46.132",()=>{console.log("서버 열림")});
    }catch(error){
        console.log(error);
    }

    playAlert = setInterval(function() {
        let date2 = new Date();
        date2.setHours(date2.getHours(),0,0,0);
        if(date.getHours() < date2.getHours()){
            date = date2;
            var collection = client.db('chart').collection('program_info'); 
            var collection2 = client.db('chart').collection('program_chart'); 
            collection.find().toArray(function (error, info) {
                if(error) {
                    return;
                }else{ 
                    for(let i = 0;i<info.length;++i){
                        collection2.findOne({ _id: info[i]._id + '/' + new Date(info[i].creation_time).toISOString() },function (error, response) {
                            if(error || response == null) {
                                return;
                            }else{
                                console.log(info[i]._id + '/' + new Date(info[i].creation_time).toISOString());

                                var query = 
                                { _id: info[i]._id + '/' + date.toISOString(),
                                key_and_type:response.key_and_type,
                                total: [],
                                users:[]
                                }
                               
                                var type = require('./type.js');

                                for (let index = 0; index < query.key_and_type.length; ++index) {
                                    type.init(query.key_and_type[index].key,query.key_and_type[index].type,query);
                                }
                                
                                collection2.insertOne(query, function (error, response) {
                                    console.log(query);
                                });
                            }
                        });
                    }
                    return;
                }
            });

        }
     }, 1000);
}
run().catch(console.dir);

