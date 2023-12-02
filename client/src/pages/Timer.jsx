import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PomodoroDictionary from './PomodoroDictionary';
import { breakDictionary } from './PomodoroDictionary';
const Timer = () => {
  const [config, setConfig] = useState(null);
  const { configId, pomodoroId } = useParams();
  const [pomodoro, setPomodoro] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [inBreak, setInBreak] = useState(false);
  const [breakTimeLeft, setBreakTimeLeft] = useState(null);
  const [timeToNextBreak, setTimeToNextBreak] = useState(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const userId = currentUser._id;
  const [totalBreakTime, setTotalBreakTime] = useState(0);
const [notifications, setNotifications] = useState([]);
const notificationAudio = new Audio("https://firebasestorage.googleapis.com/v0/b/mern-app-426e4.appspot.com/o/notification.mp3?alt=media&token=49c44446-5612-4dc3-ab91-7e750ce70b5a");

function getRefreshToken() {
  // Załóżmy, że currentUser jest dostępny w danym kontekście
  const refreshToken = currentUser ? currentUser.refreshToken : null;
  return refreshToken;
}
async function refreshAccessToken(refreshToken) {
  try {
    const response = await fetch('/api/auth/refresh-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (response.ok) {
      const { accessToken } = await response.json();
      return accessToken;
    } else {
      throw new Error('Błąd odświeżania tokenu');
    }
  } catch (error) {
    console.error('Błąd odświeżania tokenu:', error);
    throw error;
  }
}


async function authenticatedFetch(url, options) {
  try {
    const refreshToken = getRefreshToken();
    const newAccessToken = await refreshAccessToken(refreshToken);
    const response = await fetch(url, options);

    if (!response) {
      throw new Error('Undefined response received');
    }

    if (response.status === 401) {
      

      if (!refreshToken) {
        console.error('Unauthorized request. No refresh token available.');
        throw new Error('Unauthorized request');
      }

      

      // Retry the original request with the new access token
      const newOptions = {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${newAccessToken}`,
        },
      };

      return fetch(url, newOptions);
    }

    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}


useEffect(() => {
  // Sprawdź, czy config jest dostępny przed użyciem
  if (config && inBreak && breakTimeLeft === config.breakTime * 60) {
      toast('Break has started!', {
          position: toast.POSITION.BOTTOM_RIGHT,
          className: "toast-message",
          onChange: notificationAudio.play(),
          progressClassName: "toast-progress",
          autoClose: 5000
      });
  }
  // Sprawdź, czy config jest dostępny przed użyciem
  if (config && inBreak && breakTimeLeft === 0) {
      toast('Break has ended!', {
          position: toast.POSITION.BOTTOM_RIGHT,
          className: "toast-message",
          onChange: notificationAudio.play(),
          progressClassName: "toast-progress",
          autoClose: 5000
      });
  }
}, [inBreak, breakTimeLeft, config]);

useEffect(() => {
  toast('Test notification', {
    position: toast.POSITION.BOTTOM_RIGHT,
    className: "toast-message",
    progressClassName: "toast-progress", 
    onChange: notificationAudio.play(),
    autoClose: 5000,
  });
}, []);

console.log("Break Dictionary in Another File:", breakDictionary);
useEffect(() => {
  // Call the getNotifications function here
  const notificationIds = getNotifications();

  // Clear scheduled notifications in the cleanup function
  return () => {
    // Check if notificationIds is an array before calling forEach
    if (Array.isArray(notificationIds)) {
      notificationIds.forEach((notificationId) => {
        clearInterval(notificationId);
      });
    }
  };
}, [/* dependencies */]);

const getNotifications = async () => {
  try {
    const response = await authenticatedFetch(`/api/notification/getNotification/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Nie udało się pobrać powiadomień');
    }

    const data = await response.json();
    console.log('Pobrano powiadomienia:', data);

    // Przekształć czas z sekund na minuty
    const notificationsInMinutes = {
      eyeNoti: data.eyeNoti,
      waterNoti: data.waterNoti,
      stretchNoti: data.stretchNoti,
      postureNoti: data.postureNoti,
      lightNoti: data.lightNoti,
    };

    setNotifications(notificationsInMinutes);

    // Clear existing notifications
    toast.dismiss();

    // Schedule new notifications
    const scheduledNotificationIds = scheduleNotifications(notificationsInMinutes);
    console.log('Notifications scheduled.'); // Add this line

    return scheduledNotificationIds; // This line should be replaced with the correct array of notification IDs
  } catch (error) {
    console.error(error);
    return [];
  }
};
const scheduleNotifications = (notifications) => {
  const scheduledNotificationIds = [];

  Object.entries(notifications).forEach(([notificationType, intervalInMinutes]) => {
    if (intervalInMinutes > 0) {
      const intervalInMilliseconds = intervalInMinutes * 60 * 1000;

      const notificationId = setInterval(() => {
        let message = '';

        // Set message based on notification type
        switch (notificationType) {
          case 'eyeNoti':
            message = 'Take care of your eyes';
            break;
          case 'waterNoti':
            message = 'Stay hydrated, drink water';
            break;
          case 'stretchNoti':
            message = 'Time to stretch your body';
            break;
          case 'postureNoti':
            message = 'Check your posture';
            break;
          case 'lightNoti':
            message = 'Adjust your lighting';
            break;
          default:
            message = 'Time to take care of something';
        }

        // Wyświetl powiadomienie Toastify
        toast(message, {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 10000, // Czas wyświetlania w milisekundach
          progressClassName: "toast-progress", 
          onChange: notificationAudio.play(),
          className: "toast-message"
        });
      }, intervalInMilliseconds);

      scheduledNotificationIds.push(notificationId);

      // Log countdown in the console
      let countdown = intervalInMinutes;
      const countdownInterval = setInterval(() => {
        console.log(`Next ${notificationType} notification in: ${countdown} minutes`);
        countdown -= 1;

        if (countdown < 0) {
          clearInterval(countdownInterval);
        }
      }, 60 * 1000);
    }
  });

  return scheduledNotificationIds;
};

useEffect(() => {
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden' && pomodoro && !inBreak) {
      const now = new Date();
      localStorage.setItem('breakStart', now.toISOString());
    }
  };

    const handleWindowBlur = () => {
      if (pomodoro && !inBreak) {
        const now = new Date();
        localStorage.setItem('breakStart', now.toISOString());
      }
    };

    const handleWindowFocus = () => {
      if (pomodoro && !inBreak) {
        const storedBreakStart = localStorage.getItem('breakStart');
        if (storedBreakStart) {
          const breakStart = new Date(storedBreakStart);
          const elapsedDuringBreak = new Date() - breakStart;
          const remainingBreakTime = breakTimeLeft - Math.floor(elapsedDuringBreak / 1000);
          setBreakTimeLeft(remainingBreakTime > 0 ? remainingBreakTime : 0);
          localStorage.removeItem('breakStart');
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [pomodoro, inBreak, breakTimeLeft]);

  useEffect(() => {
    const getConfigurationById = async () => {
      try {
        const response = await authenticatedFetch(`/api/configuration/getConfiguration/${userId}/${configId}`);

        if (!response.ok) {
          throw new Error('Nie udało się pobrać konfiguracji');
        }

        const data = await response.json();
        console.log('Pobrano konfigurację:', data);
        setConfig(data);

        const breakDuration = data.breakTime * 60;
        setBreakTimeLeft((prev) => {
          if (prev === null) {
            const storedBreakTimeLeft = localStorage.getItem('breakTimeLeft');
            return storedBreakTimeLeft !== null ? parseInt(storedBreakTimeLeft, 10) : breakDuration;
          } else {
            return prev;
          }
        });
      } catch (error) {
        console.error(error);
      }
    };

    getConfigurationById();
  }, [configId]);

  const getPomodoroById = async () => {
    try {
      const response = await authenticatedFetch(`/api/pomodoro/getPomodoro/${userId}/${pomodoroId}`);

      if (!response.ok) {
        throw new Error('Nie udało się pobrać sesji Pomodoro');
      }

      const data = await response.json();
      console.log('Pobrano sesję Pomodoro:', data);
      setPomodoro(data);
      setDataLoaded(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPomodoroById();
  }, [pomodoroId]);

  useEffect(() => {
    const storedTotalBreakTime = localStorage.getItem('totalBreakTime');
    if (storedTotalBreakTime !== null) {
      setTotalBreakTime(parseInt(storedTotalBreakTime, 10));
    }

    const storedBreakStart = localStorage.getItem('breakStart');
    const storedBreakEnd = localStorage.getItem('breakEnd');

    if (storedBreakStart && storedBreakEnd) {
      const breakStartTime = new Date(storedBreakStart);
      const breakEndTime = new Date(storedBreakEnd);
      const diffDuringBreak = breakEndTime - new Date();

      if (diffDuringBreak > 0) {
        setInBreak(true);
        setBreakTimeLeft(Math.floor(diffDuringBreak / 1000));
      } else {
        localStorage.removeItem('breakStart');
        localStorage.removeItem('breakEnd');
        setBreakTimeLeft(null);
      }
    }
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const end = new Date(pomodoro.endTime);
  
      // Check if current time is within break intervals
      const breakInterval = Object.entries(breakDictionary).find(([start, end]) => {
        const breakStartTime = new Date(start);
        const breakEndTime = new Date(end);
        return now >= breakStartTime && now <= breakEndTime;
      });
  
      if (breakInterval) {
        setInBreak(true);
        const [breakStart, breakEnd] = breakInterval;
  
        // Calculate breakTimeLeft based on the difference between breakStart and breakEnd
        const breakStartTime = new Date(breakStart);
        const breakEndTime = new Date(breakEnd);
        const diffDuringBreak = breakEndTime - now;
        setBreakTimeLeft(Math.floor(diffDuringBreak / 1000));
  
        // Store breakStart and breakEnd in localStorage for consistency
        localStorage.setItem('breakStart', breakStartTime.toISOString());
        localStorage.setItem('breakEnd', breakEndTime.toISOString());
      } else {
        if (inBreak) {
          // Check if the break has just finished
          if (breakTimeLeft === 0) {
            setInBreak(false);
            setBreakTimeLeft(null);
            localStorage.removeItem('breakStart');
            localStorage.removeItem('breakEnd');
            localStorage.removeItem('breakTimeLeft');
            setTimeToNextBreak(null);
          } else {
            // Continue decrementing breakTimeLeft
            setBreakTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
          }
        } else {
          // Find the next break start time
          const nextBreakStart = Object.keys(breakDictionary).find((start) => {
            const breakStartTime = new Date(start);
            return breakStartTime > now;
          });
  
          if (nextBreakStart) {
            const nextBreakStartTime = new Date(nextBreakStart);
            const timeToNextBreak = nextBreakStartTime - now;
  
            const minutes = Math.floor(timeToNextBreak / (1000 * 60));
            const seconds = Math.floor((timeToNextBreak % (1000 * 60)) / 1000);
  
            // Store timeToNextBreak as an object
            const timeToNextBreakObject = {
              minutes,
              seconds,
            };
  
            setTimeToNextBreak(timeToNextBreakObject);
            localStorage.setItem('timeToNextBreak', JSON.stringify(timeToNextBreakObject));
          } else {
            // If no more breaks today, reset timeToNextBreak
            setTimeToNextBreak(null);
            localStorage.removeItem('timeToNextBreak');
          }
        }
      }
    }, 1000);
  
    return () => clearInterval(intervalId);
  }, [pomodoro, config, breakDictionary, inBreak, breakTimeLeft]);
  
  
  
  useEffect(() => {
    if (!inBreak && breakTimeLeft !== null && breakTimeLeft > 0) {
      const countdownIntervalId = setInterval(() => {
        setBreakTimeLeft((prev) => prev - 1);
      }, 1000);
  
      return () => clearInterval(countdownIntervalId);
    }
  }, [inBreak, breakTimeLeft]);

  useEffect(() => {
    if (timeToNextBreak !== null && timeToNextBreak.minutes === 0 && timeToNextBreak.seconds === 0) {
      setInBreak(true);
      const breakDuration = config.breakTime * 60;
      setBreakTimeLeft(breakDuration);

      const breakStart = new Date();
      const breakEnd = new Date(breakStart.getTime() + breakDuration * 1000);

      localStorage.setItem('breakStart', breakStart.toISOString());
      localStorage.setItem('breakEnd', breakEnd.toISOString());
      localStorage.setItem('breakTimeLeft', breakDuration.toString());

      setTimeToNextBreak(null);
    }
  }, [timeToNextBreak, pomodoro]);

  const calculateTime = (endTime, isBreak) => {
    if (!endTime) return '';

    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;

    if (diff <= 0) {
      return 'Finished';
    } else {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
  };

  return (

    <div className="flex justify-center items-center h-screen">
      
      <div className=" bg-black text-white  rounded-3xl mb-52">
        <div className=" p-28 bg-cyan-400 m-7 " style={{ background: 'linear-gradient(-45deg, #1f272b 0%, #1f272b 50%, #1b1f21 50%, #1b1f21 100%)' }}>
          {inBreak ? (
            <div>
              <p className='text-6xl text-white'>
                {inBreak
                  ? (pomodoro && calculateTime(pomodoro.endTime))
                  : (breakTimeLeft !== null
                    ? `${Math.floor(breakTimeLeft / 3600).toString().padStart(2, '0')}:${Math.floor((breakTimeLeft % 3600) / 60).toString().padStart(2, '0')}:${(breakTimeLeft % 60).toString().padStart(2, '0')}`
                    : '00:00:00')}
              </p>

              {breakTimeLeft !== null && (
                <p className='mt-4 text-red-500'>Break time left: {`${Math.floor(breakTimeLeft / 3600).toString().padStart(2, '0')}:${Math.floor((breakTimeLeft % 3600) / 60).toString().padStart(2, '0')}:${(breakTimeLeft % 60).toString().padStart(2, '0')}`}</p>
              )}
            </div>
          ) : (
            <div>
              <p className='text-6xl text-white'>{pomodoro && calculateTime(pomodoro.endTime)}</p>

              {timeToNextBreak !== null && (
                <p className='mt-4 text-green-500'>
                  Time to next break: {`${timeToNextBreak.minutes.toString().padStart(2, '0')}:${timeToNextBreak.seconds.toString().padStart(2, '0')}`}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      <PomodoroDictionary config={config} pomodoro={pomodoro} />
    </div>
  );
};

export default Timer;
