const express = require('express');
const bodyparser = require('body-parser');
const dotenv = require('dotenv');
var cors = require('cors')
const app = express();
dotenv.config();
app.use(cors())
var routes = require('./app/routes/app-routes');

app.use(bodyparser.json());
port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`STOCK APP listening at http://localhost:${port}`)
})
routes(app);

