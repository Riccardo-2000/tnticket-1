require('dotenv').config();

const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const PORT = 4399;
const PRODUCTION = true;

const jwt = require('jsonwebtoken');
const checkAuth = require('./middlware/check-auth');

const sendTicket = require('./nodemailer/sendTicketEmail');
const sendTicketUpdate = require('./nodemailer/sendTicketEmailUpdate');



var https = require('https');
var fs = require('fs');
var cors = require('cors');
//var json2csv = require('json2csv');
var app = Express();
app.use(BodyParser.json({limit: '5mb'}));
app.use(BodyParser.urlencoded({ extended: true }));
var database, collection;
app.use(cors({
    origin: '*'
}));

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req,file,cb) {
        cb(null, './uploads/')
    },
    filename: function(req,file,cb){
        let date = new Date().toISOString().replace(/:/g, '-');
        cb(null,date+'-'+file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg' ) {
        cb(null,true);
    } else {
        cb(null,false);
    }

}

const upload = multer({
    storage:storage,
    limits:{
        fileSize:1024*1024*10,
    },
    fileFilter: fileFilter,
});
app.use('/uploads', Express.static('/home/marco/tnticketappws/uploads'));



const bcrypt = require('bcrypt');

if( PRODUCTION === true ){
    var privateKey = fs.readFileSync( '/etc/letsencrypt/live/ticket.tnsolutions.it/privkey.pem' );
    var certificate = fs.readFileSync( '/etc/letsencrypt/live/ticket.tnsolutions.it/fullchain.pem' );

    https.createServer({
                key: privateKey,
                 cert: certificate
    }, app).listen(PORT);
}
else {
    //  => Server
    app.listen(PORT,() => {
        console.log("Server Listening on Port : ", PORT);
    })
}
// => Require DB
const db = require("./database/mongoose");

//=> Models
const Ticket = require("./database/models/Ticket");
const User = require("./database/models/User");
const Customer = require("./database/models/Customer");
const Category = require("./database/models/Category");
const { find } = require("./database/models/Ticket");
const { FORMERR } = require("dns");


app.post('/signup', async(req,res) => {


    try {
        bcrypt.hash(req.body.password, 10 , (err,hash) => {

            if (err) {
                throw Error("Creazione Nuovo Utente Non Andata A Buon Fine")
            } else {
                const newUser = new User(req.body);

                newUser.password = hash;

                const token = jwt.sign({
                    email:newUser.email,
                    userId:newUser._id
                },
                `${process.env.TOKEN_SECRET_KEY}`,
                {
                    expiresIn:2629800000
                });

                newUser.token = token;
                newUser.save();

                res.status(200).json(newUser);
            }
        })
    } catch (error) {
        res.status(500).json({
            error : error
        })
    }



})

// => EndPointLogin
app.post('/login', async (req,res) => {
    console.log(req.body);
    try {

        const user = await User.findOne({email:req.body.email})
        if (!user) {
            throw Error ("Auth Failed")
        }

        const match = await bcrypt.compare(req.body.password, user.password);


        if(match) {
            //login
            console.log("match")
            const token = jwt.sign({
                email:user.email,
                userId:user._id
            },
            `secret`,
            {
                expiresIn:'72h'
            });
            user.token = token;
            return res.status(200).json({
                userId : user._id,
                message : 'Auth success',
                token : user.token
            })
        } else {
            res.status(401).json({
                message:'Auth Failed'
            })
        }

    } catch (error) {
        res.status(500).json({
            error : error
        })
    }
})

