const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const registerRoutes = require('./routes/registerRoutes');
const loginRoutes = require('./routes/loginRoutes');


const app = express();

app.use(cors());
app.use(bodyParser.json());

const dotenv = require('dotenv');
const path = require('path');

dotenv.config({path : path.join(__dirname,'config','config.env')})

const connectDatabase = require('./config/connectDatabase');
connectDatabase();

const user = require('./routes/roles');
const admin = require('./routes/roles');
const buses = require('./routes/buses');
const tickets = require('./routes/tickets');

app.use(express.json()); 
app.use('/',user);
app.use('/',admin);
app.use('/api/register',registerRoutes);
app.use('/api/login',loginRoutes);
app.use('/user/api/v1/',buses);
app.use('/user/api/v1',tickets);

app.listen(process.env.PORT , ()=>{
    console.log(`Listening to port ${process.env.PORT} in ${process.env.NODE_ENV} `);
});  

