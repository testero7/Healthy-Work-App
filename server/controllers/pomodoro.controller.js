import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs';
import Pomodoro from "../models/pomodoro.model.js";
import User from "../models/user.model.js";
export const testPomodoro = (req, res) => {
        res.json({
            message: "Api test",
        });
};
// const samplePomodoro = new Pomodoro({
//     userId: '64edc3eb9faf1b0eec86be93', // Dodaj rzeczywiste dane zgodne z modelem
//     startTime: new Date(),
//     endTime: new Date(),
//     workDuration: 25, // Przykładowe dane
//     breakDuration: 5, // Przykładowe dane
//   });
  
//   samplePomodoro.save();

export const addPomodoro = async (req, res, next) => {
    const userId = req.params.id; // Pobierz ID użytkownika z parametru URL
    const { name, startTime, endTime, breakTime, breakAfter } = req.body;
  
    // Sprawdź, czy przekazane ID użytkownika zgadza się z ID zalogowanego użytkownika
    if (req.user.id !== userId) {
      return next(errorHandler(401, 'You can only add Pomodoro sessions for your own account!'));
    }
  
    try {
      const newPomodoro = new Pomodoro({
        userId: userId,
        name: name,
        startTime: startTime,
        endTime: endTime,
        breakTime: breakTime || 15,
        breakAfter: breakAfter || 120
      });
  
      await newPomodoro.save();
  
      res.status(201).json(newPomodoro); // Zwróć nowo utworzony obiekt Pomodoro
    } catch (error) {
      next(error);
    }
  };
  


export const getPomodorosForUser = async (req, res, next) => {
    const userId = req.params.id; // Pobierz ID użytkownika z parametru URL
    if (req.user.id !== userId) {
        return next(errorHandler(401, 'You can only get Pomodoro sessions for your own account!'));
      }
    try {
      const pomodoros = await Pomodoro.find({ userId: userId });
      res.status(200).json(pomodoros);
    } catch (error) {
      next(error);
    }
};
  

export const deletePomodoro = async (req, res, next) => {
    const userId = req.params.id; // Pobierz ID użytkownika z parametru URL
    const pomodoroId = req.params.pomodoroId; // Pobierz ID sesji Pomodoro z parametru URL
  
    // Sprawdź, czy przekazane ID użytkownika zgadza się z ID zalogowanego użytkownika
    if (req.user.id !== userId) {
      return next(errorHandler(401, 'You can only delete Pomodoro sessions for your own account!'));
    }
  
    try {
      await Pomodoro.findOneAndDelete({ _id: pomodoroId, userId: userId });
  
      res.status(200).json({ message: 'Pomodoro session deleted successfully.' });
    } catch (error) {
      next(error);
    }
  };

  export const updatePomodoro = async (req, res, next) => {
    const userId = req.params.id; // Pobierz ID użytkownika z parametru URL
    const pomodoroId = req.params.pomodoroId; // Pobierz ID sesji Pomodoro z parametru URL
    const { name, startTime, endTime, breakTime, breakAfter } = req.body;
  
    // Sprawdź, czy przekazane ID użytkownika zgadza się z ID zalogowanego użytkownika
    if (req.user.id !== userId) {
      return next(errorHandler(401, 'You can only update Pomodoro sessions for your own account!'));
    }
  
    try {
      const updatedPomodoro = await Pomodoro.findOneAndUpdate(
        { _id: pomodoroId, userId: userId },
        {
          $set: {
            name: name,
            startTime: startTime,
            endTime: endTime,
            breakTime: breakTime,
            breakAfter: breakAfter
          },
        },
        { new: true }
      );
  
      res.status(200).json(updatedPomodoro);
    } catch (error) {
      next(error);
    }
  };