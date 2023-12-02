import express from 'express';
import { google, signin, signup, signout } from '../controllers/auth.controller.js';
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
      // Sprawdź poprawność Refresh Tokena
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  
      // Znajdź użytkownika na podstawie ID w Refresh Tokenie
      const user = await User.findById(decoded.id);
  
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
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
      return next(errorHandler(401, 'Invalid Refresh Token'));
    }
  });

export default router;
