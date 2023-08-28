import User from "../models/user.model.js";

import bcryptjs from "bcryptjs";

export const signup = async (req, res) => {
    const {username, email, password} = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword }); // po es6 nie trzeba user:user itp
    try {
        await newUser.save();
        res.status(201).json({message: "User created!"});
    } catch(err){
        res.status(500).json({message: "Couldn't create user, username or email in use!"});
    }
 
};