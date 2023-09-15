const express = require("express")

const {  
    addMember,
    deleteMember,
} = require("../controllers/memberController");

const { authMiddleware } = require("../middlewares/authMiddlewares");

const router = express.Router()

router.delete("/:communityId/:userId", authMiddleware, deleteMember);

router.post("/", authMiddleware, addMember);

module.exports = router;