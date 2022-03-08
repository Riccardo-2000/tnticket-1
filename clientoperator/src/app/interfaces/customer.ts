import { Ticket } from './ticket';

export interface Customer {
    _id:String
    company_name:String
	company_reference:String
	company_locations: Array<String>,
	tickets:Array<Ticket>,
    category:Number,
	customer_disabled:boolean
    contract_hours:Number,
    contract_start : String,
    images:Array<File>
}
