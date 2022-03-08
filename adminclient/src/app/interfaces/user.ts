import { Ticket } from './ticket';
export interface User {
  _id:String
  username: String,
  password:String,
  email:String,
  user_type: Number
  status_holiday:Boolean
  hoursWorked?:Number
  lastMontTickets?:Number

  tickets:Array<Ticket>
}
