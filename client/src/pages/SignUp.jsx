import React from 'react';

const SignUp = () => {
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
          <h2 className="text-2xl font-semibold mb-4 text-blue-500">Sign Up</h2>
        <form>
          <div className="mb-4">
            <input
              type="text"
              id="username"
              placeholder='Username'
              className=" w-full p-2 border rounded"
            />
          </div>
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
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Sign Up
            </button>
            <button
              type="button"
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Sign Up with Google
            </button>
          </div>
          <p>
            Already have an account?{' '}
            <a href="/sign-in" className="text-blue-500">
              Log in
            </a>
          </p>
        </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
