import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        username:{
            type: String,
            requred: true,
            unique: true,
            
        },
        email:{
            type: String,
            requred: true,
            unique: true,
        },
        password:{
            type: String,
            requred: true
        },
        photo:{
            type: String,
            default: "https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg",
        },
        refreshToken: {
            type: String,
            default: null, 
          },
    },
 {timestamps: true});

 const User = mongoose.model('User', userSchema);

 export default User;