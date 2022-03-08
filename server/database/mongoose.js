const mongoose = require('mongoose');

const CONNECTION_URL = "mongodb+srv://sadev-dbusr:salerno@sadev-mongodb.6hk0z.mongodb.net/tnticketapp";
//const CONNECTION_URL = "mongodb://tndev:sadev20@127.0.0.1:17182/tnticketapp";
mongoose.Promise = global.Promise;

mongoose.connect(CONNECTION_URL,
{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:true,
    useCreateIndex: true,
})
.then(() => {
    console.log("Connected To Db")
})
.catch((error)=> {
    console.log(error);
});

exports.module = mongoose;
