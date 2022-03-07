const mongoose = require("mongoose");

const schema =mongoose.Schema; 

var persodataSchema = new schema({
    fname:{ 
        type:String,
        required:true
    },
    lname:{ 
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
    },
    phonenumber:{
        type:String,
       
    },
    
    major:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    image:{
        type:String,
       
    },
    
   
},
    

);
 
var persodata=mongoose.model('persodata',persodataSchema);
 
module.exports =persodata;