const express = require('express');

require('dotenv').config();
require('express-async-errors');

const routes = require('./routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);
app.use((error, request, response, next) => {
   console.log(error);
   response.sendStatus(500);
});

app.listen(3000, () => console.log('Server started http://localhost:3000'));