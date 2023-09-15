const express = require("express");
const cors = require("cors");

const connectDB = require("./database/db");
const userRoutes = require("./routes/userRoutes");
const communityRoutes = require("./routes/communityRoutes");
const roleRoutes = require("./routes/roleRoutes");
const memberRoutes = require("./routes/memberRoutes");

const app = express();

app.use(express.json());
app.use(cors());
app.use("/v1/auth",userRoutes);
app.use("/v1/community", communityRoutes);
app.use("/v1/role", roleRoutes);
app.use("/v1/member", memberRoutes);

const PORT = process.env.PORT || 3000;
connectDB();

app.get("/", async (req, res) => {
    res.json("Hello..");
})

app.listen(PORT, () => console.log("Server running at port:", PORT))