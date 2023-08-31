import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {useSelector} from 'react-redux';
const backgroundImageUrl = 'https://images.pexels.com/photos/933054/pexels-photo-933054.jpeg?cs=srgb&dl=pexels-joyston-judah-933054.jpg&fm=jpg';

export default function Header() {
const {currentUser} = useSelector(state=>state.user);
const location = useLocation();

const isActive = (pathname) => {
return location.pathname === pathname;
};
    console.log(currentUser);
    return (
        <header className='py-4 sticky top-0 z-50 backdrop-blur-md transition backdrop-filter duration-300'>
          <div className='container mx-auto flex items-center justify-between'>
            <Link to='/' className='text-3xl font-bold text-white transition hover:text-blue-300'>
              WorkLife Harmony
            </Link>
            <nav className='flex gap-6 items-center'>
              <Link
                to='/home'
                className={`text-white transition hover:text-blue-300 ${
                  isActive('/home') ? 'border-b-2 border-blue-300' : ''
                }`}
              >
                Home
              </Link>
              <Link
                to='/about'
                className={`text-white transition hover:text-blue-300 ${
                  isActive('/about') ? 'border-b-2 border-blue-300' : ''
                }`}
              >
                About
              </Link>
              {currentUser ? (
                <Link
                  to='/profile'
                  className='flex items-center text-white transition hover:text-blue-300'
                >
                    <img src={currentUser.rest.photo} alt='' className='rounded-full w-9 h-9 object-cover' />
                </Link>
              ) : (
                <Link to='/sign-in' className='text-white transition hover:text-blue-300'>
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        </header>
      );
}
