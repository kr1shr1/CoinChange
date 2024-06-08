const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
    groupCode:{
        type:String
    },
    userId:{
        type:String
    },
    members:{
        type:[String]
    },
    comments:{
        type:[Object]
    },
    title:{
        type:String
    },
    billSplit:{
        type:[Object]
    },
    simplifyDebt:{
        type:[Array]
    }
},{timestamps: true})

export default mongoose.model("Group",groupSchema)