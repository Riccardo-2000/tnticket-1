const express = require('express');
const http = require('http');
const path = require('path');
var https = require('https');
var fs = require('fs');

const app = express();

const port = process.env.PORT || 3001;

app.use(express.static('/home/marco/dist/tntdashboard'));

app.get('/*', (req, res) => res.sendFile(path.join(__dirname)));

const server = http.createServer(app);

//server.listen(port, () => console.log(`App running on: http://localhost:${port}`));
var privateKey = fs.readFileSync( '/etc/letsencrypt/live/ticket.tnsolutions.it/privkey.pem' );
var certificate = fs.readFileSync( '/etc/letsencrypt/live/ticket.tnsolutions.it/fullchain.pem' );

https.createServer({
    key: privateKey,
    cert: certificate
}, app).listen(port);