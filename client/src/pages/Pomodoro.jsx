import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function Pomodoro() {
  const [name, setName] = useState('');
  const [durationTime, setDurationTime] = useState('');
  const [breakAfter, setBreakAfter] = useState('');
  const [breakTime, setBreakTime] = useState('');
  const [sessions, setSessions] = useState([]);
  const [sessions1, setSessions1] = useState([]);
  const [updatedSessions, setUpdatedSessions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editConfig, setEditConfig] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [configToDelete, setConfigToDelete] = useState(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [pomodoroToFinish, setPomodoroToFinish] = useState(null);
  const [selectedPomodoro, setSelectedPomodoro] = useState(null);
  const [isOtherModalOpen, setIsOtherModalOpen] = useState(false);
  const userId = currentUser ? currentUser._id : null;
  
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
    const fetchData = async () => {
      try {
        const response = await authenticatedFetch(`/api/configuration/getConfiguration/${userId}`);
        const data = await response.json();
        setSessions(data);
      } catch (error) {
        console.error('Error fetching Pomodoro sessions:', error);
      }
    };

    fetchData();
  }, [userId]);

  useEffect(() => {
    // Update sessions every minute
    const intervalId = setInterval(updateSessions, 60000);

    return () => clearInterval(intervalId);
  }, [userId, sessions1]);

  useEffect(() => {
    // Fetch Pomodoro sessions
    authenticatedFetch(`/api/pomodoro/getPomodoro/${userId}`)
      .then((response) => response.json())
      .then((data) => setSessions1(data))
      .catch((error) => console.error('Error fetching Pomodoro sessions:', error));
  }, [userId]);

  useEffect(() => {
    // Update sessions every minute
    const intervalId = setInterval(updateSessions, 60000);

    return () => clearInterval(intervalId);
  }, [userId, sessions1]);

  const updateSessions = async () => {
    const updatedSessions = await Promise.all(
      sessions1.map(async (session) => {
        if (new Date(session.endTime) <= new Date() && session.status !== 'Zakończony') {
          const response = await authenticatedFetch(`/api/pomodoro/updatePomodoro/${userId}/${session._id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: 'Zakończony' }),
          });

          if (response.ok) {
            const updatedSession = await response.json();
            return updatedSession;
          } else {
            console.log('Error updating status');
          }
        }
        return session;
      })
    );

    setSessions1(updatedSessions);
  };

  const handleAddPomodoro = async (e) => {
    e.preventDefault();

    try {
      const response = await authenticatedFetch(`/api/configuration/addConfiguration/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, durationTime, breakAfter, breakTime }),
      });

      if (!response.ok) {
        throw new Error('Failed to add Pomodoro session');
      }

      const data = await response.json();
      console.log('Added new Pomodoro session:', data);

      setSessions([...sessions, data]);
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = (config) => {
    setName(config.name);
    setDurationTime(config.durationTime);
    setBreakAfter(config.breakAfter);
    setBreakTime(config.breakTime);
    setEditConfig(config);
    setIsModalOpen(true);
  };

  const handleUpdateConfiguration = async (e) => {
    e.preventDefault();

    try {
      const response = await authenticatedFetch(`/api/configuration/updateConfiguration/${userId}/${editConfig._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, durationTime, breakAfter, breakTime }),
      });

      if (!response.ok) {
        throw new Error('Failed to update configuration');
      }

      const updatedConfig = await response.json();
      setSessions(sessions.map((session) => (session._id === updatedConfig._id ? updatedConfig : session)));
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseModal = () => {
    setName('');
    setDurationTime('');
    setBreakAfter('');
    setBreakTime('');
    setEditConfig(null);
    setIsModalOpen(false);
  };

  const handleDeleteClick = (config) => {
    setConfigToDelete(config);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirmation = async () => {
    try {
      const response = await authenticatedFetch(`/api/configuration/deleteConfiguration/${userId}/${configToDelete._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete configuration');
      }

      setSessions(sessions.filter((session) => session._id !== configToDelete._id));
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFinishClick = (pomodoro) => {
    setSelectedPomodoro(pomodoro);
    setIsOtherModalOpen(true);
  };

  const handleFinishConfirmation = async () => {
    try {
      const response = await authenticatedFetch(`/api/pomodoro/updatePomodoro/${userId}/${selectedPomodoro._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'Zakończony',
          endTime: new Date(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to end Pomodoro session');
      }

      const updatedPomodoro = await response.json();
      setSessions1(sessions1.map((session) => (session._id === updatedPomodoro._id ? updatedPomodoro : session)));
      setIsOtherModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
  <div className="min-h-screen container mx-auto p-4">
    <h1 className="text-2xl text-white font-bold mb-4">Pomodoro Page</h1>

    <button
      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mb-4"
      onClick={() => {
        setName('');
        setDurationTime('');
        setBreakAfter('');
        setBreakTime('');
        setEditConfig(null);
        setIsModalOpen(true);
      }}
    >
      Add Pomodoro
    </button>

    {isModalOpen && (
      <div
        className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-75 bg-gray-800"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            handleCloseModal();
          }
        }}
      >
        <div className="bg-white p-4 rounded-md shadow-lg">
          <h2 className="text-xl font-bold mb-4">
            {editConfig ? 'Edit Pomodoro Session' : 'Add Pomodoro Session'}
          </h2>
          <form onSubmit={editConfig ? handleUpdateConfiguration : handleAddPomodoro}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Session Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-opacity-50"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="durationTime" className="block text-sm font-medium text-gray-700">
                  Session Duration (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  id="durationTime"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-opacity-50"
                  value={durationTime}
                  onChange={(e) => setDurationTime(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="breakAfter" className="block text-sm font-medium text-gray-700">
                  Break After (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  id="breakAfter"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-opacity-50"
                  value={breakAfter}
                  onChange={(e) => setBreakAfter(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="breakTime" className="block text-sm font-medium text-gray-700">
                  Break Time (minutes)
                </label>
                <input
                  type="number"
                  id="breakTime"
                  min="1"
                  step="1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-opacity-50"
                  value={breakTime}
                  onChange={(e) => setBreakTime(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  className="px-4 mr-2 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                                    {editConfig ? 'Update Configuration' : 'Add Pomodoro Session'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {sessions.length > 0 ? (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4 text-white">Current Pomodoro Configurations</h2>
          <ul>
            {sessions.map((session) => (
              <li key={session._id} className="flex items-center mb-2">
                <span className="mr-2 text-white">{session.name}</span>
                <Link className="px-2  py-1 ml-2 bg-green-500 text-white rounded hover:bg-green-600" to={`/timer/${session._id}`}>Start</Link>
                <button
                  className="px-2  py-1 ml-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => handleEditClick(session)}
                >
                  Edit
                </button>
                <button
                  className="px-2 py-1 ml-2 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => handleDeleteClick(session)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-8 text-white">No Pomodoro Sessions</p>
      )}

      {sessions1.length > 0 ? (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4 text-white">Available Pomodoro Sessions</h2>
          <ul>
            {sessions1
              .filter((session) => new Date(session.endTime) > new Date())
              .map((session) => (
                <li key={session._id} className="flex items-center mb-2">
                  <span className="mr-2">{session.name}</span>
                  <span className="mr-2 text-white">
                    {new Date(session.endTime).toLocaleString()}
                  </span>
                  <Link
                    to={`/timer/${session.confId}/${session._id}`}
                    className="px-2 py-1 ml-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Continue
                  </Link>
                  <button
                    className="px-2 py-1 ml-2 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => {
                      setSelectedPomodoro(session);
                      setIsOtherModalOpen(true);
                    }}
                  >
                    End
                  </button>
                </li>
              ))}
          </ul>
        </div>
      ) : null}

      {selectedPomodoro && isOtherModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-75 bg-gray-800"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsOtherModalOpen(false);
              setSelectedPomodoro(null);
            }
          }}
        >
          <div className="bg-white p-4 rounded-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">Confirm Ending Pomodoro Session</h2>
            <p>Are you sure you want to end this Pomodoro session?</p>
            <div className="flex justify-between mt-4">
              <button
                type="button"
                className="px-4 mr-2 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                onClick={() => {
                  setIsOtherModalOpen(false);
                  setSelectedPomodoro(null);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={handleFinishConfirmation}
              >
                End Pomodoro
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-75 bg-gray-800"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsDeleteModalOpen(false);
            }
          }}
        >
          <div className="bg-white p-4 rounded-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion of Configuration</h2>
            <p>Are you sure you want to delete the configuration "{configToDelete.name}"?</p>
            <div className="flex justify-between mt-4">
              <button
                type="button"
                className="px-4 mr-2 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={handleDeleteConfirmation}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