// => Ottiene tutti i ticket
app.get('/tickets',checkAuth,async(req,res) => {
    try {
        //const tickets = await Ticket.find({}).populate("added_by operator_id customer_id").sort({_id:-1})
        const tickets = await Ticket.find({}).limit(500).sort({_id:-1}).populate('customer_id')
	if (!tickets) {
            throw Error("Nessun Ticket Trovato")
        }
        res.status(200).json(tickets)
    } catch (error) {
        res.status(500).json({
            error : error
        })
    }
})
//=> Crea Nuovo Ticket
app.post('/tickets',checkAuth,upload.array('images[]', 10), async(req,res) => {
    if (req.body.operator_id == "null") {
        req.body.operator_id = null
    }
    console.log( req.body );
    const files = req.files;
    const newTicket = new Ticket(req.body);
    //console.log( newTicket );
    const customerRelated = req.body.customer_id;
    const ticketCategory = req.body.category;
    const tech = req.body.operator_id;

    let parsed_ticket_time = [];
//console.log( req.body.ticket_time.length );
    if( req.body.ticket_time == "" ){
	newTicket.ticket_time = [];
    } else {
	parsed_ticket_time = JSON.parse( req.body.ticket_time );
//console.log( parsed_ticket_time );
	newTicket.ticket_time = parsed_ticket_time;
    }
    //console.log( parsed_ticket_time );
//return;
    //if( req.body.ticket_time.length > 0 ) {
    //	const parsed_ticket_time = JSON.parse( req.body.ticket_time );
    //} else {
//	const parsed_ticket_time = [];
  //  }
    //const ticket_time_parsed = JSON.parse( req.body.ticket_time );
    //console.log( ticket_time_parsed );
    try {
//console.log( "try" );
        /*for (let i = 0; i < ticket_time_parsed.length; i++) {
            console.log( req.body.ticket_time[i] );
            const element =  JSON.parse( ticket_time_parsed[i] );
            console.log( element );
            parsed_ticket_time.push( element );
        }*/
        for (let i=0; i< req.files.length; i++) {
            const filePath = 'https://ticket.tnsolutions.it:4399/'+req.files[i].path;
            newTicket.images.push(filePath)
            console.log(newTicket);
        }
        const lastTicket = await Ticket.findOne({}).sort({_id:-1});
        newTicket.ticket_number = lastTicket.ticket_number+1;
        newTicket.ticket_time = parsed_ticket_time;
        const ticket = await newTicket.save();
	//console.log( ticket );
        if (!ticket) {
            throw Error("Creazione Ticket Fallita")
        }
        if (ticketCategory) {
            console.log(ticketCategory);
            const findCategory = await Category.findById(ticketCategory)
            findCategory.tickets.push(ticket);
            await findCategory.save();
        }
        if (customerRelated) {
            console.log(customerRelated);
            const findCustomer = await Customer.findById(customerRelated)
            console.log(findCustomer);
            console.log(ticket);
            findCustomer.tickets.push(ticket);
            await findCustomer.save();
        }
        if (tech == "null") {
            ticket.operator_id = null
            console.log("Ciao");
            const findTech = await User.findById(tech)
            findTech.tickets.push(ticket)
            await findTech.save();
        }

        const ticketEmail = await Ticket.findById(ticket._id).populate("added_by","username").populate("operator_id","username _id").populate("customer_id","company_name _id").populate("category","name _id");
        
        //console.log(ticketEmail);

        sendTicket(ticketEmail);
        res.status(200).json(ticket)
    } catch (error) {
        res.status(500).json({
            error : error
        })
    }
})
//=> Ottiene specifico Ticket
app.get('/ticket/:ticketId',checkAuth,async(req,res) => {
    try {
        const ticket = await Ticket.findById(req.params.ticketId).populate("added_by","username").populate("operator_id","username _id").populate("customer_id","company_name _id").populate("category","name _id")
        if (!ticket) {
            throw Error("Ticket non Trovato")
        }
        res.status(200).json(ticket);
    } catch (error) {
        res.status(500).json({
            error : error
        })
    }
})
//=> Ottiene Ticket Di Specifico Tecnico
app.get('/ticketsbytech/:techId',checkAuth, async(req,res) => {
    try {
        const allTickets = await Ticket.find({}).populate("added_by customer_id").sort({_id:-1})
        if (!allTickets) {
            throw Error("Ticket non Trovato")
        }
        const ticketByTech = allTickets.filter(ticket => ticket.operator_id != null && ticket.operator_id == req.params.techId && ticket.status != "Risolto" );
        res.status(200).json(ticketByTech);
    } catch (error) {
        res.status(500).json({
            error : error
        })
    }
})
// => Update Specifico Ticket Images
app.post('/ticketupdateimage/:ticketId',checkAuth, async(req,res) => {
    try {
        const ticketToUpdate = await Ticket.findByIdAndUpdate({_id:req.params.ticketId},{$set:req.body})
        console.log(ticketToUpdate);
        if (!ticketToUpdate) {
            throw Error("Ticket non Trovato")
        }
        await ticketToUpdate.save();
        res.status(200).json(ticketToUpdate);
    } catch (error) {
        res.status(500).json({
            error : error
        })
    }
})

// => Update Specifico Ticket
app.post('/tickets/:ticketId',checkAuth, async(req,res) => {
    try {
        console.log(req.body.external);
        const ticketToUpdate = await Ticket.findById({_id:req.params.ticketId})

        if (!ticketToUpdate) {
            throw Error("Ticket non Trovato")
        }
        if ( req.body.operator_id && ( req.body.operator_id != ticketToUpdate.operator_id ) ) {
            const operatorToAssign = await User.findById({_id:req.body.operator_id})
            operatorToAssign.tickets.push(req.params.ticketId);
            let delegaLog = {
                date : Date.now(),
                techSend : null,
                techReceive : req.body.operator_id
            };
            ticketToUpdate.log_delega.push( delegaLog );
            await operatorToAssign.save()
        }
        ticketToUpdate.external = req.body.external;
        console.log( ticketToUpdate.external );
        await Ticket.updateOne({_id:req.params.ticketId},{$set:req.body});
        //ticketToUpdate.status = req.body.status;
        //await ticketToUpdate.save();
        // sendTicketUpdate(ticketToUpdate);
        res.status(200).json(ticketToUpdate);
    } catch (error) {
        res.status(500).json({
            error : error
        })
    }
})

// => Update Signature And Status 

app.post("/ticket/loadsignature/:ticketId", async(req,res) => {


    try {
        
        const ticketToLoadSign = await Ticket.findById(req.params.ticketId);

        if (!ticketToLoadSign) {
            throw Error('Ticket Non Trovato')
        }


        ticketToLoadSign.customer_sign = req.body.customer_sign;
        ticketToLoadSign.status = "Risolto"

        await ticketToLoadSign.save();

        res.status(200).json(ticketToLoadSign);
    } catch (error) {
        
        res.status(500).json({
            error : error
        })

    }


})




