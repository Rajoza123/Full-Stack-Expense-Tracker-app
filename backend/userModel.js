const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name :{
        type:String,
        required:[true,'name is required'],
    },
    email:{
        type:String,
        required:[true,'email is required and unique'],
        unique:true,
    },
    password:{
        type:String,
        required:[true,'password is required']
    }
},{timestamps:true})

const User = mongoose.model('expenseapps', userSchema);

module.exports = User