const mongoose = require("mongoose");

const CommunitySchema = new mongoose.Schema(
    {
        id: {
            type: String,
            unique: true,
            required: true,
        },
        name: {
            type: String,
            maxlength: 128,
        },
        slug: {
            type: String,
            maxlength: 255,
            unique: true,
        },
        owner: {
            type: String,
            ref: "User",
            localField: "owner",
            foreignField: "id",
        } 
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    }
)

module.exports = mongoose.model("Community", CommunitySchema);