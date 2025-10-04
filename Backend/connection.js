const mongoose = require('mongoose');

async function connectMongoDB(url){
mongoose.connect(url)
.then(() => console.log(`Connected to MongoDB Sucessfully`))
.catch((err) => console.log(`Failed to connect - ERR : ${err}`));
}

module.exports = {connectMongoDB};