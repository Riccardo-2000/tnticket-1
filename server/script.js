const fs = require('fs');
const db = require("./database/mongoose");
const express = require('express');
const app = express();
const cors = require('cors');
const BodyParser = require("body-parser");
app.use(BodyParser.json({limit: '5mb'}));
app.use(BodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: '*'
}));
// => Db Models
const Ticket = require("./database/models/Ticket");
const Customer = require("./database/models/Customer");


// => Get Start Of Script
/*
Resta Da Creare La funzione per il calcolo dei sette giorni.
e poi richiamare al suo interno
=> checkFilesIntoUploadDirectiory();
*/

// => Get File And Delete From Directory
const deleteFile = (file) => {
    const fileToDelete = fs.readdirSync('uploads/')
    .map(singleFile => {
        if (singleFile == file ) {
            /* => Elimina il file con cui non ha trovato corrispondenza
            fs.unlink(file);
            */
            console.log("Eliminato");
        }
    })
}
// => Read Files Into Uploads Directory
const checkFilesIntoUploadDirectiory = async () => {
    const mainArray = []
    const fileNames =  fs.readdirSync('uploads/');
    const ticketsFields = await Ticket.find({});
    const customerFiels = await Customer.find({});
    mainArray.push(ticketsFields,customerFiels)
    fileNames.forEach(file => {
        mainArray.map(item => {
            item.map(singleItem => {
                console.log(singleItem.images);
                if (singleItem.images.includes(file)) {
                    return;
                } else {
                    deleteFile(file);
                    return console.log("Match Not Found");
                }
            });
        })
    });
}


