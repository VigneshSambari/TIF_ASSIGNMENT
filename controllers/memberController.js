const Role = require("../models/role.model");
const Community = require("../models/community.model");
const User = require("../models/user.model");
const Member = require("../models/member.model");
const { addMemberValidator } = require("../utils/input_validations/validators");
const { serverError, returnError, errorStructure, returnResponse } = require("../utils/response_handling/responseHandler");
const { statusEnum } = require("../utils/response_handling/statusCodes");
const { errorCodes, roleNames } = require("../utils/constants");
const { addUserToComm } = require("../utils/utilMethods");
const { removeUnwantedAtt } = require("../utils/formatObjects");

//Handle errors for below controllers
function errorHandler({message, code, param}){
    return returnError({
        status: false,
        errors: [
            errorStructure({
                param,
                message,
                code,
            })
        ]
    })
}

//Add member to community
const addMember = async (req, res) => {
    try{
        const { error, value } = addMemberValidator.validate(req.body, { abortEarly: false });
        if(error){
            return res.status(statusEnum.BAD_REQUEST).json(cvtValidationResp({errors: error}));
        }

        const { community, user, role } = req.body;
        
        const roleObj = await Role.findOne({ id: role });
        if(!roleObj){
            return res.status(statusEnum.BAD_REQUEST).json(errorHandler(
                {
                    code: errorCodes.resourceNotFound,
                    message: "Role not found.",
                    param: "role",
                }
            ))
        }

        const communityObj = await Community.findOne({ id: community });
        if(!communityObj){
            return res.status(statusEnum.BAD_REQUEST).json(errorHandler(
                {
                    code: errorCodes.resourceNotFound,
                    message: "Community not found.",
                    param: "community",
                }
            ))
        }

        const userObj = await User.findOne({ id: user });
        if(!userObj){
            return res.status(statusEnum.BAD_REQUEST).json(errorHandler(
                {
                    code: errorCodes.resourceNotFound,
                    message: "User not found.",
                    param: "user",
                }
            ))
        }
       
        const alreadyMember = await Member.findOne({ community: community, user: user});
        if(alreadyMember){
            return res.status(statusEnum.BAD_REQUEST).json(errorHandler(
                {
                    code: errorCodes.resoureExists,
                    message: "User is already added in the community.",
                }
            ))
        }

        if(req.user.data.id !== communityObj.owner){
            return res.status(statusEnum.BAD_REQUEST).json(errorHandler(
                {
                    code: errorCodes.notAllowedAccess,
                    message: "You are not authorized to perform this action.",
                }
            ))
        }
        
        const member = await addUserToComm({
            community: communityObj.id,
            role: roleObj.id,
            user: userObj.id,
        })

        const requestObj = removeUnwantedAtt(member.toObject());

        return res.status(statusEnum.OK).json(
            returnResponse({
                status: true,
                data: requestObj,
            })
        )
    }
    catch(err){
        return res.status(statusEnum.BAD_REQUEST).json(serverError({error: err}));
    }
}


//Remove member from community
const deleteMember = async (req, res) => {
    try{
        const { communityId, userId } = req.params;
        
        const isMember = await Member.findOne({community: communityId, user: userId});
        if(!isMember){
            return res.status(statusEnum.BAD_REQUEST).json(errorHandler({
                code: errorCodes.resourceNotFound,
                message: "Member not found.",
            }))
        }
        
        const selfMemData = await Member.findOne({ community: communityId, user: req.user.data.id });
        const role = await Role.findOne({ id: selfMemData.role });

        if(role === roleNames.communityAdmin || role === roleNames.communityModerator){
            return res.status(statusEnum.BAD_REQUEST).json(errorHandler({
                code: errorCodes.notAllowedAccess,
                message: "ou are not authorized to perform this action.",
            }))
        }
        
        const deletedMem = await Member.findOneAndDelete({ user: userId, community: communityId});
        return res.status(statusEnum.OK).json({
            status: true,
        });
    }
    catch(err){
        return res.status(statusEnum.BAD_REQUEST).json(serverError({error: err}));
    }
}

module.exports = {
    addMember,
    deleteMember,
}