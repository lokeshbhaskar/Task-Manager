import mongoose from "mongoose";

const userSchema = new mongoose.Schema
    ({
        name: { type: String, required: true },
        email: { type: String, required: true ,unique: true },
        password: { type: String, required: true, unique:true },
        profileImageUrl: { type: String, default:null },
        role: { type: String, enum:["admin","member"], default:"member" },//role based access
    },
    {
        timestamps:true
    }
);
const User = mongoose.model("User",userSchema);
export default User;
