import express from 'express';
import { google, signin, signup, signout, refreshAccessToken } from '../controllers/auth.controller.js';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);
router.get("/signout", signout);
router.post('/refresh-token', async (req, res, next) => {
  const refreshToken = req.body.refreshToken;

  try {
    // Znajdź użytkownika na podstawie Refresh Tokena
    const user = await User.findOne({ refreshToken: refreshToken });

    if (!user) {
      res.clearCookie('acc_token');
      res.clearCookie('refresh_token');
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Sprawdź, czy Refresh Token istnieje w bazie danych
    if (user.refreshToken !== refreshToken) {
      // Wyczyść ciasteczka acc_token i refresh_token
      
      res.clearCookie('acc_token');
      res.clearCookie('refresh_token');
      return next(errorHandler(401, 'Invalid Refresh Token'));
    }

    // Wygeneruj nowy JWT
    const newAccessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    // Ustaw nowy AccessToken w ciasteczku
    const expireDate = new Date(Date.now() + 3600000); // 1 godzina
    res.cookie('acc_token', newAccessToken, { httpOnly: true, expires: expireDate });

    // Zwróć nowy token do klienta
    return res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    // Obsłuż błędy związane z Refresh Tokenem
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      // Wyczyść ciasteczka acc_token i refresh_token
      res.clearCookie('acc_token');
      res.clearCookie('refresh_token');

      return next(errorHandler(401, 'Invalid Refresh Token'));
    } else {
      next(error);
    }
  }
});


export default router;
