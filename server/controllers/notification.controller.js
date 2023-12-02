import Notification from "../models/notification.model.js";
import { errorHandler } from "../utils/error.js";

// Testowa metoda do wysyłania powiadomień
export const testNotification = (req, res) => {
  // Tutaj możesz zaimplementować logikę wysyłania testowego powiadomienia
  res.status(200).json({ message: 'Test notification sent!' });
};

// Pobierz powiadomienia dla danego użytkownika
export const getNotification = async (req, res, next) => {
  const userId = req.params.id;
  if (req.user.id !== userId) {
    return next(errorHandler(401, 'You can only get notifications for your own account!'));
  }
  try {
    const notification = await Notification.findOne({ userId: userId });
    res.status(200).json(notification);
  } catch (error) {
    next(error);
  }
};

// Dodaj nowe ustawienia powiadomień dla danego użytkownika
export const addNotification = async (req, res, next) => {
  const userId = req.params.id;
  const { waterNoti, stretchNoti, eyeNoti, postureNoti, lightNoti } = req.body;
  if (req.user.id !== userId) {
    return next(errorHandler(401, 'You can only add notifications for your own account!'));
  }
  try {
    const newNotification = new Notification({
      userId: userId,
      waterNoti: waterNoti || 15,
      stretchNoti: stretchNoti || 120,
      eyeNoti: eyeNoti || 30,
      postureNoti: postureNoti || 180,
      lightNoti: lightNoti || 60,
    });

    await newNotification.save();

    res.status(201).json(newNotification);
  } catch (error) {
    next(error);
  }
};

// Usuń ustawienia powiadomień dla danego użytkownika
export const deleteNotification = async (req, res, next) => {
  const userId = req.params.id;
  const notificationId = req.params.notificationId;
  if (req.user.id !== userId) {
    return next(errorHandler(401, 'You can only delete notifications for your own account!'));
  }
  try {
    await Notification.findOneAndDelete({ _id: notificationId, userId: userId });
    res.status(200).json({ message: 'Notification settings deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// Zaktualizuj ustawienia powiadomień dla danego użytkownika
export const updateNotification = async (req, res, next) => {
  const userId = req.params.id;
  const notificationId = req.params.notificationId;
  const { waterNoti, stretchNoti, eyeNoti, postureNoti, lightNoti } = req.body;
  
  if (req.user.id !== userId) {
    return next(errorHandler(401, 'You can only update notifications for your own account!'));
  }

  try {
    const updatedNotification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId: userId },
      {
        $set: {
          waterNoti: waterNoti,
          stretchNoti: stretchNoti,
          eyeNoti: eyeNoti,
          postureNoti: postureNoti,
          lightNoti: lightNoti,
        },
      },
      { new: true }
    );

    res.status(200).json(updatedNotification);
  } catch (error) {
    next(error);
  }
};
