// load the things we need
var express = require('express');
var app = express();


// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static('public'));



var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')

const multer = require("multer");
const mogoose = require("mongoose");
const session = require('express-session');
const flash = require('connect-flash');

const passport = require('passport');



const works = require("./models/works");
const persodata = require("./models/persodata");


// 1
const { ensureAuthenticated, forwardAuthenticated } = require('./config/auth');


app.use(express.static("public/"));
var path = require('path');
const { handle } = require("express/lib/application");



var usersRouter = require('./router/user');

// 2
require('./config/passport')(passport);
// 3
app.use(session({
  secret: 'codeforgeek',
  saveUninitialized: true,
  resave: true
}));

app.use(flash());
// 4
app.use(passport.initialize());
app.use(passport.session());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//imageadd code 

app.use(bodyParser.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use('/users', usersRouter);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.use(express.static("public/"))

app.use('public/javascripts', express.static(path.join(__dirname, 'public/javascripts')));

app.set('view engine','ejs');
  




const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './public/images1'),
  filename: (req, file, cb) => 
  {
      var extension = file.originalname.split(".");
      var ext = extension[extension.length - 1];

      var uploaded_file_name =
      file.fieldname +
      "-" +
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      "." +
      ext;

      cb(null, uploaded_file_name);
  }
});

const upload =  multer({
  storage: storage,
 
limits: 1024 * 1024 * 5,
});
//image code end
// use res.render to load up an ejs view file



///mongodb connect
mogoose
  .connect("mongodb://localhost:27017/Sheba")
  .then((result) => {
    // console.log(result);
  })
  .catch((error) => {
    console.log(error);
  });
//end mongodb connect

// index page 
app.get('/',forwardAuthenticated,function(req, res) {
    var mascots = [
        { name: 'Sammy', organization: "DigitalOcean", birth_year: 2012},
        { name: 'Tux', organization: "Linux", birth_year: 1996},
        { name: 'Tux', organization: "Linux", birth_year: 1996},
        { name: 'Moby Dock', organization: "Docker", birth_year: 2013}
    ];
    var tagline = "No programming concept is complete without a cute animal mascot.";
  
    
    res.locals.url = req.originalUrl;
    res.render('pages/website/index');
});

// about page
app.get('/about', function(req, res) {
  
    res.locals.url = req.originalUrl;
    res.render('pages/website/about');
});

// services page
app.get('/services',function(req, res) {
  
    res.locals.url = req.originalUrl;
    res.render('pages/website/services');
});

// skills page
app.get('/skills', function(req, res) {
  
    res.locals.url = req.originalUrl;
    res.render('pages/website/skills');
});

// skills page
app.get('/work', function(req, res) {
  
    res.locals.url = req.originalUrl;
    res.render('pages/website/work');
});

// skills page
app.get('/language', function(req, res) {
  
    res.locals.url = req.originalUrl;
    res.render('pages/website/language');
});
// skills page
app.get('/contact', function(req, res) {
  
    res.locals.url = req.originalUrl;
    res.render('pages/website/contact');
});






// dashboard

app.get('/admin', ensureAuthenticated,function(req, res) {
  persodata.find().then((reslut)=>{
    console.log(reslut);
    res.render('pages/dashboard/admin');
});
});

  //end add persodata
  //update persodata
app.post(("/update/admin"),upload.single('image'),function  (req,res){
  var doc={
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    phonenumber: req.body.phonenumber,
    major: req.body.majore,
    address: req.body.address,
    image: req.file.filename
    
   

}
var id = req.body.id;
persodata.updateOne({"_id":id}
,{$set:doc},doc,(err,result)=>{
  console.log(err)
})
res.redirect("/admin");
}
);
  //end update services
  
    //start works
  //add works
  app.post("/works/add",upload.single('image'), (req, res) => {
    const s = new works({
      name: req.body.name,
      image: req.file.filename,
      descr: req.body.descr,
      
    });
    s.save((error,result)=>{
        if(error)
       console.log(error.message);
        else{
        console.log(result);
        }
    });
    console.log("data inserted successful");
    // message(); 
    
    res.redirect("/works");    
    res.end();  
});
app.get('/works',ensureAuthenticated,(req,res)=>{
  works.find().then((reslut)=>{
        console.log(works.length);
        res.render('pages/dashboard/work',{works:reslut});
    });
  });
  //end add works
  //update works
app.post(("/update/works"),upload.single('image'),function  (req,res){
  var doc={
    name: req.body.name,
    image: req.file.filename,
    descr: req.body.descr

}
var id = req.body.id;
works.updateOne({"_id":id}
,{$set:doc},doc,(err,result)=>{
  console.log(err)
})
res.redirect("/works");
}
);
  //end update works
  //delet works
  app.get('/works/delete/(:id)',ensureAuthenticated, function (req, res, next) {
    works.findByIdAndRemove(req.params.id, (err, doc) => {
      if (!err) {
        res.redirect('/works');
      } else {
        console.log('Failed to Delete user Details: ' + err);
      }
    });
  })
  //end delete works
  //end works

app.listen(8080);
console.log('8080 is the magic port');
