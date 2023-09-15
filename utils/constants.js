const errorCodes = {
    invalidInput: "INVALID_INPUT",
    resoureExists: "RESOURCE_EXISTS",
    serverError: "SERVER_ERROR",
    resourceNotFound: "RESOURCE_NOT_FOUND",
    invalidCredentials: "INVALID_CREDENTIALS",
    notSignedIn: "NOT_SIGNEDIN",
    notAllowedAccess : "NOT_ALLOWED_ACCESS",
}

const roleNames = {
    communityAdmin: "Community Admin",
    communitMember: "Community Member",
    communityModerator: "Community Moderator",
}

module.exports = {
    errorCodes,
    roleNames,
}

