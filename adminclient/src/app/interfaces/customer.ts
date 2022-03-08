import { Ticket } from './ticket';
export interface Customer {
  _id:String
  company_name?:String
  company_reference?:String
  company_number?:Array<Number>
  company_locations?: Array<String>,
  tickets?:Array<Ticket>,
  category?:Number,
  customer_disabled?:Boolean,
  contract_hours?:Number,
  contract_start?:any,
  contract_hoursToFatt?: number
  hoursOnSite:number,
  createdAt?:String,
  updatedAt?:String,
  hoursused?:Number,
  lastTicketDate?:Date
}
