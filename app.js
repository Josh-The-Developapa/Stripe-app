const express = require('express');
const router = require('./routes/router.js');
require('ejs');
const app = express();


app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set("views", "views");
app.use(router);


app.listen(5000, () => {
    console.log('Server up and running');
})