const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const CategorySchema = new mongoose.Schema({
    name : {
        type : String
    },
    tickets:[{
        type: Schema.Types.ObjectId,
        ref:'Ticket'
    }]
});


module.exports = mongoose.model("Category", CategorySchema);