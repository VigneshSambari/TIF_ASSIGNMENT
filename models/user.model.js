const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            unique: true,
            required: true,
        },
        name: {
            type: String,
            maxlength: 64,
        },
        email: {
            type: String,
            maxlength: 128,
            unique: true,
        },
        password: {
            type: String,
            maxlength: 64,
        },  
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: false,
        }
    }
)

module.exports = mongoose.model("User", UserSchema);