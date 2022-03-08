
import { Ticket } from './Ticket';


  export interface User {
    _id : string,
    username :  string;
    company_name: string;
    company_reference:string;
    company_number: Number[];
    company_locations: string[];
    tickets: Ticket[];
    category:Number;
    customer_disabled:Boolean;
    contract_hours:Number;
    contract_start:string;
    images?:string[];
    token : string
    password : string;
    createdAt? : string;
    updatedAt? : string;

  }
