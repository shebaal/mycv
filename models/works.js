const mongoose = require("mongoose");

const schema =mongoose.Schema; 

var worksSchema = new schema({
    name:{ 
                type:String,
                required:true
            },
            image:{
                type:String,
               
            },
            
            descr:{
                type:String,
                required:true,
            },
            
           
        },
            {
                timestamps:true}
        
);
 
var worksModel=mongoose.model('works',worksSchema);
 
module.exports = worksModel;