const mongoose = require('mongoose');


const zanrShema = mongoose.Schema({
    naziv: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Zanr', zanrShema);