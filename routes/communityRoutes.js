const express = require("express")

const {  
    createCommunity,
    fetchAll,
    getOwnCommunity,
    getMemberCommunity,
    getAllMembers,
} = require("../controllers/communityControllers")

const {
    authMiddleware,
} = require("../middlewares/authMiddlewares");

const router = express.Router()

router.get("/", fetchAll);
router.get("/:id/members", getAllMembers);
router.get("/me/owner", authMiddleware, getOwnCommunity);
router.get("/me/member", authMiddleware, getMemberCommunity);

router.post("/", authMiddleware, createCommunity);

module.exports = router;