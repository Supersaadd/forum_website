const path = require('path');
const api = require('./api.js');

var cors = require('cors')


// Détermine le répertoire de base
const basedir = path.normalize(path.dirname(__dirname));
console.debug(`Base directory: ${basedir}`);


express = require('express');
const app = express()
const session = require("express-session");
app.set('trust proxy', 1); 

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));


app.use(session({
    secret: "technoweb rocks",
    resave: false,
    saveUninitialized: false,

    cookie: { 
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        secure: false,
        httpOnly: false, }
}));

app.use('/api', api.default());




// Démarre le serveur
app.on('close', () => {
});
exports.default = app;

