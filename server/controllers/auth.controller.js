import User from "../models/user.model.js";

import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
    const {username, email, password} = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword }); // po es6 nie trzeba user:user itp
    try {
        await newUser.save();
        res.status(201).json({message: "User created!"});
    } catch(err){
       next(err);
    }
};

export const signin = async (req, res, next) => {
    const {email, password} = req.body;
    try {
        const validUser = await User.findOne({ email });
        if (!validUser) return next(errorHandler(404, 'User not found'));
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) return next(errorHandler(401, 'wrong credentials'));
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        const {password: hashedPassword, ...rest} = validUser._doc;//destrukturyzacja usera, usuwamy hasło z response
        const expireDate = new Date(Date.now() + 3600000); //1h 
        res
        .cookie('acc_token', token, { httpOnly: true, expires: expireDate })
        .status(200)
        .json(rest);
    } catch(err){
       next(err);
    }
};

export const google = async (req, res, next) => {
    try{
        const user = await User.findOne({email: req.body.email})
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            const {password: hashedPassword, ...rest} = user._doc;
            const expireDate = new Date(Date.now() + 3600000);
            res
            .cookie('acc_token', token, { httpOnly: true, expires: expireDate })
            .status(200)
            .json(rest);
        } else{
            const generatedPassword = 
            Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser = new User({
                username: req.body.name.split(" ").join("").toLowerCase()
                 + Math.random().toString(36).slice(-8),
                email: req.body.email,
                password: hashedPassword,
                photo: req.body.photoURL,
            });
            await newUser.save();
            const token = jwt.sign({
                id: newUser._id
            }, process.env.JWT_SECRET);
            const {password: hashedPassword2, ...rest} = newUser._doc;
            const expireDate = new Date(Date.now() + 3600000);
            res
        .cookie('acc_token', token, { httpOnly: true, expires: expireDate })
        .status(200)
        .json(rest);
        }
    } catch(err){
        next(err);
    }
}