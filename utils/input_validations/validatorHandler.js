const { errorCodes } = require("../constants");
const { errorStructure, returnError } = require("../response_handling/responseHandler");

function cvtValidationResp({errors}){
    const errorObjs = [];
    errors.details.forEach((errorDetails)=>{
        errorObjs.push(
            errorStructure(
                {
                    code: errorCodes.invalidInput,
                    message: errorDetails.message,
                    param: errorDetails.context.label,
                }
            )
        )   
    })
    return returnError(
        {
            errors: errorObjs,
            status: false, 
        }
    );
}   

module.exports = {
    cvtValidationResp,
}