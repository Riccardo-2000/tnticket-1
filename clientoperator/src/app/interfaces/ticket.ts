import { User } from './user';
import { Customer } from './customer';
import { Category } from './Category';
export interface Ticket {
    _id?:String
    title?: String,
    customer_id?: Customer,
    customer_location?:String,
    external?:Boolean,
    description?: String,
    operator_id?: User,
    ticket_date?:String,
    category?: Category,
    priority?:String,
    status?:String,
    added_by?: String,
    ticket_time?: Array<String>,
    customer_sign?:String
    images?: Array<String>,
    note?: String,
    ticket_mode?:String,
    reminder?:Array<String>,
    log_delega?: Array<String>,
    ticket_reference_name?:String,
    ticket_reference_number?:Number,
    ticket_reference_location?:String,
    ticket_number?:Number,
    priorityOrder?:number,
    ticketOpening?:any,
    createdAt?:Date,
    updatedAt?:String,
    ticket_timer?: number
}
