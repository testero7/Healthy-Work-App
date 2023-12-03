import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Settings() {
  const [key, setKey] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showFormModalButton, setShowFormModalButton] = useState(false);
  const [showTurnOffButton, setShowTurnOffButton] = useState(false);
  const [formData, setFormData] = useState({
    waterNoti: 15,
    stretchNoti: 120,
    eyeNoti: 30,
    postureNoti: 180,
    lightNoti: 60,
  });
  const [saveChangesEnabled, setSaveChangesEnabled] = useState(false);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [isModalActive, setIsModalActive] = useState(false);

  
  const [waterNotiEnabled, setWaterNotiEnabled] = useState(true);
  const [stretchNotiEnabled, setStretchNotiEnabled] = useState(true);
  const [eyeNotiEnabled, setEyeNotiEnabled] = useState(true);
  const [postureNotiEnabled, setPostureNotiEnabled] = useState(true);
  const [lightNotiEnabled, setLightNotiEnabled] = useState(true);

  const checkboxRef = useRef();

  const { currentUser, loading, error } = useSelector((state) => state.user);
  const userId = currentUser ? currentUser._id : null;
  const [isLoading, setIsLoading] = useState(true);
  function getRefreshToken() {
    
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
    finally{
      setIsLoading(false);
    }
  }




