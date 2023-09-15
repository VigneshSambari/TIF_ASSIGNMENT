const express = require("express")

const {  
    signin, 
    signup, 
    fetchMe,
} = require("../controllers/userControllers")

const {
    authMiddleware,
} = require("../middlewares/authMiddlewares");

const router = express.Router()

router.get("/me", authMiddleware, fetchMe);

router.post("/signup", signup);
router.post("/signin", signin);

module.exports = router;