//=> Send ticket Reminder
app.post('/tickets/reminder/:ticketId',checkAuth, async(req,res) => {
    try {
        const ticket = await Ticket.findById({_id:req.params.ticketId})
        if (!ticket) {
            throw Error("Ticket non Trovato")
        }
        ticket.reminder.push(req.body)
        await ticket.save()
        res.status(200).json(ticket)
    } catch (error) {
        res.status(500).json({
            error : error
        })
    }
})

//=> Delega Specifico Ticket
app.post('/ticket/delega/:ticketId',checkAuth, async(req,res) => {
    try {
        const ticketDelegato = await Ticket.findById({_id:req.params.ticketId})
        //console.log(ticketDelegato.operator_id);
        //console.log( req.body.techSend );
        //console.log( req.body.techReceive );
        if (!ticketDelegato) {
            throw Error("Ticket da delegare non trovato")
        }
        const techToDelega = await User.findById({_id:req.body.techReceive});
        console.log(techToDelega);
        techToDelega.tickets.push(ticketDelegato);
        if (!techToDelega) {
            throw Error("Tecnico da delegare non trovato")
        }
        //const techSendDelega = await User.findById({_id:req.body.techSend})
        const techSendDelega = await User.findById({_id:ticketDelegato.operator_id});
        if (techSendDelega.tickets.includes(req.params.ticketId)) {
            techSendDelega.tickets.remove(req.params.ticketId)
        }
        let delegaLog = {
            date : Date.now(),
            techSend : ticketDelegato.operator_id,
            techReceive : req.body.techReceive
        }
        ticketDelegato.operator_id = req.body.techReceive;
        ticketDelegato.log_delega.push(delegaLog);
        await ticketDelegato.save();
        await techToDelega.save();
        await techSendDelega.save();
        res.status(200).json(ticketDelegato);
    } catch (error) {
        res.status(500).json({
            error : error
        })
    }
})



// => Delete Specifico Ticket
app.delete('/tickets/:ticketId',checkAuth, async(req,res) => {
    try {
        const ticket = await Ticket.findByIdAndDelete({_id:req.params.ticketId})
        console.log(ticket);
        if (!ticket) {
            throw Error("Ticket non Trovato")
        }
        const customer = await Customer.findById({_id:ticket.customer_id})
        console.log(customer);
        if (customer.tickets.includes(req.params.ticketId)) {
            customer.tickets.remove(req.params.ticketId);
            await customer.save()
        }
        if( ticket.operator_id ){
        	const tech = await User.findById({_id:ticket.operator_id})
        	if (tech.tickets.includes(req.params.ticketId)) {
            		tech.tickets.remove(req.params.ticketId)
        	}
        	await tech.save()
	}

        res.status(200).json({
            success : true
        });
    } catch (error) {
        res.status(500).json({
            error : error
        })
    }
})

// => Ricerca Ticket
app.get('/tickets/search/:term',checkAuth, async(req,res) => {
    try {
        const ticket = await Ticket.find({ $or: [ { title: {$regex: ".*" + req.params.term + ".*", $options: "i" } }, { description: {$regex: ".*" + req.params.term + ".*", $options: "i" } } ]  }).populate("added_by operator_id customer_id ")
        if (!ticket) {
            throw Error("Nessun Ticket Trovato")
        }
        res.status(200).json(ticket)
    } catch (error) {
        res.status(500).json({
            error : error
        })
    }
})

// => Ricerca Ticket Data
app.post('/ticketsbydate',checkAuth, async(req,res) => {
    try {
        const ticketToFind = await Ticket.find({ticket_date:{ $gte:new Date(req.body.dateOne).toISOString(), $lt:new Date(req.body.dateTwo).toISOString()}}).populate("added_by operator_id customer_id ")
        console.log(ticketToFind);
        if (!ticketToFind) {
            throw Error("Nessun Ticket Trovato")
        }
        res.status(200).json(ticketToFind)
    } catch (error) {
        res.status(500).json({
            error : error
        })
    }
})
// => Ottiene ticket con status diverso da Risolto ma non ancora Assegnati ad un tecnico
app.get('/tickets/notworking',checkAuth, async(req,res) => {
    try {
        const ticketsNotWorking = await Ticket.find({}).populate("operator_id","username _id").populate("customer_id","company_name _id").populate("added_by","username _id").sort({_id:-1})
        if (!ticketsNotWorking) {
            throw Error("Nessun Ticket Trovato")
        }
        console.log("Not Filtered Yet");
        const ticketsAvailables = ticketsNotWorking.filter(ticket => ticket.status != "Risolto" && !ticket.operator_id)
        console.log("Filtered");
        console.log(ticketsAvailables);
        res.status(200).json(ticketsAvailables)
    } catch (error) {
        res.status(500).json({
            error : error
        })
    }
})
// => Ottiene ticket con status diverso da Risolto e con Operator_id Diverso Da Null
app.get('/tickets/working',checkAuth, async(req,res) => {
    try {
        const ticketsWorking = await Ticket.find({}).populate("operator_id","username _id").populate("customer_id","company_name _id").populate("added_by","username _id").sort({_id:-1})
        if (!ticketsWorking) {
            throw Error("Nessun Ticket Trovato")
        }
        const ticketFiltered = ticketsWorking.filter(ticket => ticket.status != "Risolto" && ticket.operator_id)
        res.status(200).json(ticketFiltered)
    } catch (error) {
        res.status(500).json({
            error : error
        })
    }
})




