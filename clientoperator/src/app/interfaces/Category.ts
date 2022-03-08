import { Ticket } from './ticket';

export interface Category {
    _id?:String
    name?:String
    tickets?:Ticket[]
}
