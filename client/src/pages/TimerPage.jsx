import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import moment from 'moment';

const TimerPage = () => {
  const { id } = useParams();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const userId = currentUser._id;
  const [config, setConfig] = useState(null);
  const [pomodoro, setPomodoro] = useState(null);
  const [timerStarted, setTimerStarted] = useState(false);
  const [timerValue, setTimerValue] = useState(0);
  const navigate = useNavigate();

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



  const getPomodoroById = async (pomodoroId) => {
    try {
      const response = await authenticatedFetch(`/api/pomodoro/getPomodoro/${userId}/${pomodoroId}`);
      
      if (!response.ok) {
        throw new Error('Nie udało się pobrać sesji Pomodoro');
      }

      const data = await response.json();
      console.log('Pobrano sesję Pomodoro:', data);
      setPomodoro(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const getConfigurationById = async () => {
      try {
        const response = await authenticatedFetch(`/api/configuration/getConfiguration/${userId}/${id}`);
        
        if (!response.ok) {
          throw new Error('Nie udało się pobrać konfiguracji');
        }

        const data = await response.json();
        console.log('Pobrano konfigurację:', data);
        setConfig(data);
      } catch (error) {
        console.error(error);
      }
    };

    getConfigurationById();
  }, [id]);

  useEffect(() => {
    const updateTimerValue = () => {
      const now = moment();
      const endTime = moment(pomodoro.endTime);
      const diff = endTime.diff(now, 'seconds');
      setTimerValue(diff > 0 ? diff : 0);
    };

    const interval = setInterval(() => {
      updateTimerValue();
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [pomodoro]);

  useEffect(() => {
    const updateStartEndTime = () => {
      const startTimeElem = document.getElementById('startTime');
      const endTimeElem = document.getElementById('endTime');

      if (startTimeElem && endTimeElem) {
        startTimeElem.textContent = moment().format('LLL');
        endTimeElem.textContent = moment().add(config?.durationTime, 'minutes').format('LLL');
      }
    };

    const interval = setInterval(() => {
      updateStartEndTime();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [config]);

  const startTimer = async () => {
    if (!config) return;
  
    // Resetujemy wartości w localStorage
    localStorage.setItem('breakTimeLeft', '0');
    localStorage.setItem('totalBreakTime', '0');
    localStorage.setItem('elapsedTime', '0');
    localStorage.removeItem('breakStart'); // Usuwamy breakStart
    localStorage.removeItem('breakEnd'); // Usuwamy breakEnd
  
    const { durationTime } = config;
  
    const startTime = moment().toDate();
    const endTime = moment().add(durationTime, 'minutes').toDate();
  
    try {
      const response = await authenticatedFetch(`/api/pomodoro/addPomodoro/${userId}/${config._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startTime,
          endTime,
          allTime: durationTime,
          breakTime: 0,
          breakCounter: 0,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Nie udało się dodać pomodoro');
      }
  
      const pomodoroData = await response.json();
      getPomodoroById(pomodoroData._id);
      setTimerStarted(true);
  
      navigate(`/timer/${config._id}/${pomodoroData._id}`);
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center h-screen text-white">
      {config && (
        <div>
          <h2 className="text-3xl text-center font-bold mb-4">Configuration Details</h2>
          
          <table className="table-auto border border-white my-8">
            <tbody>
              <tr>
                <td className="p-2">Configuration Name:</td>
                <td className="p-2">{config.name}</td>
              </tr>
              <tr>
                <td className="p-2">ID:</td>
                <td className="p-2">{config._id}</td>
              </tr>
              <tr>
                <td className="p-2">Duration Time:</td>
                <td className="p-2">
                  {`${Math.floor(config.durationTime / 60)}h ${config.durationTime % 60} minutes (${config.durationTime} minutes)`}
                </td>
              </tr>
              <tr>
                <td className="p-2">Break Time:</td>
                <td className="p-2">{config.breakTime} minutes</td>
              </tr>
              <tr>
                <td className="p-2">Break After:</td>
                <td className="p-2">{config.breakAfter} minutes</td>
              </tr>
              <tr>
                <td className="p-2">Start Time:</td>
                <td id="startTime" className="p-2">{moment().format('LLL')}</td>
              </tr>
              <tr>
                <td className="p-2">End Time:</td>
                <td id="endTime" className="p-2">{moment().add(config.durationTime, 'minutes').format('LLL')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      {!timerStarted && (
        <div className="flex">
          <button
            onClick={startTimer}
            className="bg-green-500 text-white p-3 rounded hover:bg-green-600 transition duration-300 mr-4"
          >
            Start Pomodoro
          </button>
          <Link to="/pomodoro" className="bg-gray-500 text-white p-3 rounded hover:bg-gray-600 transition duration-300">
            Back
          </Link>
        </div>
      )}
    </div>
  );
};

export default TimerPage;
