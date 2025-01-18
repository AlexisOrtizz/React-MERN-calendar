const path = require('path');

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { dbConnection } = require('./database/config');

// Create express server
const app = express();

// Database configuration
dbConnection();

// CORS
app.use(cors())

// Public Path
app.use( express.static('public') );

// Read and parse body
app.use( express.json() );

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

app.use( '*', (req, res) => {
    res.sendFile( path.join(__dirname, 'public/index.html') );
});

// Listen requests
app.listen( process.env.PORT, () => {
    console.info('Server is running on port 4000');
});