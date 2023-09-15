const { Snowflake } = require('@theinternetfolks/snowflake');

const Role = require("../models/role.model");
const Member = require("../models/member.model");
const { roleNames } = require('./constants');

const fetchRoleId = async (roleName) => {
    try{
        const role = await Role.findOne({ name: roleName});
        return role.id;
    }
    catch(err){
        throw new Error("Error fetching roleId.");
    }
}

const addAdmin = async ({userId, communityId}) => {
    try{
        const roleId = await fetchRoleId(roleNames.communityAdmin);
        const member = await Member.create({
            community: communityId,
            user: userId,
            role: roleId,
            id: Snowflake.generate(),
        })
        return member;
    }
    catch(err){
        throw new Error("Error creating admin member.");
    }
}

const addUserToComm = async ({role, community, user}) => {
    try{
       const member = await Member.create({
          community,
          role,
          user,
          id: Snowflake.generate(),
       });

       return member;
    }
    catch(err){
        throw new Error("Error adding user.");
    }
}

module.exports = {
    fetchRoleId,
    addAdmin,
    addUserToComm,
}