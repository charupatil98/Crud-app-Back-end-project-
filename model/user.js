const mongoose=require('mongoose')
const userschemma= new mongoose.Schema({
  name:{
    type:String,
    require:true
  },
  email:{
    type:String,
    require:true
  },
  phone:{
    type:String,
    require:true
  },
  image:{
    type:String,
    require:true
  },
  created:{
    type:Date,
    require:true,
    defualt:Date.now,
  },

});

module.exports=mongoose.model('user',userschemma)