const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        trim:true
    },
    name:{
      type: String,
      required: true
    },
    password:{
        type:String,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    groups:{
        type:[String],
    },
    friends:{
        type:[String]
    },
    sentRequests:{
        type:[String]
    },
    receivedRequests:{
        type:[String]
    },
    inbox:{
        type:[String]
    },
    image:{
        type: String,
        default:null
    },
    badges:{
        type:[String]
    }
})


const User = mongoose.model('User', UserSchema);

module.exports = User;