// => Ottiene tutti gli utenti
app.get('/users',checkAuth, async(req,res) => {
    try {
        const users = await User.find({}).populate("tickets")
        if (!users) {
            throw Error("Nessun Utente Trovato")
        }
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({
            error : error
        })
    }
})

//=> Ottiene Tutti i Tecnici
app.get('/users/tech',checkAuth, async(req,res) => {
    try {
        const techs = await User.find({user_type : 2}).populate("tickets")
        if (!techs) {
            throw Error("Nessun Tecnico Trovato")
        }
        res.status(200).json(techs)
    } catch (error) {
        res.status(500).json({
            error : error
        })
    }
})
//=> Creazione Nuovo Utente
app.post('/user',checkAuth, async(req,res) => {
    const newUser = new User(req.body)
    console.log(newUser);
    try {
        console.log(newUser);
        if (!newUser) {
            throw Error("Nuovo Utente Non Creato")
        }
        const userCreated = await newUser.save()
        res.status(200).json(userCreated)
    } catch (error) {
        res.status(500).json({
            error : error
        })
    }
})
//=> Update Specifico Utente
app.post('/user/:userId',checkAuth, async(req,res) => {
    try {
        const userToUpdate = await User.findById(req.params.userId);

        if (!userToUpdate) {
            throw Error("Non è stato possibile aggiornare l'utente ")
        }

        if (req.body.password) {
            bcrypt.hash(req.body.password, 10 , async(err,hash) =>   {

                userToUpdate.password = hash;
                userToUpdate.username = req.body.username;
                await userToUpdate.save();

                res.status(200).json({
                    success : true
                });

            })
        }
        userToUpdate.password = userToUpdate.password;
        userToUpdate.username = req.body.username;
        await userToUpdate.save();
        res.status(200).json({
            success : true
        });

    } catch (error) {
        res.status(500).json({
            error : error
        })
    }
});

//=> Delete Specifico Utente
app.delete('/user/:userId',checkAuth, async(req,res) => {
    try {
        const userToUpdate = await User.findByIdAndDelete({_id:req.params.userId})
        if (!userToUpdate) {
            throw Error("Non è stato possibile eliminare l'utente ")
        }
        res.status(200).json({
            success:true
        })
    } catch (error) {
        res.status(500).json({
            error : error
        })
    }
})

//=> Ottiene Specifico utente
app.get('/user/:userId',checkAuth, async(req,res) => {
    try {
        const userToFind = await User.findById({_id : req.params.userId}).populate("tickets","customer_id"); 
        if (!userToFind) {
            throw Error("Non è stato possibile trovare l'utente ")
        }
        res.status(200).json(userToFind)
    } catch (error) {
        res.status(500).json({
            error : error
        })
    }
})
//=> Ottiene ticket di Specifico utente Sort -1
app.get('/user/latest/:userId',checkAuth, async(req,res) => {
    try {
        const userToFind = await User.findById({_id : req.params.userId}).populate({path : "tickets",options: { sort: {_id:-1}}, populate:{path : "customer_id"} })
        if (!userToFind) {
            throw Error("Non è stato possibile trovare l'utente ")
        }
        res.status(200).json(userToFind)
    } catch (error) {
        res.status(500).json({
            error : error
        })
    }
})
//=> Ottiene tutti i clienti
app.get("/customers",checkAuth, async(req,res) => {
    try {
        const customersToFind = await Customer.find({}).populate("tickets");
        //const customersToFind = await Customer.find({});
        if (!customersToFind) {
            throw Error("Non è stato possibile trovare i clienti");
        }
        res.status(200).json(customersToFind)
    } catch (error) {
        res.status(500).json({
            error : error
        })
    }
})
//=> Crea Nuovo Cliente
app.post("/customers",checkAuth, upload.array('images[]', 10),async(req,res) => {
    const files = req.files;
    console.log(files);
    console.log( req.body );
    const customerToSave = new Customer(req.body);

    try {
        console.log("ciao")
        if (files) {
            for (let i=0; i< req.files.length; i++) {
                const filePath = 'http://localhost:5000/'+req.files[i].path;
                customerToSave.images.push(filePath)
                console.log(customerToSave);
            }
        }
        await customerToSave.save();
        console.log('Qui 1');
        if (!customerToSave) {
            throw Error("Non è stato possibile creare un nuovo cliente");
        }
        res.status(200).json(customerToSave)
    } catch (error) {
        res.status(500).json({
            error : error
        })
    }
})

//=> Ottiene Specifico Cliente
app.get("/customer/:customerId",checkAuth, async(req,res) => {
    try {
        const customerToFind = await Customer.findById({_id : req.params.customerId}).populate("tickets")
        if (!customerToFind) {
            throw Error("Non è stato possibile trovare il cliente");
        }
        res.status(200).json(customerToFind)
    } catch (error) {
        res.status(500).json({
            error : error
        })
    }
})

