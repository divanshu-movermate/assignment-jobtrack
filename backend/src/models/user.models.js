const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");




const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ["admin", "staff"],
            default: "staff",
        },
        assignedJobs: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Job",
            },
            ],

    },
    {
        timestamps: {
            createdAt: true,
        }
    }
);



userSchema.pre("save", async function(next){
    if(!this.isModified('password')) return next;
    this.password = await bcrypt.hash(this.password,10)
    next;
})

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password,this.password)
}












module.exports = mongoose.model("User", userSchema)