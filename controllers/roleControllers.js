const { Snowflake } = require('@theinternetfolks/snowflake');

const Role = require("../models/role.model");
const { errorCodes } = require("../utils/constants");
const { serverError, returnError, errorStructure, returnResponse } = require("../utils/response_handling/responseHandler");
const { statusEnum } = require("../utils/response_handling/statusCodes");
const { removeUnwantedAtt } = require('../utils/formatObjects');

function nameValidator(name){
    return returnError({
        status: false,
        errors:[
            errorStructure(
                {
                    code: errorCodes.invalidInput,
                    message: "Name should be at least 2 characters.",
                    param: "name",
                }
            ),
        ]
    })
}


//Create Role
const createRole = async (req, res) => {
    try{
        const { name } = req.body;
        if(!name || name.length < 2){
            return res.status(statusEnum.BAD_REQUEST).json(nameValidator(name));
        }

        const id = Snowflake.generate();

        const result = await Role.create({
            name,
            id,
        })

        const resultObj = removeUnwantedAtt(result.toObject());

        return res.status(statusEnum.OK).json(returnResponse({
            data: resultObj,
            status: true,
        }))
    }
    catch(err){
        return res.status(statusEnum.BAD_REQUEST).json(serverError({error: err}));
    }
}


//Fetch roles -> paginated gives roles of last page
const fetchAll = async (req, res) => {
    try{
        const pageSize = 10;
        const total = await Role.countDocuments();
        const lastPageNumber = Math.max(1, Math.ceil(total / pageSize)); 
        const skip = Math.max(0, (lastPageNumber - 1) * pageSize);
    
        const data = await Role.find()
          .skip(skip)
          .limit(pageSize)
          .exec();
        
        const resultObjs = [];
        data.forEach((role)=>{
            resultObjs.push(removeUnwantedAtt(role.toObject()));
        })

        const meta = {
          total,
          pages: lastPageNumber,
          page: lastPageNumber, 
        };

        return res.status(statusEnum.OK).json(returnResponse({
            status: true,
            data: resultObjs,
            meta,
        }))
        
    }
    catch(err){
        return res.status(statusEnum.BAD_REQUEST).json(serverError({error: err}));
    }
}

module.exports = {
    createRole,
    fetchAll
}