//=> Update Specifico Cliente
app.post("/customer/:customerId",upload.array('images[]' , 10),checkAuth, async(req,res) => {

    const files = req.files

    try {

        console.log(req.body);
        console.log("Ciao")
        const customerToUpdate = await Customer.findByIdAndUpdate({_id:req.params.customerId}, {$set:req.body})
        // console.log(customerToUpdate);
        if (!customerToUpdate) {
            throw Error("Non è stato possibile aggiornare il cliente");
        }
        if (files) {
            for (let i=0; i< req.files.length; i++) {

                const filePath = 'http://localhost:5000/'+req.files[i].path;

                customerToUpdate.images.push(filePath);

                console.log(customerToUpdate);

                await customerToUpdate.save();
            }
        }
        res.status(200).json({
            success:true
        })
    } catch (error) {
        res.status(500).json({
            error : error
        })
    }
})


app.delete("/customer/:customerId",checkAuth, async(req,res) => {
    try {
        const customerToDelete = await Customer.findByIdAndDelete({_id:req.params.customerId})
        if (!customerToDelete) {
            throw Error("Non è stato possibile eliminare il cliente");
        }
        res.status(200).json({
            success:true
        })
    } catch (error) {
        res.status(500).json({
            error : error
        })
    }
})
//=>Ricerca per clienti
app.get('/customers/search/:term',checkAuth, async(req,res) => {
    try {
        const customerToFind = await Customer.find({ company_name: {$regex: ".*" + req.params.term + ".*", $options: "i" }})
        if (!customerToFind) {
            throw Error("Non è stato possibile trovare il cliente");
        }
        res.status(200).json(customerToFind)
    } catch (error) {
        res.status(500).json({
            error : error
        })
    }
})


app.post('/customers/block/:customerId',checkAuth, async(req,res) => {
    try {
        const customerToBlock = await Customer.findById({_id: req.params.customerId})

        if (!customerToBlock) {
            throw Error("Ticket non Trovato")
        }
        console.log(customerToBlock);
        if (customerToBlock.customer_disabled != null) {
            customerToBlock.customer_disabled = req.body.customer_disabled
            console.log(customerToBlock.customer_disabled);
        }
        // console.log(req.body);
        await customerToBlock.save()
        console.log("salvato");
        res.status(200).json(customerToBlock)
    } catch (error) {
        res.status(500).json({
            error : error
        })
    }
})

//=>Get all categories
app.get('/categories',checkAuth, async(req,res) => {
    try {
        const categories = await Category.find({}).populate("tickets");
        if (!categories) {
            throw Error("Nessuna Categoria Trovata");
        }
        res.status(200).json(categories)
    } catch (error) {
        res.status(500).json({
            error : error
        })
    }
})

app.get("/statuses",checkAuth,  (request, response) => {
    statuses = {"statuses": [
        "In attesa di tecnico",
        "In Pausa",
        "In lavorazione",
        "In attesa di cliente",
        "Risolto"
    ]};
    response.send( statuses );
});

app.post('/ticketsbydatecsv', async(req,res) => {
    try {
        const ticketToFind = await Ticket.find({ticket_date:{ $gte:new Date(req.body.dateOne).toISOString(), $lte:new Date(req.body.dateTwo).toISOString()}}).populate("added_by operator_id customer_id ")
        console.log(ticketToFind);
        if (!ticketToFind) {
            throw Error("Nessun Ticket Trovato")
        }
        /*var fields = ['title'];
        var fieldNames = ['Titolo'];
        var data = json2csv({ data: ticketToFind, fields: fields, fieldNames: fieldNames });
        //var data = json2csv({ data: ticketToFind });
        res.attachment('filename.csv');*/
        res.status(200).send(ticketToFind);
    } catch (error) {
        res.status(500).json({
            error : error
        })
    }
})


app.post('/ticketsmassive',upload.array('images[]', 10), async(req,res) => {
    if (req.body.operator_id == "null") {
        req.body.operator_id = null
    }
    console.log( req.body );
    //const files = req.files;
    const newTicket = new Ticket(req.body);
    //console.log( newTicket );
    const customerRelated = req.body.customer_id;
    const ticketCategory = req.body.category;
    const tech = req.body.operator_id;
    try {
        //console.log( "try" );
        /*for (let i = 0; i < ticket_time_parsed.length; i++) {
            console.log( req.body.ticket_time[i] );
            const element =  JSON.parse( ticket_time_parsed[i] );
            console.log( element );
            parsed_ticket_time.push( element );
        }*/
        /*for (let i=0; i< req.files.length; i++) {
            const filePath = 'https://tn.salernodev.com:5000/'+req.files[i].path;
            newTicket.images.push(filePath)
            console.log(newTicket);
        }*/
        //const lastTicket = await Ticket.findOne({}).sort({_id:-1});
        newTicket.ticket_number = req.body.ticket_number;
        newTicket.ticket_time = [];
        console.log( newTicket );
        const ticket = await newTicket.save();
        //console.log( ticket );
        if (!ticket) {
            throw Error("Creazione Ticket Fallita")
        }
        if (ticketCategory) {
            //console.log(ticketCategory);
            const findCategory = await Category.findById(ticketCategory)
            findCategory.tickets.push(ticket);
            await findCategory.save();
        }
        if (customerRelated) {
            //console.log(customerRelated);
            const findCustomer = await Customer.findById(customerRelated)
            //console.log(findCustomer);
            //console.log(ticket);
            findCustomer.tickets.push(ticket);
            await findCustomer.save();
        }
        const findTech = await User.findById(tech)
        findTech.tickets.push(ticket)
        await findTech.save();
        res.status(200).json(ticket)
    } catch (error) {
        res.status(500).json({
            error : error
        })
    }
})

