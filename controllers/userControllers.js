const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { Snowflake } = require('@theinternetfolks/snowflake');

const User = require("../models/user.model");
const {statusEnum} = require("../utils/response_handling/statusCodes");
const { returnError, errorStructure, returnResponse, serverError } = require("../utils/response_handling/responseHandler");
const { signUpValidator, signInValidator } = require("../utils/input_validations/validators");
const { errorCodes } = require("../utils/constants");
const { cvtValidationResp } = require("../utils/input_validations/validatorHandler");

//Generate encryped password
const generateEncryptedPassword = async (password) => {
    let salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

//Generate token from email and id
const generateToken = ({data}) =>{
    return jwt.sign({
        data
    }, config.get("JwtKey"))
}

//Signup user
const signup = async (req, res) => {
   try {
        const { error, value } = signUpValidator.validate(req.body, { abortEarly: false });

       if(error){
            return res.status(statusEnum.BAD_REQUEST).json(cvtValidationResp({errors: error}));
       }

      const {
            email,
            name, 
            password,
       } = req.body;

       const existingUser = await User.findOne({email})

       if (existingUser){
            return res.status(statusEnum.BAD_REQUEST).json(returnError(
                {
                    status: false,
                    errors: [
                        errorStructure(
                            {
                                param: "email",
                                code: errorCodes.resoureExists,
                                message: "User with this email address already exists."
                            })
                        ]
                }
            ));
       } 
           
       const hashedPassword = await generateEncryptedPassword(password);
       const snowflakeId = Snowflake.generate();

       const result = await User.create(
            {
                email, 
                password: hashedPassword, 
                name: name, 
                id: snowflakeId
            }
        )
        
       const resultObj = result.toObject();
       delete resultObj.password
       delete resultObj.__v;
       delete resultObj._id;
       resultObj.mongodb_id = result._id;

       const token = generateToken({data: resultObj})
       

       return res.status(statusEnum.OK).json(returnResponse(
        {
            status: true,
            data: resultObj,
            meta: {
                access_token: token,
            }
        }
       ));
   } catch (err) {
       return res.status(statusEnum.BAD_REQUEST).json(serverError({error: err}));
   }
}


//SignIn a user with email and password 
const signin = async (req, res) => {
    try {
        const { error, value} = signInValidator.validate(req.body, { abortEarly: false })

        if(error){
            return res.status(statusEnum.BAD_REQUEST).json(cvtValidationResp({errors: error}))
        }

        const {email, password} = req.body;

        const existingUser = await User.findOne({email})

        if (!existingUser){
            return res.status(statusEnum.NOT_FOUND).json(returnError(
                {
                    status: false,
                    errors: [
                        errorStructure({
                            code: errorCodes.resourceNotFound,
                            message: "User with email doesnot exist.",
                            param: "email",
                        })
                    ]
                }
            ));
        } 
            
        const isPasswordOk = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordOk){
            return res.status(statusEnum.BAD_REQUEST).json(returnError(
                {
                    status: false,
                    errors: [
                        errorStructure({
                            param: "password",
                            message: "The credentials you provided are invalid.",
                            code: errorCodes.invalidCredentials,
                        })
                    ]
                }
            ));
        } 
            
        const resultObj = existingUser.toObject();
        delete resultObj.password
        delete resultObj.__v;
        delete resultObj._id;
        resultObj.mongodb_id = existingUser._id;

        const token = generateToken({data: resultObj})
        
        return res.status(statusEnum.OK).json(returnResponse(
            {
                status: true,
                data: resultObj,
                meta: {
                    access_token: token,
                }
            }
        ));

    } catch (err) {
        return res.status(statusEnum.BAD_REQUEST).json(serverError({error: err}));
    }    
        
}


//Sends back user details which were decrypted by auth middleware.
const fetchMe = (req, res) => {
    try{
        return res.status(statusEnum.OK).json(returnResponse({
            data: req.user.data,
            status: true,
        }))
    }
    catch(err){
        return res.status(statusEnum.BAD_REQUEST).json(serverError({error: err}));
    }
}

module.exports = {
    signin,
    signup,
    fetchMe,
}
