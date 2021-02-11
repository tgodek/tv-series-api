const mongoose = require('mongoose');


const korisnikShema = mongoose.Schema({
    ime: {
        type: String,
    },
    prezime: {
        type: String,
    },
    kor_ime: {
        type: String,
    },
    lozinka: {
        type: String,
    },
    email: {
        type: String,
    },
    serije: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Serija'
        }
    ]
});

module.exports = mongoose.model('Korisnik',korisnikShema);