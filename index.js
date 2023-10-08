//Import usual packages
const express = require('express');
const cors = require('cors');
const app = express();

//Setup Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cors());


//Project Library Route
app.use('/projectlibrary', require('./routes/projectlibrary'));





//Setup port
const PORT = process.env.PORT
app.listen(PORT,() => console.log(`Now Live @ http://localhost:${PORT}`))
.on('error', (error) => console.log(error));