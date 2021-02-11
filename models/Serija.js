const mongoose = require('mongoose');


const serijeShema = mongoose.Schema({
    naslov: {
        type: String,
        required: true
    },
    zanr: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Zanr'
        }
    ],
    opis: {
        type: String,
    },
    godina: {
        type: Number,
        required: true
    },
    poster:{
        type: String
    },
    glumci: String,
    popularnost: {
        type: Number,
        default: 0
    }
});


module.exports = mongoose.model('Serija',serijeShema);