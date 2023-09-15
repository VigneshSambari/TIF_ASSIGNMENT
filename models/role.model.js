const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            unique: true,
            required: true,
        },
        name: {
            type: String,
            maxlength: 64,
            unique: true,
        },
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    }
)

module.exports = mongoose.model("Role", RoleSchema);