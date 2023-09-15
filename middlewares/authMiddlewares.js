const jwt = require("jsonwebtoken");
const config = require("config");
const JwtKey = config.get("JwtKey");

const {statusEnum} = require("../utils/response_handling/statusCodes");
const { returnError, errorStructure } = require("../utils/response_handling/responseHandler");
const { errorCodes } = require("../utils/constants");

const authError= returnError(
  {
    status: false,
    errors: [
      errorStructure(
        {
          code: errorCodes.notSignedIn,
          message: "You need to signin to proceed.",
        }
      )
    ]
  }
);

const authMiddleware = async (req, res, next) => {
  if(!req.headers.authorization){
    return res.status(statusEnum.UNAUTHORISED).json(authError);
  }
  const token = req.headers.authorization.split(' ')[1];
  if (!token) { 
    return res.status(statusEnum.UNAUTHORISED).json(authError);
  }

  try {
    const decode = jwt.verify(token, JwtKey);
    req.user = decode;
    next();
  } catch (err) {
    console.log("err in auth middleware ");
    return res.status(statusEnum.BAD_REQUEST).json(serverError({error: err}));
  }
};

module.exports = {authMiddleware};