//// => Customers Area


app.post('/customerarea/login' , async(req,res) => {

    try {
        
        //const customerToFindByUsername = await Customer.findOne({username : req.body.username})
        //.populate({path : 'tickets operator_id added_by ' , populate : { path : 'operator_id category added_by' } } ).slice('tickets', -100);
    //const customerToFindByUsername = await Customer.findOne({username: req.body.username});
        const customerToFindByUsername = await Customer.findOne({username : req.body.username});

        if (!customerToFindByUsername) {

            throw Error('Cliente Non Trovato');
            
        }
        //customerToFindByUsername.tickets = [...customerToFindByUsername.tickets.slice(0,1)]


        const match = await bcrypt.compare(req.body.password, customerToFindByUsername.password);


        if(match) {
            //login

            const token = jwt.sign({
                email:customerToFindByUsername.email,
                userId:customerToFindByUsername._id
            },
            `secret`,
            {
                expiresIn:'72h'
            });
            //console.log( customerToFindByUsername.contract_start );
            if( customerToFindByUsername.contract_start ){
                let current_contract_start = customerToFindByUsername.contract_start.split("-");
                let current_year = new Date().getFullYear();
                let last_year =  current_year - 1;
                current_contract_start = new Date(current_year+"-"+current_contract_start[1]+"-"+current_contract_start[0]).toISOString();
                //console.log( customerToFindByUsername.contract_start );
                const ticketsToFind = await Ticket.find({ customer_id: customerToFindByUsername._id, ticket_date: { $gte: current_contract_start } }).sort( { ticket_date: -1 } ).populate("added_by", "username").populate("operator_id","username").populate("category","name");
                //console.log( ticketsToFind );
                customerToFindByUsername.token = token;
                console.log( ticketsToFind );
                customerToFindByUsername.tickets = ticketsToFind;
            }else {
                const ticketsToFind = await Ticket.find({ customer_id: customerToFindByUsername._id /*, operator_id: { $ne: "5fc8d9d35892ccde65f78069" }*/ }).sort( { ticket_date: -1 } ).limit(100).populate("added_by", "username").populate("operator_id","username").populate("category","name");
                customerToFindByUsername.token = token;
                console.log( ticketsToFind );
                customerToFindByUsername.tickets = ticketsToFind;
                //console.log( customerToFindByUsername );
            }
            //console.log( customerToFindByUsername.tickets.length );

            return res.status(200).json(customerToFindByUsername);

        } else {
            res.status(401).json({
                message:'Auth Failed'
            })
        }
    } catch (error) {

        res.status(500).json({
            error : error
        })
        
    }


})

