const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
	username: {
		type : String
	},
	password: {
		type: String
	},
	email:{
        type : String,
        required:true,
        unique:true,
        match:/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	},
	user_type: {
		type:Number
	},
	status_holiday: {
		type:Boolean
	},
	tickets: [{
		type: Schema.Types.ObjectId,
		ref: "Ticket"
	}]
},{timestamps:true});

module.exports = mongoose.model("User", UserSchema);
