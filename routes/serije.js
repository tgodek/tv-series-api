const { json } = require('body-parser');
const express = require('express');
const Korisnik = require('../models/Korisnik');
const router = express.Router();
const Serija = require('../models/Serija');
const Zanr = require('../models/Zanr');


//sve serije
router.get('/', async (req, res) => {
    try{
        const serije = await Serija.find().populate('zanr');
        res.json(serije);
    }catch(error){
        res.json({ message: error });
    }
});

router.get('/dodaneserije', async (req, res) => {
    try{

        const korisnik = await Korisnik.findById(req.query.id);
        const serije = await Serija.find({_id:korisnik.serije}).populate('zanr');


        res.json(serije);
    }catch(error){
        res.json({ message: error });
    }
});

router.get('/noveserije', async (req, res) => {
   
    try{

        const korisnik = await Korisnik.findById(req.query.id);
        const zanr = await Serija.find({_id: korisnik.serije}, 'zanr -_id');

       if(zanr.length == 0){
            serija = await Serija.find().populate('zanr');
            res.json(serija);

        }
        else{

            const listZanr = [];
            for(x in zanr){
                listZanr.push(zanr[x].zanr);
            }

            function sortByFrequency(arr){
                const frequencyMap = arr.reduce((obj, item) => {
                    obj[item] = (obj[item] || 0) + 1
                    return obj;
                }, {});
            
                return Object.entries(frequencyMap).sort((a,b) => b[1] - a[1]).flatMap(arr => Array(arr[1]).fill(arr[0]));
              }
            
           
            var trimListZanr = listZanr.flat();
            var popularZanr = [];
            if(trimListZanr.length > 5){
                trimListZanr = sortByFrequency(trimListZanr);
                
                popularZanr = trimListZanr.filter(function(elem, pos) {
                    return trimListZanr.indexOf(elem) == pos;
                });
            }

            if(popularZanr.length != 0){
                trimListZanr = popularZanr.slice(0,3);             
            }

            console.log(trimListZanr);
         
            const serije = await Serija.find( 
                {
                    $and:
                    [ 
                        {
                            _id: 
                                {
                                    $nin: korisnik.serije
                                } 
                        }, 
                        {
                            zanr: { $elemMatch: {$in: trimListZanr}}
                        } 
                    ] 
                }
            ).populate('zanr');
    
            res.json(serije);

        }
    }catch(error){
        res.json({ message: error });
    }
});

router.get('/serijetrending', async (req, res) => {
    try{
        const korisnik = await Korisnik.findById(req.query.id);
        const serije = await Serija.find().where({_id: { $nin: korisnik.serije}}).populate('zanr').sort({popularnost: -1}).limit(20);
        res.json(serije);
    }catch(error){
        res.json({ message: error });
    }
});

router.get('/serijelatest', async (req, res) => {
    try{
        const year = new Date().getFullYear() - 1;
        const korisnik = await Korisnik.findById(req.query.id);
        const serije = await Serija.find().where({_id: { $nin: korisnik.serije},godina: {$gte: year}}).populate('zanr').sort({godina:-1}).limit(20);
        res.json(serije);
    }catch(error){
        res.json({ message: error });
    }
});



//serija po ID-u - Dodaj seriju korisniku i povecaj popularnost serije
router.get('/dodajSerijuKorisniku', async (req, res) => {
    try{
         
        const serija = await Serija.findById(req.query.serijaId);
        const korisnik = await Korisnik.findById(req.query.korisnikId);

        var uk = serija.popularnost + 1;

        await Serija.updateOne(
            {_id: serija._id},
            {$set: {popularnost: uk}}
            );
        
        await Korisnik.updateOne(
            {_id: korisnik._id},
            {$push: {serije: [serija._id]}}
            );

        res.json({message: "Dodana nova serija"});
    }catch(error){
        res.json({ message: error });
    }
});

//serija po ID-u - izbrisi seriju iz baze korisnika i smanji popularnost serije
router.get('/izbrisiserijukorisniku', async (req, res) => {
    try{
         
        const serija = await Serija.findById(req.query.serijaId);
        const korisnik = await Korisnik.findById(req.query.korisnikId);

        var uk = serija.popularnost;
        if(serija.popularnost > 0){
            uk = serija.popularnost - 1;
        }

        await Serija.updateOne(
            {_id: serija._id},
            {$set: {popularnost: uk}}
            );
        
        await Korisnik.updateOne(
            {_id: korisnik._id},
            {$pullAll: {serije: [serija._id]}}
            );

        res.json({message: "Izbrisana serija"});
    }catch(error){
        res.json({ message: error });
    }
});

//nova serija
router.post('/', async (req,res) => {
    
    try{
        let serija = new Serija();

        for(var key in req.body){
            if(key == "zanr"){
                await Zanr.find({naziv: req.body[key]}, '_id', function(err, result){
                    if(err){
                        return res.json({message: "Greska"});
                    }
                    if(!result.length){
                        return res.json({message: "Zanr nije u bazi"});
                    }
                    else{
                        for(x in result)
                        {
                            serija.zanr.push(result[x]._id);
                        }
                    }
                });
            }
        }

        if(serija.zanr.length != 0){
            serija.naslov = req.body.naslov;
            serija.opis = req.body.opis;
            serija.godina = req.body.godina;
            serija.glumci = req.body.glumci;
            serija.poster = req.body.poster;
            serija.popularnost = req.body.popularnost;
    
            await serija.save()
            res.json({message: "Dodana nova serija"});
        }
        
    }catch(error){
        res.json({ message: error });
    }
    
});

//izbrisi seriju po ID-u
router.delete('/:serijaId', async (req, res) => {
    try{
        const izbrisiSeriju = await Serija.deleteOne({_id: req.params.serijaId});
        res.json(izbrisiSeriju);
    }catch(error){
        res.json({ message: error });
    }
});

module.exports = router;