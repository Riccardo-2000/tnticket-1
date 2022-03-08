const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TicketSchema = new mongoose.Schema({
	title: {
		type:String
	},
	customer_id: {
		type: Schema.Types.ObjectId,
		ref: "Customer"
	},
	customer_location: {
		type:String
	},
	external:{
		type:Boolean
	},
	description: {
		type:String
	},
	operator_id: {
		type: Schema.Types.ObjectId,
		ref: "User",
		// default:null
	},
	ticket_date: {
		type:Date
	},
	category: {
		type: Schema.Types.ObjectId,
		ref: "Category"
	},
	priority:{
		type:String
	},
	status:{
		type: String
	},
	added_by: {
		type: Schema.Types.ObjectId,
		ref: "User"
	},
	ticket_time: [],
	customer_sign: {
		type:String
	},
	images: [],
	note: {
		type:String
	},
	ticket_mode:{
		type:String
	},
    reminder:[],
	log_delega: [],
	ticket_reference_name:{
		type:String,
		default:null
	},
	ticket_reference_number:{
		type:String,
		default:null
	},
	ticket_reference_location:{
		type:String,
		default:null
	},
	ticket_number : {
		type:Number,
		default:null
	},
	ticket_fatturazione : {
		type: String,
		default: null
	}
},{timestamps:true});

module.exports = mongoose.model("Ticket", TicketSchema);
