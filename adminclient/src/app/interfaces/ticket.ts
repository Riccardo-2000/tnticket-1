import { Customer } from './customer';
import { User } from './user';
export interface Ticket {
  _id?:String
  title?: String,
  customer_id?: Customer,
  customer_location?:String,
  external?:Boolean,
  description?: String,
  operator_id?: User,
  ticket_date?:any,
  category?: String,
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
  ticket_fatturazione?:any
  ticket_number?:Number,
  work_time?:number
  createdAt?:Date,
  updatedAt?:Date,
  isChecked?:boolean
}
