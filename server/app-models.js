const mongoose = require("mongoose");
const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const CONNECTION_URL = "mongodb+srv://sadev-dbusr:salerno@sadev-mongodb.6hk0z.mongodb.net/tnticketapp" ;
const DATABASE_NAME = "tnticketapp";
const tickets = require("./models/ticket.js");
const users = require("./models/user.js");
const customers = require("./models/customer.js");

var https = require('https');
var fs = require('fs');
var cors = require('cors');
var app = Express();
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
var database, collection;
app.use(cors({
  origin: '*'
}));
var privateKey = fs.readFileSync( '/etc/letsencrypt/live/tn.salernodev.com/privkey.pem' );
var certificate = fs.readFileSync( '/etc/letsencrypt/live/tn.salernodev.com/fullchain.pem' );

https.createServer({
    key: privateKey,
    cert: certificate
}, app).listen(5000, () => {
    /*MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
            if(error) {
                    throw error;
            }
            database = client.db(DATABASE_NAME);
            tickets = database.tickets("tickets");
            //users = database.tickets("users");
            //customers = database.tickets("customers");
        //console.log(tickets);
            console.log("Connected to `" + DATABASE_NAME + "`!");
        });*/
        mongoose.connect(CONNECTION_URL, { useUnifiedTopology: true, useNewUrlParser: true });
        const connection = mongoose.connection

});

app.post("/login", (request, response) => {
    console.log( request.body );
    var username = request.body.username;
    var password = request.body.password;
    //console.log( username, password );
    users.findOne( request.body, (error, result) => {
        if(result) {
            user_result = {
                "status" : true,
                "_id" : result._id,
                "username": result.username,
                "email": result.email,
                "user_type": result.user_type,
                "status_holiday": result.status_holiday,
                "token": "TEST-TOKEN"
            };
            //console.log( result );
        }    
        else {
            user_result = {
                "status" : false,
                "_id" : "",
                "username": "",
                "email": "",
                "user_type": "",
                "status_holiday": "",
                "token": ""
            };
        }
        response.send(user_result);
    });
});


app.get("/tickets", (request, response) => {
    tickets.find({}, (error, result) => {
        //console.log( result );
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    }).sort( { insert_date: 1 });
});
app.get("/tickets/:id", (request, response) => {
    tickets.find({ "operator_id": request.params.id }, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});
app.get("/tickets/search/:term", (request, response) => {
    tickets.find({ "title": {$regex: ".*" + request.params.term + ".*", $options: "i" }}, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
        });
});
app.delete("/ticket/:id", (request, response) => {
    tickets.deleteOne({ "_id": new ObjectId(request.params.id) }, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});
app.get("/ticket/:id", (request, response) => {
    tickets.findOne({ "_id": new ObjectId(request.params.id) }, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});
app.post("/ticket/:id", (request, response) => {
    tickets.update({ "_id": new ObjectId(request.params.id) }, 
    { $set : request.body },    
    (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});
app.post("/tickets", (request, response) => {
    tickets.save( request.body,
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            console.log(`result object length = ${Object.keys(result).length}`);
          }
        } 
    );
});
app.get("/users", (request, response) => {
    //console.log( request );
    users.find({}, function(error, result) {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});
app.get("/users/tech", (request, response) => {
    users.find({"user_type": "2"}, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});
app.post("/user/:id", (request, response) => {
    users.updateOne({ "_id": new ObjectId(request.params.id) }, 
    { $set : request.body },    
    (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});
app.get("/user/:id", (request, response) => {
    users.findOne({ "_id": new ObjectId(request.params.id) }, (error, result) => {
        if(result) {
            user_result = {
                "status" : true,
                "_id" : result._id,
                "username": result.username,
                "email": result.email,
                "user_type": result.user_type,
                "status_holiday": result.status_holiday,
                "token": "TEST-TOKEN"
            };
            //console.log( result );
        }    
        else {
            user_result = {
                "status" : false,
                "_id" : "",
                "username": "",
                "email": "",
                "user_type": "",
                "status_holiday": "",
                "token": ""
            };
        }
        if(error) {
            return response.status(500).send(error);
        }
        response.send(user_result);
    });
});
app.get("/customers", (request, response) => {
    customers.find({}, (error, result) => {
        console.log( result );
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});
app.post("/customers", (request, response) => {
    customers.insertOne(request.body, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result.result);
    });
});
app.get("/customer/:id", (request, response) => {
    customers.findOne({ "_id": new ObjectId(request.params.id) }, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});
app.post("/customer/:id", (request, response) => {
    customers.updateOne({ "_id": new ObjectId(request.params.id) }, 
    { $set : request.body },    
    (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});
app.delete("/customer/:id", (request, response) => {
    //console.log( request.params.id );
    customers.deleteOne({ "_id": new ObjectId(request.params.id) }, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});
app.get("/tickets/customer/:id", (request, response) => {
    tickets.find({ "customer_id": request.params.id },(error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});
app.get("/customers/search/:term", (request, response) => {
    //console.log( request.params.term );
    customers.find({ "company_name": {$regex: ".*" + request.params.term + ".*", $options: "i" } },(error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});
app.get("/categories",  (request, response) => {
    categories = {"categories": [
        "Assistenza Informatica",
        "Assistenza Sistemistica",
        "Riparazione PC",
        "Riparazione Smartphone",
        "Altra tipologia di assistenza"
    ]};
    response.send( categories );
});
app.get("/statuses",  (request, response) => {
    statuses = {"statuses": [
        "In attesa di tecnico",
        "In Pausa",
        "In lavorazione",
        "In attesa di cliente",
        "Risolto"
    ]};
    response.send( statuses );
});