const { Snowflake } = require('@theinternetfolks/snowflake');

const Community = require("../models/community.model");
const User = require("../models/user.model");
const Member = require("../models/member.model");
const Role = require("../models/role.model");

const { statusEnum } = require("../utils/response_handling/statusCodes");
const { cvtValidationResp } = require("../utils/input_validations/validatorHandler");
const { createCommunityValidator } = require("../utils/input_validations/validators");
const { removeUnwantedAtt } = require('../utils/formatObjects');
const { returnResponse, serverError } = require('../utils/response_handling/responseHandler');
const { addAdmin } = require('../utils/utilMethods');

//Create community after signin
const createCommunity = async (req, res) => {
    try{
        const { error, value } = createCommunityValidator.validate(req.body, { abortEarly: false });
        if(error){
            return res.status(statusEnum.BAD_REQUEST).json(cvtValidationResp({errors: error}));
        }
        
        const { name } = req.body;

        const result = await Community.create({
            name,
            slug: name.toLowerCase().split('').join('.'),
            owner: req.user.data.id,
            id: Snowflake.generate(),
        })

        const resultObj = removeUnwantedAtt(result.toObject());

        const member = await addAdmin({communityId: resultObj.id, userId: req.user.data.id});

        return res.status(statusEnum.OK).json(returnResponse(
            {
                status: true,
                data: resultObj,
            }
        ));

    }
    catch(err){
        return res.status(statusEnum.BAD_REQUEST).json(serverError({error: err}));
    }
}


//Fetch communities -> paginated gives communities of last page
const fetchAll = async (req, res) => {
    try{
        const pageSize = 10;
        const total = await Community.countDocuments();
        const lastPageNumber = Math.max(1, Math.ceil(total / pageSize)); 
        const skip = Math.max(0, (lastPageNumber - 1) * pageSize);
    
        const data = await Community.find()
          .skip(skip)
          .limit(pageSize)
          .exec();
        
        const dataObjs = [];
        for (const item of data) {
            const obj = item.toObject();
            const userData = await User.findOne({ id: item.owner }).select("-password -email");
            obj.owner = {
              id: userData.id,
              name: userData.name,
            };
            dataObjs.push(removeUnwantedAtt(obj));
        }

        const meta = {
          total,
          pages: lastPageNumber,
          page: lastPageNumber, 
        };

        return res.status(statusEnum.OK).json(returnResponse({
            status: true,
            data: dataObjs,
            meta,
        }))
        
    }
    catch(err){
        return res.status(statusEnum.BAD_REQUEST).json(serverError({error: err}));
    }
}

//Get owned communities -> You are admin
const getOwnCommunity = async (req, res) => {
    try{
        const pageSize = 10; 
        const totalDocuments = await Community.countDocuments({ owner: req.user.data.id });
        const lastPageNumber = Math.max(1, Math.ceil(totalDocuments / pageSize));
        const skip = Math.max(0, (lastPageNumber - 1) * pageSize);

        const comms = await Community.find({ owner: req.user.data.id })
        .skip(skip)
        .limit(pageSize)
        .exec();

        const resultObjs = [];
        comms.forEach((item) => {
            resultObjs.push(removeUnwantedAtt(item.toObject()));
        })

        const meta = {
            total: totalDocuments,
            pages: lastPageNumber,
            page: lastPageNumber, 
        };

        return res.status(statusEnum.OK).json(returnResponse(
            {
                status: true,
                data: resultObjs,
                meta,
            }
        ))
    }
    catch(err){
        return res.status(statusEnum.BAD_REQUEST).json(serverError({error: err}));
    }
}

//Get communities which you are member of
const getMemberCommunity = async (req, res) => {
    try{    
        const pageSize = 10; 
        const totalDocuments = await Member.countDocuments({ owner: req.user.data.id });
        const lastPageNumber = Math.max(1, Math.ceil(totalDocuments / pageSize));
        const skip = Math.max(0, (lastPageNumber - 1) * pageSize);

        const memberOfComms = await Member.find({ user: req.user.data.id })
            .skip(skip)
            .limit(pageSize)
            .exec();

        const resultObjs = [];
        for(const item of memberOfComms){
            const comm = await Community.findOne({ id: item.community });
            if(comm && comm.owner !== req.user.data.id){
                const owner = await User.findOne({ id: comm.owner }).select("id name -_id");
                const object = comm.toObject();
                object.owner = owner
                resultObjs.push(removeUnwantedAtt(object));
            }
        }

        const meta = {
            total: totalDocuments,
            pages: lastPageNumber,
            page: lastPageNumber, 
        };

        return res.status(statusEnum.OK).json(returnResponse(
            {
                status: true,
                data: resultObjs,
                meta,
            }
        ))
    }
    catch(err){
        return res.status(statusEnum.BAD_REQUEST).json(serverError({error: err}));
    }
}

//Get all members of a community
const getAllMembers = async (req, res) => {
    try{
        const { id } = req.params;

        const pageSize = 10; 
        const totalDocuments = await Member.countDocuments({ community: id });
        const lastPageNumber = Math.max(1, Math.ceil(totalDocuments / pageSize));
        const skip = Math.max(0, (lastPageNumber - 1) * pageSize);

        const members = await Member.find({community: id})
            .skip(skip)
            .limit(pageSize)
            .exec();
        
        const resultObjs = [];

        for(const member of members) {
            const memObj = member.toObject();
            const user = await User.findOne({id: member.user}).select("id name -_id");
            const role = await Role.findOne({id: member.role}).select("id name -_id");
            memObj.user = user; memObj.role = role;
            resultObjs.push(removeUnwantedAtt(memObj));
        }

        const meta = {
            total: totalDocuments,
            pages: lastPageNumber,
            page: lastPageNumber, 
        };
        
        return res.status(statusEnum.OK).json(returnResponse(
            {
                status: true,
                data: resultObjs,
                meta,
            }
        ))
    }
    catch(err){
        return res.status(statusEnum.BAD_REQUEST).json(serverError({error: err}));
    }
}

module.exports = {
    createCommunity,
    fetchAll,
    getOwnCommunity,
    getMemberCommunity,
    getAllMembers,
}