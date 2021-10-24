const mongoose = require('mongoose')
const passportLocalMogoose=require('passport-local-mongoose')
const {Schema}=mongoose

const userSchema=new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    }
})

userSchema.plugin(passportLocalMogoose);

module.exports=mongoose.model('User',userSchema)