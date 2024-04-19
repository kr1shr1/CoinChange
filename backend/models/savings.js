const mongoose = require('mongoose')

const savingSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true
    },
    targetAmt:{
        type:Number,
        required: true
    },
    currAmt:{
        type:Number,
        required: true
    },
    currency:{
        type:String,
    },
    title:{
        type:String
    }
},{timestamps: true}
)

module.exports = mongoose.model("Savings", savingSchema)