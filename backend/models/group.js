const mongoose = require('mongoose')
const groupSchema = new mongoose.Schema({
    groupCode:{
        type:String,
    },
    userId:{
        type:String,//group creator
    },
    members:{
        type:[String],//userId of members
    },
    comments:{
        type:[Object],//userId and his/her message
    },
    title:{
        type:String,//group title
    },
    billSplit:{
        type:[Object]
    },
    simplifyDebt:{
        type:[Array]
    }
},{timestamps: true})

module.exports =  mongoose.model("Group",groupSchema)