const mongoose = require("mongoose");

const MemberSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            unique: true,
            required: true,
        },
        community: {
            type: String,
            ref: "Community",
            localField: "community",
            foreignField: "id",
        },
        user: {
            type: String,
            ref: "User",
            localField: "user",
            foreignField: "id",
        },
        role: {
            type: String,
            ref: "Role",
            localField: "role",
            foreignField: "id",
        },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: false,
        }
    }
)

module.exports = mongoose.model("Member", MemberSchema);