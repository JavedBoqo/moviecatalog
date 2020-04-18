
const handleError = (res,status,msg) => {
    res.status(status).json({ 
        status,
        msg 
      });
}

const handleInternalServerError = (res,err) => {
    console.log(err);
    res.status(500).json({ 
        status:500,
        msg :JSON.stringify(err) 
      });
}

const checkItemExist = (data,id) => {
    return data.some(function (el) {
        return el.id === id;
    });
}


const makeGenreCombinations = (data) => { 
    const iter = (index, temp = []) =>{ 
      if (!index--) return; 
        iter(index, temp); 
        result.push(temp = [data[index], ...temp]); 
        iter(index, temp); 
    }  

    let result = [],combinations = []; 
    if(data.length > 1) {                
        iter(data.length); 
        
        result.forEach(com =>{
            if(com.length == 2) combinations.push(com.join(','))
        })
    } else combinations=data;
    
    return combinations; 
} 

const successResponse = (res,data) => {
    res.status(200).json({ 
        status:200,
        data
    }); 
}

module.exports = {
    handleError,
    handleInternalServerError,
    checkItemExist,
    makeGenreCombinations,
    successResponse
}