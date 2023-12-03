import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs';
import Pomodoro from "../models/pomodoro.model.js";
import User from "../models/user.model.js";
export const testPomodoro = (req, res) => {
        res.json({
            message: "Api test",
        });
};


export const addPomodoro = async (req, res, next) => {
  const userId = req.params.id; // Pobierz ID użytkownika z parametru URL
  const confId = req.params.confId; // Pobierz ID konfiguracji z parametru URL
  const { name, startTime, endTime, allTime, breakTime, breakCounter } = req.body;

  
  if (req.user.id !== userId) {
      return next(errorHandler(401, 'You can only add Pomodoro sessions for your own account!'));
  }

  try {
      const newPomodoro = new Pomodoro({
          userId: userId,
          confId: confId,
          name: name,
          startTime: startTime,
          endTime: endTime,
          allTime: allTime,
          breakCounter: breakCounter,
          breakTime: breakTime,
      });

      await newPomodoro.save();

      res.status(201).json(newPomodoro); // Zwróć nowo utworzony obiekt Pomodoro
  } catch (error) {
      next(error);
  }
};
  


export const getPomodorosForUser = async (req, res, next) => {
    const userId = req.params.id; 
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
  
export const getPomodoroById = async (req, res, next) => {
  const userId = req.params.id; 
  const pomodoroId = req.params.pomodoroId; 

  
  if (req.user.id !== userId) {
    return next(errorHandler(401, 'You can only get Pomodoro sessions for your own account!'));
  }

  try {
    const pomodoro = await Pomodoro.findOne({ _id: pomodoroId, userId: userId });

    if (!pomodoro) {
      return next(errorHandler(404, 'Pomodoro session not found'));
    }

    res.status(200).json(pomodoro);
  } catch (error) {
    next(error);
  }
};


export const deletePomodoro = async (req, res, next) => {
    const userId = req.params.id; 
    const pomodoroId = req.params.pomodoroId; 
  
    
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
    const userId = req.params.id;
    const pomodoroId = req.params.pomodoroId;
    const updateFields = req.body;  
  
    if (req.user.id !== userId) {
      return next(errorHandler(401, 'You can only update Pomodoro sessions for your own account!'));
    }
  
    try {
      const updatedPomodoro = await Pomodoro.findOneAndUpdate(
        { _id: pomodoroId, userId: userId },
        { $set: updateFields }, // Użyj wszystkich pól
        { new: true }
      );
  
      res.status(200).json(updatedPomodoro);
    } catch (error) {
      next(error);
    }
  };