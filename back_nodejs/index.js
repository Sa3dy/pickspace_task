const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

var apiServiceController = require('./controllers/apiServiceController.js');

var app = express();
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:3000' }));

app.listen(4200, () => console.log('Server started at port : 4200'));


app.use('/api', apiServiceController);