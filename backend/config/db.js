const mongoose = require('mongoose');
require('dotenv').config()
const connect = ()=>{
    mongoose.connect('mongodb+srv://srikritarth:9412807859@kritarthcluster.4qqh9xt.mongodb.net/?retryWrites=true&w=majority&appName=KritarthCluster')
    .then(()=>{
        console.log("Database Connected...")
    })
    .catch((err)=>{
        console.log(err)
    })
}
module.exports = connect;