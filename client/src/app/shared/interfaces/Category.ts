import { Ticket } from './Ticket';
export interface Category {

  _id?:String
  name?:String
  tickets?:Ticket[]
  createdAt? : string
  updatedAt? : string
}
