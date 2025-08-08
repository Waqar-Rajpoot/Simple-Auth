import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: [true, "Please provide a username"],
        unique: true,
        trim: true
    },
    email:{
        type: String,
        required: [true, "Please provide a email"],
        unique: true,
        trim: true
    },
    password:{
        type: String,
        required: [true, "Please provide a password"],
        minlength: 8
    },
    role: {
        type: String,
        enum: ["user", "admin"], 
        default: "user",
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
},
{
    timestamps: true
})

const User = mongoose.models.users || mongoose.model("users", userSchema);
export default User;