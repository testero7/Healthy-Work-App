import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

const SignIn = () => {
  return (
    <div className="min-h-screen flex items-start justify-center bg-cover pt-24">
      <div className="w-80% h-96 flex bg-white bg-opacity-40 rounded-lg shadow-md">
        <div className="w-1/2 p-12">
          <h1 className="text-4xl font-semibold mb-4">Welcome to our platform</h1>
          <p className="text-lg text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam id lectus vel nisl
            sollicitudin pharetra.
          </p>
        </div>
        <div className="w-1/2 p-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-500">Sign In</h2>
          <form>
            <div className="mb-4">
              <input
                type="email"
                id="email"
                placeholder='E-mail'
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                id="password"
                placeholder='Password'
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex justify-between items-center mb-4">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Sign In
                
              </button>
              <button
                type="button"
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
               <FontAwesomeIcon icon={faGoogle} />
              </button>
              
            </div>
            <p>
              Want to create an account?{' '}
              <a href="/sign-up" className="text-blue-500">
                Sign up
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