app.get('/customerarea/reload/:userId/:old' , async(req,res) => {


    try {
        
        console.log("userToReload")
        let get_old = req.params.old;
        console.log( get_old );
        const userToReload = await Customer.findById(req.params.userId);
        let current_id = userToReload._id;
        let standex_merge = ["5fc7ae83da73ed763c4820e7","5fa2901ba7284e025f8763c8"];
        let piazza_rosa_merge = ["5f855378f3eac7025eb2e21d","5f7c2d2dee94c5025871d208"];
        let cristeyns_merge = ["5fc5322bda73ed763c482075","5fd8a00b410fdb03a5f55684"];
        if( standex_merge.includes(req.params.userId) ){
            console.log( "standex" );
            current_id = standex_merge;
            //console.log( current_id );
        }
        else if( piazza_rosa_merge.includes(req.params.userId) ){
            console.log( "piazza rosa" );
            current_id = piazza_rosa_merge;
            //console.log( current_id );
        }
        else if( cristeyns_merge.includes(req.params.userId) ){
            console.log( "cristeyns" );
            current_id = cristeyns_merge;
            //console.log( current_id );
        }
	//.populate({path : 'tickets operator_id added_by ' , populate : { path : 'operator_id category added_by' } } ).slice('tickets', -100);

        if (!userToReload) {
            throw Error('User Non Trovato')
        }

        //console.log("userToReload");
        //const userTicket = userToReload.tickets = [...userToReload.tickets.slice(0,100)];
        if( userToReload.contract_start ){
                let current_contract_start = userToReload.contract_start.split("-");
                let current_year = new Date().getFullYear();
                let last_year =  current_year - 1;
                let current_date = new Date().getTime();
                let current_date_custom = new Date(current_year+"-"+current_contract_start[1]+"-"+current_contract_start[0]).getTime();
                let date_diff = current_date - current_date_custom;
                //console.log( current_date );
                //console.log( current_date_custom );
                if( current_date > current_date_custom ){
                    current_contract_start = new Date(current_year+"-"+current_contract_start[1]+"-"+current_contract_start[0]).toISOString();
                    if( get_old == "false" ){
                        const ticketsToFind = await Ticket.find({ customer_id: current_id, ticket_date:{ $gte:current_contract_start} /*, operator_id: { $ne: "5fc8d9d35892ccde65f78069" }*/ }).sort( { ticket_date: -1 } ).populate("added_by", "username").populate("operator_id","username").populate("category","name");
                        const userTicket = ticketsToFind;
                        res.status(200).json(userTicket)
                    }
                    else {
                        const ticketsToFind = await Ticket.find({ customer_id: current_id, ticket_date:{ $lt:current_contract_start} /*, operator_id: { $ne: "5fc8d9d35892ccde65f78069" }*/ }).sort( { ticket_date: -1 } ).populate("added_by", "username").populate("operator_id","username").populate("category","name");
                        const userTicket = ticketsToFind;
                        res.status(200).json(userTicket)
                    }
                    //console.log( ticketsToFind );
                    
                    
                }
                else {
                    //console.log( "here" );
                    if( get_old == "false" ){
                        let current_contract_start_lastyear = new Date(last_year+"-"+current_contract_start[1]+"-"+current_contract_start[0]).toISOString();
                        let current_contract_end = new Date(current_year+"-"+current_contract_start[1]+"-"+current_contract_start[0]).toISOString();
                        const ticketsToFind = await Ticket.find({ customer_id: current_id, ticket_date:{ $gte: current_contract_start_lastyear, $lt: current_contract_end} /*, operator_id: { $ne: "5fc8d9d35892ccde65f78069" }*/ }).sort( { ticket_date: -1 } ).populate("added_by", "username").populate("operator_id","username").populate("category","name");
                        //console.log( ticketsToFind );
                        const userTicket = ticketsToFind;
                        res.status(200).json(userTicket);
                    }
                    else {
                       last_year = last_year - 1;
                       current_year = current_year - 1;
                       let current_contract_start_lastyear = new Date(last_year+"-"+current_contract_start[1]+"-"+current_contract_start[0]).toISOString();
                        let current_contract_end = new Date(current_year+"-"+current_contract_start[1]+"-"+current_contract_start[0]).toISOString();
                        const ticketsToFind = await Ticket.find({ customer_id: current_id, ticket_date:{ $gte: current_contract_start_lastyear, $lt: current_contract_end} /*, operator_id: { $ne: "5fc8d9d35892ccde65f78069" }*/ }).sort( { ticket_date: -1 } ).populate("added_by", "username").populate("operator_id","username").populate("category","name");
                        //console.log( ticketsToFind );
                        const userTicket = ticketsToFind;
                        res.status(200).json(userTicket); 
                    }
                }
            }
        else {
            const ticketsToFind = await Ticket.find({ customer_id: current_id /*, operator_id: { $ne: "5fc8d9d35892ccde65f78069" }*/ }).sort( { ticket_date: -1 } ).limit(100).populate("added_by", "username").populate("operator_id","username").populate("category","name");
            const userTicket = ticketsToFind;
            res.status(200).json(userTicket)
        }

    } catch (error) {
        
        res.status(500).json({
            error : error
        })

    }


})


app.post('/dash/customer/credentials/:customerId' , async(req,res) => {


    try {
        
        const findCustomer = await Customer.findById(req.params.customerId);

        if (!findCustomer) {

            throw Error('Cliente Non Trovato')

        }
        bcrypt.hash(req.body.password, 10 , (err,hash) => {

            if (err) {
                throw Error("Creazione Nuovo Utente Non Andata A Buon Fine")
            } else {

                findCustomer.password = hash;

                if( req.body.username ){
                    findCustomer.username = req.body.username;
                }
                //console.log("ciao")

                findCustomer.save();

                res.status(200).json(findCustomer);
            }
        })


    } catch (error) {
        
        res.status(500).json({
            error : error
        })

    }


    
})


app.get("/dashboardcustomers",checkAuth, async(req,res) => {
    try {
        const customersToFind = await Customer.find({ }, { company_name : 1, contract_start: 1, contract_hours: 1 });
        //const customersToFind = await Customer.find({});
        if (!customersToFind) {
            throw Error("Non è stato possibile trovare i clienti");
        }
        res.status(200).json(customersToFind)
    } catch (error) {
        res.status(500).json({
            error : error
        })
    }
})


app.post("/fatturazione/:ticketId", async( req, res ) => {
   try {
        console.log( req.body );
        const ticketToUpdate = await Ticket.findByIdAndUpdate({_id:req.params.ticketId},{$set:req.body})
        console.log(ticketToUpdate);
        if (!ticketToUpdate) {
            throw Error("Ticket non Trovato")
        }
        await ticketToUpdate.save();
        res.status(200).json(ticketToUpdate);
    } catch (error) {
        res.status(500).json({
            error : error
        })
    }
})


