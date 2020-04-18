const fs = require('fs');
const common = require('../common');
const filePath = process.cwd()+"/db.json";

const getMovie = (req,res) => {
    const { genres,runtime } = req.body;
    fs.readFile(filePath, (err, data) => {
        if (err) common.handleInternalServerError(res,err);
        let result = JSON.parse(data);        
        let movies = result.movies;
        
        if(genres && genres.length ==1) movies.sort((a, b) => (a.genres.length) - (b.genres.length));
        

        let startRuntime=0,endRuntime=0;
        if(runtime) { 
            startRuntime=parseInt(runtime)-10;
            endRuntime=parseInt(runtime)+10;
        }

        //***** Get random movie if none of paramater pass */
        if(!genres && !runtime) {
            const randMovies = Object.values(movies)
            common.successResponse(res,randMovies[parseInt(Math.random() * randMovies.length)]);            
        }
        //***** Get random movie if runtime pass and no genre */
        else if(!genres && runtime) {
            let movieFound = movies.filter(item => {
                return item.runtime >= startRuntime && item.runtime <= endRuntime;
            });

            const randMovies = Object.values(movieFound)
            common.successResponse(res,randMovies[parseInt(Math.random() * randMovies.length)]);
        } else {
            //***** Get movies based on genre and runtime or one of them atleast */
            let moviesReturn=[];
            let genresLen =genres && genres.length;
            let AllGenereExist=true;                
            //**** Get those movies which has genres all of them which user send in request */
            movies.forEach(obj => {    
                AllGenereExist=true;
                for(let i=0;i < genresLen;i++) {
                    if(obj.genres.indexOf(genres[i]) !== -1){ }
                    else AllGenereExist=false;
                }
                if(AllGenereExist) {
                    if(genresLen==obj.genres.length) {
                    const exist=common.checkItemExist(moviesReturn,obj.id)       
                    if(runtime)  {
                        if(obj.runtime >= startRuntime && obj.runtime<=endRuntime) if(!exist) moviesReturn.push(obj);                        
                    }
                    else {                         
                        if(!exist) moviesReturn.push(obj); 
                    }
                }
            }
            });
            
            const makeGenreCombination=common.makeGenreCombinations(genres);
            
            //***** Get movies with combinatin e.g [Comedy, Fantasy][Comedy, Crime], [Fantasy, Crime]  */
            makeGenreCombination.forEach(objComb => {
                var combGenresArr = objComb.split(',');                    
                console.log(combGenresArr)
                movies.forEach(obj => {
                    AllGenereExist=false;
                    AllGenereExist= obj.genres.indexOf(combGenresArr[0]) !== -1 ? true : false;
                    if(typeof combGenresArr[1] == undefined) AllGenereExist=false;
                    if(AllGenereExist && typeof combGenresArr[1] != undefined) AllGenereExist= obj.genres.indexOf(combGenresArr[1]) !== -1 ? true : false;
                    if(AllGenereExist) {                            
                        const exist=common.checkItemExist(moviesReturn,obj.id)
                        if(runtime) { 
                            if(obj.runtime >= startRuntime && obj.runtime<=endRuntime) if(!exist) moviesReturn.push(obj);                            
                        }else {                            
                            if(!exist) moviesReturn.push(obj);
                        }
                    }
                });
            });
            
            //***** Get movies with specific genere e.g Comedy 
            movies.forEach(obj => {    
                
                for(let i=0;i < genresLen;i++) {                    
                    if(obj.genres.indexOf(genres[i]) !== -1 && obj.genres.length==1){ 
                        // if(obj.genres.indexOf(genres[i]) !== -1){ 
                        const exist=common.checkItemExist(moviesReturn,obj.id)
                        if(runtime){
                            if(obj.runtime >= startRuntime && obj.runtime<=endRuntime) if(!exist) { 
                                // if(genresLen==1) {
                                //     if(obj.genres.length==1) moviesReturn.push(obj);
                                // }
                                //else 
                                moviesReturn.push(obj);                                                                                        
                            }
                        }
                        else { 
                            // if(genresLen==1) {
                            //     if(obj.genres.length==1) moviesReturn.push(obj);
                            // }
                            // else {
                                moviesReturn.push(obj);
                            // }
                        }
                    }
                }                
            });

            common.successResponse(res,  moviesReturn)       
        }
    });    
}

module.exports = {
    getMovie
}