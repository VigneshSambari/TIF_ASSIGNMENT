const express = require("express")

const {  
    createRole,
    fetchAll
} = require("../controllers/roleControllers")

const router = express.Router()

router.get("/", fetchAll);

router.post("/", createRole);

module.exports = router;