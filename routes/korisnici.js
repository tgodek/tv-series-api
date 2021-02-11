const express = require('express');
const Korisnik = require('../models/Korisnik');
const router = express.Router();

//svi korisnici
router.get('/', async (req, res) => {
    try{
        const korisnici = await Korisnik.find();
        res.json(korisnici);
    }catch(error){
        res.json({ message: error });
    }
});

//dohvati kor_ime korisnika za prikaz na profilu
router.get('/dohvatiime', async (req, res) => {
    try{
        const kor = await Korisnik.find({_id: req.query.id},'kor_ime -_id');
        if(kor.length != 0){
            res.json(kor);
        }
        else{
            res.json({ kor_ime: "Ne postoji korisnik" });
        }
        
    }catch(error){
        res.json({ message: error });
    }
});


//dohvati korisnik po kor_ime i lozinka
router.get('/login', async (req, res) => {
    try{
        await Korisnik.find({kor_ime: req.query.kor_ime, lozinka: req.query.lozinka}, function(err,result){
            if(err){
                res.json({message: "Greska"});
            }
            if(!result.length){
                res.json({message: "Krivi unos"});
            }
            else{
                res.json({message: result[0]._id});
            }
        });
     
    }catch(error){
        res.json({ message: error });
    }
});

//novi korisnik
router.post('/registracija', async (req,res) => {
    
    const { _id,ime,prezime,kor_ime,lozinka,email } = req.body
    
    try{
        let postoji_korisnik = await Korisnik.findOne({email: email});

        if(postoji_korisnik){
            return res.json({
                message: "Korisik vec postoji"
            })
        }
        else{
            let korisnik = new Korisnik();
        
            korisnik.ime = ime;
            korisnik.prezime = prezime;
            korisnik.kor_ime = kor_ime;
            korisnik.lozinka = lozinka;
            korisnik.email = email;
    
            await korisnik.save();
            res.json({
                message: "Registracija uspjesna"
            });
        }

    }catch(error){
        res.json({ message: error });
    }
    
});

//izbrisi korisnika po ID-u
router.delete('/:korisnikId', async (req, res) => {
    try{
        const izbrisiKorisnika = await Korisnik.deleteOne({_id: req.params.korisnikId});
        res.json(izbrisiKorisnika);
    }catch(error){
        res.json({ message: error });
    }
});


module.exports = router;