const fs = require('fs');
const express = require("express");
const router = express.Router();
const common = require('../common');
const addMovie = require('../models/addMovie');
const filePath = process.cwd()+"/db.json";

router.post('/add', async(req, res, next) => {  
    try{
    const { genres,title,year,runtime,director,actors,plot,posterUrl } = req.body;    
      let validationErr = '';
      if(!genres || genres=='') validationErr = 'Genres is missing';      
      else if(!title || title=='') validationErr = 'Title is missing';
      else if(title.length > 255) validationErr = 'Title length must not be greater than 255';
      else if(!year || year=='') validationErr = 'Year is missing';
      else if(isNaN(year))  validationErr = 'Year must be a number';
      else if(!runtime || runtime=='') validationErr = 'Runtime is missing';
      else if(isNaN(runtime))  validationErr = 'Runtime must be a number';
      else if(!director || director=='') validationErr = 'Director is missing';
      else if(director.length > 255) validationErr = 'Director length must not be greater than 255';      


      fs.readFile(filePath, async(err, data) => {
        if (err) common.handleInternalServerError(res,err);
        let result = JSON.parse(data);
        validGenres = result.genres;
        genres.forEach(gen => {
            if(validGenres.indexOf(gen) == -1)  validationErr = 'Invalid Genres'; 
            console.log(gen)   ;
          });
       
          if(validationErr) common.handleError(res,500,validationErr)      
          else {        
            await addMovie.addMovie(req,res,(err)=>{
                common.handleInternalServerError(res,err);
            });
          }//*/
      });      
    
    }catch(e) {
        common.handleInternalServerError(res,e);
    }
});

module.exports = router;