app.get('/dashboardcustomers/reload/:userId/:old' , async(req,res) => {


    try {
        
        console.log("userToReload")
        let get_old = req.params.old;
        console.log( get_old );

        const userToReload = await Customer.findById(req.params.userId);
        let current_id = "";
        let standex_merge = ["5fc7ae83da73ed763c4820e7","5fa2901ba7284e025f8763c8"];
        let piazza_rosa_merge = ["5f855378f3eac7025eb2e21d","5f7c2d2dee94c5025871d208"];
        let cristeyns_merge = ["5fc5322bda73ed763c482075","5fd8a00b410fdb03a5f55684"];
        if( standex_merge.includes(req.params.userId) ){
            console.log( "standex" );
            current_id = standex_merge;
            //console.log( current_id );
        }
        else if( piazza_rosa_merge.includes(req.params.userId) ){
            console.log( "piazza rosa" );
            current_id = piazza_rosa_merge;
            //console.log( current_id );
        }
        else if( cristeyns_merge.includes(req.params.userId) ){
            console.log( "cristeyns" );
            current_id = cristeyns_merge;
            //console.log( current_id );
        }
        else {
            current_id = userToReload._id;
        }
        //.populate({path : 'tickets operator_id added_by ' , populate : { path : 'operator_id category added_by' } } ).slice('tickets', -100);

        if (!userToReload) {
            throw Error('User Non Trovato')
        }

        //console.log("userToReload");
        //const userTicket = userToReload.tickets = [...userToReload.tickets.slice(0,100)];
        if( userToReload.contract_start ){
                let current_contract_start = userToReload.contract_start.split("-");
                let current_year = new Date().getFullYear();
                let last_year =  current_year - 1;
                let current_date = new Date().getTime();
                let current_date_custom = new Date(current_year+"-"+current_contract_start[1]+"-"+current_contract_start[0]).getTime();
                let current_contract_start_lastyear = new Date(last_year+"-"+current_contract_start[1]+"-"+current_contract_start[0]).toISOString();
                let date_diff = current_date - current_date_custom;
                //console.log( current_date );
                //console.log( current_date_custom );
                if( current_date > current_date_custom ){
                    current_contract_start = new Date(current_year+"-"+current_contract_start[1]+"-"+current_contract_start[0]).toISOString();
                    if( get_old == "false" ){
                        const ticketsToFind = await Ticket.find({ customer_id: current_id, ticket_date:{ $gte:current_contract_start} /*, operator_id: { $ne: "5fc8d9d35892ccde65f78069" }*/ }).sort( { ticket_date: 1 } ).populate("added_by", "username").populate("operator_id","username").populate("category","name");
                        const userTicket = ticketsToFind;
                        res.status(200).json(userTicket)
                    }
                    else {
                        //console.log( "here" );
                        const ticketsToFind = await Ticket.find({ customer_id: current_id, ticket_date:{ $gte:current_contract_start_lastyear, $lt:current_contract_start} /*, operator_id: { $ne: "5fc8d9d35892ccde65f78069" }*/ }).sort( { ticket_date: 1 } ).populate("added_by", "username").populate("operator_id","username").populate("category","name");
                        const userTicket = ticketsToFind;
                        res.status(200).json(userTicket)
                    }
                    //console.log( ticketsToFind );
                    
                    
                }
                else {
                    //console.log( "here" );
                    if( get_old == "false" ){
                        let current_contract_end = new Date(current_year+"-"+current_contract_start[1]+"-"+current_contract_start[0]).toISOString();
                        const ticketsToFind = await Ticket.find({ customer_id: current_id, ticket_date:{ $gte: current_contract_start_lastyear, $lt: current_contract_end} /*, operator_id: { $ne: "5fc8d9d35892ccde65f78069" }*/ }).sort( { ticket_date: 1 } ).populate("added_by", "username").populate("operator_id","username").populate("category","name");
                        //console.log( ticketsToFind );
                        const userTicket = ticketsToFind;
                        res.status(200).json(userTicket);
                    }
                    else {
                       last_year = last_year - 1;
                       current_year = current_year - 1;
                       let current_contract_start_lastyear = new Date(last_year+"-"+current_contract_start[1]+"-"+current_contract_start[0]).toISOString();
                        let current_contract_end = new Date(current_year+"-"+current_contract_start[1]+"-"+current_contract_start[0]).toISOString();
                        const ticketsToFind = await Ticket.find({ customer_id: current_id, ticket_date:{ $gte: current_contract_start_lastyear, $lt: current_contract_end} /*, operator_id: { $ne: "5fc8d9d35892ccde65f78069" }*/ }).sort( { ticket_date: 1 } ).populate("added_by", "username").populate("operator_id","username").populate("category","name");
                        //console.log( ticketsToFind );
                        const userTicket = ticketsToFind;
                        res.status(200).json(userTicket); 
                    }
                }
            }
        else {
            const ticketsToFind = await Ticket.find({ customer_id: current_id /*, operator_id: { $ne: "5fc8d9d35892ccde65f78069" }*/ }).sort( { ticket_date: 1 } ).limit(100).populate("added_by", "username").populate("operator_id","username").populate("category","name");
            const userTicket = ticketsToFind;
            res.status(200).json(userTicket)
        }

    } catch (error) {
        
        res.status(500).json({
            error : error
        })

    }


})

app.get("/dashboardcustomers/:customerId", async(req,res) => {
    try {
        const customerToFind = await Customer.findById({_id : req.params.customerId},{company_name: 1, contract_start: 1, contract_hours: 1});
        if (!customerToFind) {
            throw Error("Non è stato possibile trovare il cliente");
        }
        res.status(200).json(customerToFind)
    } catch (error) {
        res.status(500).json({
            error : error
        })
    }
})