useEffect(() => {
  if (formData.waterNoti === 0) {
    setWaterNotiEnabled(false);
  } else {
    setWaterNotiEnabled(true);
  }

  if (formData.stretchNoti === 0) {
    setStretchNotiEnabled(false);
  } else {
    setStretchNotiEnabled(true);
  }

  if (formData.eyeNoti === 0) {
    setEyeNotiEnabled(false);
  } else {
    setEyeNotiEnabled(true);
  }

  if (formData.postureNoti === 0) {
    setPostureNotiEnabled(false);
  } else {
    setPostureNotiEnabled(true);
  }

  if (formData.lightNoti === 0) {
    setLightNotiEnabled(false);
  } else {
    setLightNotiEnabled(true);
  }
}, [formData]);

  const fetchNotification = async () => {
    try {
      const response = await authenticatedFetch(`/api/notification/getNotification/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const notificationData = await response.json();

        if (notificationData) {
          setFormData(notificationData);
          setSaveChangesEnabled(false);
          setShowForm(true);

          if (notificationData.enabled) {
            setShowModal(true);
            setIsNotificationsEnabled(true);
            setShowTurnOffButton(true);
          } else {
            setShowFormModalButton(true);
            setIsNotificationsEnabled(false);
            setShowTurnOffButton(false);
          }
        } else {
          console.error('Pobieranie powiadomień zwróciło puste dane.');
          setShowForm(false);
          setShowTurnOffButton(false);
        }
      } else {
        console.error('Pobieranie powiadomień nie powiodło się.');
      }
    } catch (error) {
      console.error('Wystąpił błąd podczas pobierania powiadomień:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchNotification();
    }
  }, [userId, key]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    
    const numericValue = parseInt(value, 10);
    const inputValue = isNaN(numericValue) || numericValue <= 0 ? 1 : numericValue;
  
    
    if (inputValue === 0) {
      switch (name) {
        case 'waterNoti':
          setWaterNotiEnabled(false);
          break;
        case 'stretchNoti':
          setStretchNotiEnabled(false);
          break;
        case 'eyeNoti':
          setEyeNotiEnabled(false);
          break;
        case 'postureNoti':
          setPostureNotiEnabled(false);
          break;
        case 'lightNoti':
          setLightNotiEnabled(false);
          break;
        default:
          break;
      }
    }
  
    setFormData((prevData) => ({
      ...prevData,
      [name]: inputValue,
    }));
    setSaveChangesEnabled(true);
  };

  const handleToggleSwitch = (fieldName) => {
    let newValue = 0;
  
    switch (fieldName) {
      case 'waterNoti':
        setWaterNotiEnabled(!waterNotiEnabled);
        newValue = waterNotiEnabled ? 0 : 1;
        break;
      case 'stretchNoti':
        setStretchNotiEnabled(!stretchNotiEnabled);
        newValue = stretchNotiEnabled ? 0 : 1;
        break;
      case 'eyeNoti':
        setEyeNotiEnabled(!eyeNotiEnabled);
        newValue = eyeNotiEnabled ? 0 : 1;
        break;
      case 'postureNoti':
        setPostureNotiEnabled(!postureNotiEnabled);
        newValue = postureNotiEnabled ? 0 : 1;
        break;
      case 'lightNoti':
        setLightNotiEnabled(!lightNotiEnabled);
        newValue = lightNotiEnabled ? 0 : 1;
        break;
      default:
        break;
    }
  
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: newValue,
    }));
  
    
    if (newValue === 1) {
      checkboxRef.current.checked = true;
    } else {
      checkboxRef.current.checked = false;
    }
  
    setSaveChangesEnabled(true);
  };
  useEffect(() => {
    if (userId) {
      fetchNotification();
    }

    
    const savedData = JSON.parse(localStorage.getItem('notificationSettings'));

    if (savedData) {
      setFormData(savedData.formData);
      setSaveChangesEnabled(savedData.saveChangesEnabled);
      setIsNotificationsEnabled(savedData.isNotificationsEnabled);

      setWaterNotiEnabled(savedData.waterNotiEnabled);
      setStretchNotiEnabled(savedData.stretchNotiEnabled);
      setEyeNotiEnabled(savedData.eyeNotiEnabled);
      setPostureNotiEnabled(savedData.postureNotiEnabled);
      setLightNotiEnabled(savedData.lightNotiEnabled);
    }
  }, [userId, key]);

  useEffect(() => {
    
    const dataToSave = {
      formData,
      saveChangesEnabled,
      isNotificationsEnabled,
      waterNotiEnabled,
      stretchNotiEnabled,
      eyeNotiEnabled,
      postureNotiEnabled,
      lightNotiEnabled,
    };

    localStorage.setItem('notificationSettings', JSON.stringify(dataToSave));
  }, [
    formData,
    saveChangesEnabled,
    isNotificationsEnabled,
    waterNotiEnabled,
    stretchNotiEnabled,
    eyeNotiEnabled,
    postureNotiEnabled,
    lightNotiEnabled,
  ]);
  const handleModalClose = () => {
    setShowModal(false);
    setIsModalActive(false);

    if (!isNotificationsEnabled) {
      checkboxRef.current.checked = false;
    }

    handleToggleNotifications();
  };

  const handleSaveChanges = async () => {
    try {
      const response = await authenticatedFetch(`/api/notification/updateNotification/${userId}/${formData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('Powiadomienia zaktualizowane pomyślnie!');
        setSaveChangesEnabled(false);
        setKey((prevKey) => prevKey + 1);
      } else {
        console.error('Zapisywanie zmian nie powiodło się.');
      }
    } catch (error) {
      console.error('Wystąpił błąd podczas wysyłania żądania:', error);
    }
  };

  const handleDeleteNotification = async () => {
    try {
      const response = await authenticatedFetch(`/api/notification/deleteNotification/${userId}/${formData._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log('Powiadomienie usunięte pomyślnie!');
        setShowForm(false);
        setShowFormModalButton(true);
        setShowTurnOffButton(false);
        setIsNotificationsEnabled(false);
        checkboxRef.current.checked = false;
      } else {
        console.error('Usuwanie powiadomienia nie powiodło się.');
      }
    } catch (error) {
      console.error('Wystąpił błąd podczas wysyłania żądania:', error);
    }
  };

  const handleEnableNotifications = async () => {
    if (showForm && !isModalActive) {
      setIsModalActive(true);
      setShowModal(true);
    } else {
      try {
        const response = await authenticatedFetch(`/api/notification/addNotification/${userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          console.log('Nowe powiadomienie dodane pomyślnie!');
          fetchNotification();
          setIsNotificationsEnabled(true);
          checkboxRef.current.checked = true;
        } else {
          console.error('Dodawanie powiadomienia nie powiodło się.');
        }
      } catch (error) {
        console.error('Wystąpił błąd podczas wysyłania żądania:', error);
      }
    }
  };

  const handleToggleNotifications = () => {
    setIsNotificationsEnabled(!isNotificationsEnabled);

    if (!isNotificationsEnabled) {
      handleEnableNotifications();
    } else {
      setIsModalActive(true);
      setShowModal(true);
    }

    
    if (showModal) {
      setShowModal(false);
      setIsModalActive(false);
    }
  };
  const handleDisableNotifications = async () => {
    try {
      if (showForm && !isModalActive) {
        setIsModalActive(true);
        setShowModal(true);
      } else {
        const response = await authenticatedFetch(`/api/notification/deleteNotification/${userId}/${formData._id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (response.ok) {
          console.log('Powiadomienie usunięte pomyślnie!');
          setShowForm(false);
          setShowFormModalButton(true);
          setShowTurnOffButton(false);
          setIsNotificationsEnabled(false);
          checkboxRef.current.checked = false;
        } else {
          console.error('Usuwanie powiadomienia nie powiodło się.');
        }
      }
    } catch (error) {
      console.error('Wystąpił błąd podczas wysyłania żądania:', error);
    }
  };
  return (
    <div key={key} className="min-h-screen container max-w-2xl mx-auto">
       {isLoading && <LoadingSpinner />}
    {!isLoading && (
      <div className="flex items-center justify-between">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={showForm && isNotificationsEnabled}
            onChange={handleToggleNotifications}
            ref={checkboxRef}
          />
          <div
            className={`w-11 h-6 relative flex items-center transition-all ${
              showForm && !isNotificationsEnabled ? 'flex-row-reverse' : 'flex-row'
            } ${
              showForm && !isNotificationsEnabled ? 'bg-red-500' : 'bg-gray-200'
            } peer-focus:outline-none peer-focus:ring-4 ${
              showForm && !isNotificationsEnabled ? 'peer-focus:ring-red-300' : 'peer-focus:ring-blue-300'
            } dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 ${
              showForm && !isNotificationsEnabled ? 'peer-checked' : ''
            } peer-checked:after:border-white after:content-[''] after:absolute after:top-1/2 ${
              showForm && !isNotificationsEnabled ? 'after:right-0' : 'after:left-0'
            } after:-translate-y-1/2 after:bg-white ${
              showForm && !isNotificationsEnabled ? 'after:border-red-300' : 'after:border-gray-300'
            } after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 ${
              showForm && !isNotificationsEnabled ? 'peer-checked:bg-red-600' : 'peer-checked:bg-blue-600'
            }`}
          ></div>
          <span className={`ms-3 text-sm font-medium ${showForm ? 'text-red-500 dark:text-red-300' : 'text-gray-900 dark:text-gray-300'}`}>
            {showForm ? 'Turn off' : 'Włącz powiadomienia'}
          </span>
        </label>
        {showForm && (
          <div className="flex items-center">
            
          </div>
        )}
      </div>
   )}
      {!isLoading && showForm && (
        <div className="mt-4 p-4 bg-gray-100">
          <h3 className="text-lg font-semibold mb-4">Ustawienia powiadomień</h3>
          <form>
  <div className="mb-4">
    <label className="block text-gray-700">
      Powiadomienie o wodzie (minuty):
      <button
        type="button"
        onClick={() => handleToggleSwitch('waterNoti')}
        className={`ml-2 ${
          waterNotiEnabled ? 'bg-blue-500' : 'bg-gray-300'
        } relative text-white py-1 px-1 rounded-full`}
      >
        <div
          className={`w-10 h-5 relative flex items-center transition-all ${
            waterNotiEnabled ? 'flex-row-reverse' : 'flex-row'
          } ${
            waterNotiEnabled ? 'bg-blue-500' : 'bg-gray-200'
          } peer-focus:outline-none peer-focus:ring-4 ${
            waterNotiEnabled ? 'peer-focus:ring-blue-300' : 'peer-focus:ring-gray-300'
          } dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 ${
            waterNotiEnabled ? 'peer-checked' : ''
          } peer-checked:after:border-white after:content-[''] after:absolute after:top-1/2 ${
            waterNotiEnabled ? 'after:right-0' : 'after:left-0'
          } after:-translate-y-1/2 after:bg-white ${
            waterNotiEnabled ? 'after:border-blue-300' : 'after:border-gray-300'
          } after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 ${
            waterNotiEnabled ? 'peer-checked:bg-blue-600' : 'peer-checked:bg-gray-600'
          }`}
        ></div>
      </button>
    </label>
    <input
      className="border border-gray-300 px-3 py-2 w-full"
      type="number"
      name="waterNoti"
      value={waterNotiEnabled ? formData.waterNoti : 0}
      onChange={handleInputChange}
      disabled={!waterNotiEnabled}
    />
  </div>

  <div className="mb-4">
    <label className="block text-gray-700">
      Powiadomienie o rozciąganiu (minuty):
      <button
        type="button"
        onClick={() => handleToggleSwitch('stretchNoti')}
        className={`ml-2 ${
          stretchNotiEnabled ? 'bg-blue-500' : 'bg-gray-300'
        } relative text-white py-1 px-1 rounded-full`}
      >
        <div
          className={`w-10 h-5 relative flex items-center transition-all ${
            stretchNotiEnabled ? 'flex-row-reverse' : 'flex-row'
          } ${
            stretchNotiEnabled ? 'bg-blue-500' : 'bg-gray-200'
          } peer-focus:outline-none peer-focus:ring-4 ${
            stretchNotiEnabled ? 'peer-focus:ring-blue-300' : 'peer-focus:ring-gray-300'
          } dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 ${
            stretchNotiEnabled ? 'peer-checked' : ''
          } peer-checked:after:border-white after:content-[''] after:absolute after:top-1/2 ${
            stretchNotiEnabled ? 'after:right-0' : 'after:left-0'
          } after:-translate-y-1/2 after:bg-white ${
            stretchNotiEnabled ? 'after:border-blue-300' : 'after:border-gray-300'
          } after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 ${
            stretchNotiEnabled ? 'peer-checked:bg-blue-600' : 'peer-checked:bg-gray-600'
          }`}
        ></div>
      </button>
    </label>
    <input
      className="border border-gray-300 px-3 py-2 w-full"
      type="number"
      name="stretchNoti"
      value={stretchNotiEnabled ? formData.stretchNoti : 0}
      onChange={handleInputChange}
      disabled={!stretchNotiEnabled}
    />
  </div>

  <div className="mb-4">
    <label className="block text-gray-700">
      Powiadomienie o odpoczynku dla oczu (minuty):
      <button
        type="button"
        onClick={() => handleToggleSwitch('eyeNoti')}
        className={`ml-2 ${
          eyeNotiEnabled ? 'bg-blue-500' : 'bg-gray-300'
        } relative text-white py-1 px-1 rounded-full`}
      >
        <div
          className={`w-10 h-5 relative flex items-center transition-all ${
            eyeNotiEnabled ? 'flex-row-reverse' : 'flex-row'
          } ${
            eyeNotiEnabled ? 'bg-blue-500' : 'bg-gray-200'
          } peer-focus:outline-none peer-focus:ring-4 ${
            eyeNotiEnabled ? 'peer-focus:ring-blue-300' : 'peer-focus:ring-gray-300'
          } dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 ${
            eyeNotiEnabled ? 'peer-checked' : ''
          } peer-checked:after:border-white after:content-[''] after:absolute after:top-1/2 ${
            eyeNotiEnabled ? 'after:right-0' : 'after:left-0'
          } after:-translate-y-1/2 after:bg-white ${
            eyeNotiEnabled ? 'after:border-blue-300' : 'after:border-gray-300'
          } after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 ${
            eyeNotiEnabled ? 'peer-checked:bg-blue-600' : 'peer-checked:bg-gray-600'
          }`}
        ></div>
      </button>
    </label>
    <input
      className="border border-gray-300 px-3 py-2 w-full"
      type="number"
      name="eyeNoti"
      value={eyeNotiEnabled ? formData.eyeNoti : 0}
      onChange={handleInputChange}
      disabled={!eyeNotiEnabled}
    />
  </div>

  <div className="mb-4">
    <label className="block text-gray-700">
      Powiadomienie o poprawie postawy (minuty):
      <button
        type="button"
        onClick={() => handleToggleSwitch('postureNoti')}
        className={`ml-2 ${
          postureNotiEnabled ? 'bg-blue-500' : 'bg-gray-300'
        } relative text-white py-1 px-1 rounded-full`}
      >
        <div
          className={`w-10 h-5 relative flex items-center transition-all ${
            postureNotiEnabled ? 'flex-row-reverse' : 'flex-row'
          } ${
            postureNotiEnabled ? 'bg-blue-500' : 'bg-gray-200'
          } peer-focus:outline-none peer-focus:ring-4 ${
            postureNotiEnabled ? 'peer-focus:ring-blue-300' : 'peer-focus:ring-gray-300'
          } dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 ${
            postureNotiEnabled ? 'peer-checked' : ''
          } peer-checked:after:border-white after:content-[''] after:absolute after:top-1/2 ${
            postureNotiEnabled ? 'after:right-0' : 'after:left-0'
          } after:-translate-y-1/2 after:bg-white ${
            postureNotiEnabled ? 'after:border-blue-300' : 'after:border-gray-300'
          } after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 ${
            postureNotiEnabled ? 'peer-checked:bg-blue-600' : 'peer-checked:bg-gray-600'
          }`}
        ></div>
      </button>
    </label>
    <input
      className="border border-gray-300 px-3 py-2 w-full"
      type="number"
      name="postureNoti"
      value={postureNotiEnabled ? formData.postureNoti : 0}
      onChange={handleInputChange}
      disabled={!postureNotiEnabled}
    />
  </div>

  <div className="mb-4">
    <label className="block text-gray-700">
      Powiadomienie o świetle (minuty):
      <button
        type="button"
        onClick={() => handleToggleSwitch('lightNoti')}
        className={`ml-2 ${
          lightNotiEnabled ? 'bg-blue-500' : 'bg-gray-300'
        } relative text-white py-1 px-1 rounded-full`}
      >
        <div
          className={`w-10 h-5 relative flex items-center transition-all ${
            lightNotiEnabled ? 'flex-row-reverse' : 'flex-row'
          } ${
            lightNotiEnabled ? 'bg-blue-500' : 'bg-gray-200'
          } peer-focus:outline-none peer-focus:ring-4 ${
            lightNotiEnabled ? 'peer-focus:ring-blue-300' : 'peer-focus:ring-gray-300'
          } dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 ${
            lightNotiEnabled ? 'peer-checked' : ''
          } peer-checked:after:border-white after:content-[''] after:absolute after:top-1/2 ${
            lightNotiEnabled ? 'after:right-0' : 'after:left-0'
          } after:-translate-y-1/2 after:bg-white ${
            lightNotiEnabled ? 'after:border-blue-300' : 'after:border-gray-300'
          } after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 ${
            lightNotiEnabled ? 'peer-checked:bg-blue-600' : 'peer-checked:bg-gray-600'
          }`}
        ></div>
      </button>
    </label>
    <input
      className="border border-gray-300 px-3 py-2 w-full"
      type="number"
      name="lightNoti"
      value={lightNotiEnabled ? formData.lightNoti : 0}
      onChange={handleInputChange}
      disabled={!lightNotiEnabled}
    />
  </div>
  
            <div className="mb-4">
              <button
                className={`${
                  saveChangesEnabled
                    ? 'bg-green-500 text-white transition-all'
                    : 'bg-gray-300 text-gray-600 cursor-not-allowed transition-all'
                } py-2 px-4 rounded`}
                type="button"
                onClick={handleSaveChanges}
                disabled={!saveChangesEnabled}
              >
                Zapisz zmiany
              </button>
            </div>
          </form>
        </div>
      )}
  
  {!isLoading && showForm && showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-4 rounded">
      <p>Czy na pewno chcesz wyłączyć powiadomienia? To spowoduje zresetowanie preferencji.</p>
      <div className="mt-4 flex justify-end">
        <button
          className="bg-red-500 text-white py-2 px-4 rounded mr-2"
          onClick={handleDisableNotifications}
        >
          Tak, wyłącz
        </button>
        <button
          className="bg-gray-300 text-gray-600 py-2 px-4 rounded"
          onClick={handleModalClose}
        >
          Anuluj
        </button>
      </div>
    </div>
  </div>
      )}
    </div>
  );
}  