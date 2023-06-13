const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')

const User = require ('../models/User')

//import Validate
const{registerValidation, loginValidation

} = require('../config/validation')
function result (succ,msg,details){
    if(details){
        return{
            success : succ,
            message : msg,
            data    :details
       
        }
    }else{
        return{
            success:succ,
            message:msg
        }
    }
}

//register
router.post('/register',async (req,res)=>{
    const{error} = registerValidation(req.body)
    if(error)return res.status(200).json(result(0,error.details[0].message))
    //username exist
    const usernameExist = await User.findOne({
        usename:req.body.username
    })
    if(usernameExist)return res.status(200).json(result(0,'Username already exist'))


    //has password
    const salt = await bcrypt.genSalt(10)
    const hasPassword=await bcrypt.hash(req.body.password,salt)

    const user = new User({
        username : req.body.username,
        password : hasPassword
    })
    try{
        const saveUser= await user.save()
        res.status(200).json(result(1,'Register User Success!',saveUser))

    }catch(error){
        res.status(200).json(result(0,'register User Failed'))
    }
})

//login
router.post('/login',async (req,res)=>{
    const{error}=loginValidation(req.body)
    if (error )return res.status(200).json(result(0,error.details[0].message))

        //username exist
    const user = await User.findOne({
        username : req.body.username
    })
    if(!user)return res.status(200).json(result(0,'Your username is not Registered!'))

    //check password
    const validPw = await bcrypt.compare(req.body.password,user.password)
    if(!validPw) return res.status(200).json(result(0,'Your password incorrect!'))

    return res.status(200).json(result(1,'Login User Success!',user))
   
})
module.exports = router