const fs = require('fs');
const common = require('../common');
const filePath = process.cwd()+"/db.json";

const addMovie = (req,res) => {    
    const { genres,title,year,runtime,director } = req.body;    
    let { actors,plot,posterUrl } = req.body;    
    actors=!actors ? "" : actors;
    plot = !plot ? "" : plot;
    posterUrl = !posterUrl ? "" : posterUrl;
    
    fs.readFile(filePath, (err, data) => {
        if (err) common.handleInternalServerError(res,err);
        let result = JSON.parse(data);
        result.movies.push({
            "id": result.movies.length+1,
            "title": title,
            "year": year,
            "runtime": runtime,
            "genres": genres,
            "director": director,
            "actors": actors,
            "plot": plot,
            "posterUrl": posterUrl
        });
        fs.writeFile(filePath, JSON.stringify(result), 'utf8', (err,data)=>{
            if(err) common.handleInternalServerError(res,err);
            else {
                res.status(200).json({ 
                    status:200,
                    msg:'Movie added successfully'
                });                 
            }
        });
        
    });       
}

module.exports = {
    addMovie
}