const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config');
require('dotenv').config();


const app = express();
//DDBB
dbConnection();

// CORS
app.use(cors())
//dir publico
app.use( express.static('public') );

// Lectura y parse del body
app.use( express.json() );

// Rutas
app.use('/api/auth', require('./routes/auth') );
app.use('/api/events', require('./routes/events') );




app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en el puerto ${ process.env.PORT }`)
})