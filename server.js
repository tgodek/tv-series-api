const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv/config');

const app = express();

app.use(cors());
app.use(bodyParser.json());


//Import ruta
const serijeRoutes = require('./routes/serije');
const KorisnikRoutes = require('./routes/korisnici');
const zanrRoutes = require('./routes/zanr');

app.use('/serije', serijeRoutes);
app.use('/korisnici', KorisnikRoutes);
app.use('/zanr', zanrRoutes);

app.get('/', (req, res) => {
    res.send('Pocetna stranica');

});


//spoji na bazu
mongoose.connect(
    process.env.DB_CONNECTION, 
    {useNewUrlParser: true, useUnifiedTopology: true});

var db = mongoose.connection;

db.once('open', () => {
    console.log("Povezan na Mongo DB");
});

db.on('error', console.error.bind(console, 'Greska sa spajanjem na bazu'));

const PORT = process.env.PORT || 3000;
app.listen(PORT,
  console.log(`Server running mode on port ${PORT}`)
);
