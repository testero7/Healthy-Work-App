import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import {
    signInStart,
    signInSuccess,
    signInFailure,
  } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import OAuth from '../components/OAuth';

const SignIn = () => {
    const [formData, setFormData] = useState({});
    const { loading, error }  = useSelector((state) => state.user)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    
    const handleChange = (e) => {
        setFormData({
            ...formData, [e.target.id]: e.target.value
            //poprzednia wartosc (formData) i przyjmujemy wartosc aktualnie wypelnianego pola
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            dispatch(signInStart());
            const res = await fetch('api/auth/signin', {

                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            
            if(data.success === false){
                dispatch(signInFailure(data));
                return;   
            }
            dispatch(signInSuccess(data));
            navigate('/')
        }catch (error){
            dispatch(signInFailure(error));
        }
        

    }
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
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="email"
                id="email"
                placeholder='E-mail'
                className="w-full p-2 border rounded"
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                id="password"
                placeholder='Password'
                className="w-full p-2 border rounded"
                onChange={handleChange}
              />
            </div>
            <div className="flex justify-between items-center mb-4">
              <button
                disabled={loading}
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:opacity-95 disabled:opacity-80"
              >
               {loading ? 'Loading...' : 'Sign In'}
                
              </button>
              <OAuth></OAuth>
              
            </div>
            <p className='text-red-500 mb-2'>{error ? error.message || "Error occured!" : ""}</p>
            <p>
              Don't have an account?{' '}
              <Link to="/sign-up" className="text-blue-500">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
