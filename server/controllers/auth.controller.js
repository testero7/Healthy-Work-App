import User from "../models/user.model.js";

import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

// Funkcja do generowania Refresh Tokena
const generateRefreshToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' }); // Przykładowy okres ważności: 7 dni
  };
  
  export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);

    try {
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        // Generuj Refresh Token
        const refreshToken = generateRefreshToken(newUser._id);

        console.log('Generated RefreshToken:', refreshToken);

        // Zapisz Refresh Token w polu refreshToken użytkownika
        newUser.refreshToken = refreshToken;
        await newUser.save();

        console.log('Saved RefreshToken in the database:', newUser.refreshToken);

        // Ustaw ciasteczko z AccessToken
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
        const expireDate = new Date(Date.now() + 3600000); // 1 godzina

        // Ustaw ciasteczko z RefreshToken
        res
            .cookie('acc_token', token, { httpOnly: true, expires: expireDate })
            .cookie('refresh_token', refreshToken, { httpOnly: true, expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }) // Przykładowy okres ważności: 7 dni
            .status(201)
            .json({ message: "User created!", refreshToken });

    } catch (err) {
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
        const newRefreshToken = generateRefreshToken(validUser._id);
        validUser.refreshToken = newRefreshToken;
        await validUser.save();
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        const {password: hashedPassword, ...rest} = validUser._doc;//destrukturyzacja usera, usuwamy hasło z response
        const expireDate = new Date(Date.now() + 3600000); //1h 
        res
        .cookie('acc_token', token, { httpOnly: true, expires: expireDate })
        .cookie('refresh_token', newRefreshToken, { httpOnly: true, expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }) // 7 days
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
            const newRefreshToken = generateRefreshToken(user._id);
            user.refreshToken = newRefreshToken;
            await user.save();
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            const {password: hashedPassword, ...rest} = user._doc;
            const expireDate = new Date(Date.now() + 3600000);
            res
            .cookie('acc_token', token, { httpOnly: true, expires: expireDate })
            .cookie('refresh_token', newRefreshToken, { httpOnly: true, expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }) // 7 days
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
            const refreshToken = generateRefreshToken(newUser._id);

            // Save Refresh Token to the user's refreshToken field in the database
            newUser.refreshToken = refreshToken;
            await newUser.save();
            const token = jwt.sign({
                id: newUser._id
            }, process.env.JWT_SECRET);
            const {password: hashedPassword2, ...rest} = newUser._doc;
            const expireDate = new Date(Date.now() + 3600000);
            res
        .cookie('acc_token', token, { httpOnly: true, expires: expireDate })
        .cookie('refresh_token', refreshToken, { httpOnly: true, expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }) // 7 days
        .status(200)
        .json(rest);
        }
    } catch(err){
        next(err);
    }
}
export const refreshAccessToken = async (req, res, next) => {
    const refreshToken = req.body.refreshToken;
  
    try {
      // Sprawdź poprawność Refresh Tokena
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  
      // Znajdź użytkownika na podstawie ID w Refresh Tokenie
      const user = await User.findById(decoded.id);
  
      if (!user) {
        return next(errorHandler(404, 'User not found'));
      }
  
      // Generuj nowy Refresh Token
      const newRefreshToken = generateRefreshToken(user._id);
  
      // Zapisz nowy Refresh Token w bazie danych
      user.refreshToken = newRefreshToken;
      await user.save();
  
      // Wygeneruj nowy JWT
      const newAccessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  
      // Zwróć nowy token do klienta
      res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (error) {
      // Obsłuż błędy związane z Refresh Tokenem
      return next(errorHandler(401, 'Invalid Refresh Token'));
    }
  };
  
  export const signout = (req, res) => {
    res
      .clearCookie('acc_token')
      .clearCookie('refresh_token')
      .status(200)
      .json({ message: 'Sign out successful!' });
  };
  