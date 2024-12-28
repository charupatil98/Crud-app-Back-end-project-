require('dotenv').config();
const express=require("express")
 const path=require('path')
 const mongoose=require("mongoose")
 const session=require("express-session")
  const multer=require("multer")
  const fs=require("fs")
  const User=require("./model/user");
const user = require('./model/user');
 const app=express()
 app.set('view engine','ejs')
 app.set('views','views')
 const PORT=process.env.PORT||4000
app.use(express.static(path.join(__dirname,'./','public',)))
mongoose.connect(process.env.DB_URL,{useNewUrlParser:true})
const db=mongoose.connection
db.on('error',(error)=>console.log(error))
db.once('open',()=>console.log('Connected successfully'))

//upload image
var storage=multer.diskStorage({
  destination:function(req,file,cb)
  {
   cb(null,'./uploads')
  },
  filename:function(req,file,cb)
  {
    cb(null,file.fieldname+"_"+Date.now()+"_"+file.originalname)
  }
})
var upload=multer({
  storage:storage,
}).single("image")

//inserting records
app.post("/adduser",upload,(req,res)=>{
  const user=new User({
    name:req.body.name,
    email:req.body.email,
    phone:req.body.phone,
    image:req.file.filename
  });
  user.save().then(()=>{
    console.log("document save successfully")
  }).catch((error)=>{
    console.log("document hav'nt saved")
  })
  res.redirect('/')
})



 //home page
 //to fetch data
 app.get("/",(req,res)=>{
user.find().then((users)=>{
  res.render("./partials/Index",{
    title:"home page",
    users:users
  })
}).catch((error)=>{
  console.log("data not stored in table")
})
 
 })

 //fetch img
 app.use(express.static("uploads"))

 //about page
 app.get("/aboutpage",(req,res)=>{
  res.render("./partials/about")
 })
 //adduserpage
 app.get("/adduser",(req,res)=>{
  res.render("./partials/adduser")
 })

 app.use(express.urlencoded({extended:false}))
 app.use(express.json());

 app.use(session({
  secret:"my secret key",
  saveUninitialized:true,
  resave:false
 }))

 app.use((req,res,next)=>{
  res.locals.message=req.session.message
  delete req.session.message;
  next()
 })


 //update form
 app.get("/edit/:id",(req,res)=>{
  let id=req.params.id;
  User.findById(id).then((user)=>{
    res.render('./partials/edituser',{
      title:"edit users",
      user:user
    })
   }).catch((err)=>{
    res.redirect('/')
   })
})
//update data
app.post('/update/:id',upload,(req,res)=>{
  let id=req.params.id;
   User.findByIdAndUpdate(id,{
    name:req.body.name,
    email:req.body.email,
    phone:req.body.phone,
   }).then(()=>{
    res.redirect("/")
   })
  })

//delete data
app.get('/delete/:id',(req,res)=>{
   let id=req.params.id;
   User.findByIdAndDelete(id).then(()=>{
    res.redirect("/")
   }).catch((err)=>{
   console.log("somthing went wrong")
   })  
})

 app.listen(PORT,()=>{
  console.log(`server started at http://localhost:${PORT}`)
 })