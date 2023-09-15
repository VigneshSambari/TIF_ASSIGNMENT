const { errorCodes } = require("../constants");


function returnResponse({data, meta, status}){
    return {
        status,
        "content": {
            meta,
            data,
        },
        
    }
}

function returnError({status, errors}){
    return {
        status,
        errors,
    }
}

function errorStructure({param, message, code}){
    return {
        param,
        message,
        code,
    }
}

function serverError({error}){
    return returnError({
        errors: [
            errorStructure({
                message: error.message, 
                code: errorCodes.serverError, 
                param: "any"
            })
        ],
        status: false
    });
}

module.exports = {
    errorStructure,
    returnError,
    returnResponse,
    serverError,
}