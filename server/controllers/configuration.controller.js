import { errorHandler } from "../utils/error.js";
import Configuration from "../models/configuration.model.js";

export const testConfiguration = (req, res) => {
        res.json({
            message: "Api test",
        });
};


export const addConfiguration = async (req, res, next) => {
    const userId = req.params.id; // Pobierz ID użytkownika z parametru URL
    const {
        name,
        durationTime,
        breakTime,
        breakAfter,
    } = req.body;
  
    // Sprawdź, czy przekazane ID użytkownika zgadza się z ID zalogowanego użytkownika
    if (req.user.id !== userId) {
      return next(errorHandler(401, 'You can only add Configurations for your own account!'));
    }
  
    try {
      const newConfiguration = new Configuration({
        userId: userId,
        name: name,
        durationTime: durationTime,
        breakAfter: breakAfter, 
        breakTime: breakTime,
      });
  
      await newConfiguration.save();
  
      res.status(201).json(newConfiguration); // Zwróć nowo utworzony obiekt configuration
    } catch (error) {
      next(error);
    }
  };
  


export const getConfigurationsForUser = async (req, res, next) => {
    const userId = req.params.id; // Pobierz ID użytkownika z parametru URL
    if (req.user.id !== userId) {
        return next(errorHandler(401, 'You can only get Configurations for your own account!'));
      }
    try {
      const configurations = await Configuration.find({ userId: userId });
      res.status(200).json(configurations);
    } catch (error) {
      next(error);
    }
};
  

export const deleteConfiguration = async (req, res, next) => {
    const userId = req.params.id; // Pobierz ID użytkownika z parametru URL
    const configurationId = req.params.configurationId; // Pobierz ID configuration z parametru URL
  
    // Sprawdź, czy przekazane ID użytkownika zgadza się z ID zalogowanego użytkownika
    if (req.user.id !== userId) {
      return next(errorHandler(401, 'You can only delete Configurations for your own account!'));
    }
  
    try {
      await Configuration.findOneAndDelete({ _id: configurationId, userId: userId });
  
      res.status(200).json({ message: 'Configuration deleted successfully.' });
    } catch (error) {
      next(error);
    }
  };

  export const updateConfiguration = async (req, res, next) => {
    const userId = req.params.id; // Pobierz ID użytkownika z parametru URL
    const configurationId = req.params.configurationId; // Pobierz ID configuration z parametru URL
    const {
        name,
        durationTime,
        breakAfter, 
        breakTime} = req.body;
  
    // Sprawdź, czy przekazane ID użytkownika zgadza się z ID zalogowanego użytkownika
    if (req.user.id !== userId) {
      return next(errorHandler(401, 'You can only update Configurations for your own account!'));
    }
  
    try {
      const updatedConfiguration = await Configuration.findOneAndUpdate(
        { _id: configurationId, userId: userId },
        {
          $set: {
            userId: userId,
            name: name,
            durationTime: durationTime,
            breakAfter: breakAfter, 
            breakTime: breakTime,
          },
        },
        { new: true }
      );
  
      res.status(200).json(updatedConfiguration);
    } catch (error) {
      next(error);
    }
  };
  
  export const getConfigurationById = async (req, res, next) => {
    const userId = req.params.id; // Pobierz ID użytkownika z parametru URL
    const configurationId = req.params.configurationId; // Pobierz ID konfiguracji z parametru URL

    // Sprawdź, czy przekazane ID użytkownika zgadza się z ID zalogowanego użytkownika
    if (req.user.id !== userId) {
      return next(errorHandler(401, 'You can only get Configurations for your own account!'));
    }

    try {
      const configuration = await Configuration.findOne({ _id: configurationId, userId: userId });

      if (!configuration) {
        return next(errorHandler(404, 'Configuration not found'));
      }

      res.status(200).json(configuration);
    } catch (error) {
      next(error);
    }
};