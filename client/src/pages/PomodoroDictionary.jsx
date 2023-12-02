import React, { useEffect, useState } from 'react';
let breakDictionary = {};
const PomodoroDictionary = ({ config, pomodoro }) => {
  const [breakDictionaryState, setBreakDictionaryState] = useState({});
  useEffect(() => {
    const calculateBreaks = () => {
      console.log("Inside calculateBreaks");
      console.log("Config:", config);
      console.log("Pomodoro:", pomodoro);

      if (!config || !pomodoro || !pomodoro.startTime || !pomodoro.endTime) {
        console.log("Config or Pomodoro data is not available.");
        return;
      }

      const startTime = new Date(pomodoro.startTime);
      const endTime = new Date(pomodoro.endTime);
      const breakTime = config.breakTime;
      const breakAfter = config.breakAfter;

      let currentBreakStartTime = new Date(startTime.getTime() + breakAfter * 60000); // Dodajemy czas do rozpoczęcia pierwszej przerwy
      let currentBreakEndTime;

      const newBreakDictionary = {};

      while (currentBreakStartTime.getTime() < endTime.getTime()) {
        currentBreakEndTime = new Date(currentBreakStartTime.getTime() + breakTime * 60000);

        if (currentBreakEndTime.getTime() > endTime.getTime()) {
          currentBreakEndTime = endTime;
        }

        const breakKey = currentBreakStartTime.toISOString();
        const breakValue = currentBreakEndTime.toISOString();

        newBreakDictionary[breakKey] = breakValue;

        currentBreakStartTime = new Date(currentBreakEndTime.getTime() + breakAfter * 60000);
      }
      if (Object.keys(newBreakDictionary).length !== 0) {
        breakDictionary = newBreakDictionary;  // Zaktualizuj zmienną breakDictionary
        setBreakDictionaryState(newBreakDictionary);
        console.log("New Break Dictionary:", newBreakDictionary);
      } else {
        console.log("New Break Dictionary is empty.");
      }
    };
    calculateBreaks();
  }, [config, pomodoro]);

  useEffect(() => {
    console.log("Break Dictionary Config:", config);
    console.log("Break Dictionary Pomodoro:", pomodoro);
    console.log("Break Dictionary:", breakDictionaryState);
  }, [config, pomodoro, breakDictionaryState]);

  return null;
};
export { breakDictionary }; 
export default PomodoroDictionary;
