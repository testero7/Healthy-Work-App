import React, { useRef } from 'react';
import { Link } from 'react-router-dom';

const UserHome = () => {
  const videoRef = useRef(null);

  const handleButtonClick = () => {
    // Obsługa kliknięcia przycisku, np. uruchomienie animacji
    console.log('Start now clicked');
  };

  const handleVideoClick = () => {
    // Obsługa kliknięcia na video, np. zatrzymanie/uruchomienie odtwarzania
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Dodanie filmiku w tle */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          className="absolute inset-0 w-full h-full object-cover"
          onClick={handleVideoClick}
        >
          <source src="https://firebasestorage.googleapis.com/v0/b/mern-app-426e4.appspot.com/o/pexels_videos_2759486%20(2160p).mp4?alt=media&token=e99caffc-e80c-442f-99cb-c7d54bf617e2" type="video/mp4" />
        </video>

        {/* Nakładka obszarowa na video, obsługująca kliknięcie */}
        <div
          className="absolute inset-0 w-full h-full"
          onClick={handleVideoClick}
        />

        {/* Przycisk z obsługą nawigacji */}
        <Link to="/pomodoro">
          <button
            className="bg-transparent text-blue-500 font-bold py-6 px-12 rounded-full transition duration-300 transform hover:scale-110 border border-blue-500 hover:bg-blue-500 hover:text-white"
            onClick={handleButtonClick}
          >
            Start now
          </button>
        </Link>
      </div>
    </div>
  );
};

export default UserHome;
