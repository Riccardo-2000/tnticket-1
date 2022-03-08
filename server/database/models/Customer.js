const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const CustomerSchema = new mongoose.Schema({
	username : {
		type : String,
		unique:true,
	},
	company_name: {
        type:String,
        required:true
	},
	company_reference: {
		type:String
	},
	company_number: [],

	company_locations: [],
	
	tickets: [{
		type: Schema.Types.ObjectId,
		ref: "Ticket"
	}],
	token : {
		type : String
	},
    category:{
        type:Number,
        default:null,
        required:true
	},
	customer_disabled:{
		type:Boolean,
		default:false
	},
	contract_hours:{
		type : Number,
		default:null
	},
	contract_start:{
		type : String,
		default:null
	},
    images:{
        type:Array,
        default:null
	},
	password : {

		type:String
		
	}
},{timestamps:true});

module.exports = mongoose.model("Customer", CustomerSchema);
