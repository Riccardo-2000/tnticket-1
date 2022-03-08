import { User } from './User';
import { Category } from './Category';



export interface Ticket {

  _id?:string
  title?: string,
  customer_id?: User,
  customer_location?:string,
  external?:Boolean,
  description?: string,
  operator_id?: User,
  ticket_date?:string,
  category?: Category,
  priority?:string,
  status?:string,
  added_by?: User,
  ticket_time?: Array<string>,
  customer_sign?:string
  images?: Array<string>,
  note?: string,
  ticket_mode?:string,
  reminder?:Array<string>,
  log_delega?: Array<string>,
  ticket_reference_name?:string,
  ticket_reference_number?:Number,
  ticket_reference_location?:string,
  ticket_number?:Number,
  createdAt?:string,
  updatedAt?:string,
  minutes?:any
}
