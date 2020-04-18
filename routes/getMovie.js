const fs = require('fs');
const express = require("express");
const router = express.Router();
const common = require('../common');
const getMovie = require('../models/getMovie');
const filePath = process.cwd()+"/db.json";

router.get('/', (req, res, next) => {  
       
    res.status(200).json({msg:"Api is working"});
});


router.post('/get/', async(req, res, next) => {  
    try{
      const { genres,runtime } = req.body;
      fs.readFile(filePath, async(err, data) => {
        if (err) common.handleInternalServerError(res,err);
        let validationErr='';
        if(genres) {
            let result = JSON.parse(data);
            validGenres = result.genres;
            // console.log(genres);
            genres.forEach(gen => {
                if(validGenres.indexOf(gen) == -1)  validationErr = 'Invalid Genres';                 
            });
            if(runtime && isNaN(runtime))  validationErr = 'Runtime must be a number';
            
        }
        if(validationErr!="") common.handleError(res,500,validationErr);
        else{
            await getMovie.getMovie(req,res,(err)=>{
                if(err) {
                    res.json({
                        status:500,
                        msg:err
                    })
                }
            });
        }
    })
    }catch(e) {
        console.log('eee',e)
        res.json({
            status:500,
            msg:e
        })
    }
});

module.exports = router;