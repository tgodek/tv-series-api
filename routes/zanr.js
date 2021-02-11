const express = require('express');
const Zanr = require('../models/Zanr');
const router = express.Router();


//svi zanrovi
router.get('/', async (req, res) => {
    try{
        const zanr = await Zanr.find();
        res.json(zanr);
    }catch(error){
        res.json({ message: error });
    }
});


//novi zanr
router.post('/', async (req,res) => {
    
    try{
    
        let zanr = new Zanr();
        zanr.naziv = req.body.naslov;
        await zanr.save()
        res.json({message: "Dodan novi zanr"});

    }catch(error){
        res.json({ message: error });
    }
    
});


module.exports = router;