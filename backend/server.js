//Importing required modules
const express=require('express')
const mongoose=require('mongoose')
require('dotenv').config()
const cors=require("cors");
const User=require('./models/User')
const bcrypt=require('bcryptjs')

//Middlewares
const app=express()
app.use(cors());
app.use(express.json());
const PORT=3000
//MongoDB Connection
mongoose.connect(process.env.MONGO_URI).then(
    ()=>console.log('DB connected....')
).catch(
    (err)=>console.log(err)
)

app.post('/register',async(req,res)=>{
    const {username,email,password}=req.body
    try{
        const hashedPassword=await bcrypt.hash(password,10)
        const user=new User({username,email,password:hashedPassword})
        await user.save()
        res.json({message:"User Registred.."})
        console.log("User Registred completed..")
}
 catch(err){
    console.log(err)
 }
})
//Login API
app.post('/login',async(req,res)=>
{
    const {email,password}=req.body
    try{
        const user=await User.findOne({email})
        if(!user || !(await bcrypt.compare(password,user.password)))
        {
            return res.status(400).json({message:"Invalid Credentials.."})
        }
        res.json({message:"Login Successfull", username:user.username});

    }
    catch(err){
        

    }
})

//Connecting Server
app.listen(PORT, (err) => 
{
    if(err)
    {
        console.log(err)
    }
    console.log("Server running on:",PORT)
})