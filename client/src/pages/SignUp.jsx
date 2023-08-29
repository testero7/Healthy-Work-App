
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({});
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleChange = (e) => {
        setFormData({
            ...formData, [e.target.id]: e.target.value
            //poprzednia wartosc (formData) i przyjmujemy wartosc aktualnie wypelnianego pola
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            setLoading(true);
            setError(false);
            const res = await fetch('api/auth/signup', {

                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            setLoading(false);
            if(data.success === false){
                setError(true); 
                return;   
            }
            navigate('/sign-in')
        }catch (error){
            setLoading(false);
            setError(true);
        }
        

    }
  return (
<div className="min-h-screen flex items-start justify-center bg-cover pt-24">
      <div className="w-80% h-100 flex bg-white bg-opacity-40 rounded-lg shadow-md">
        <div className="w-1/2 p-12">
          <h1 className="text-4xl font-semibold mb-4">Welcome to our platform</h1>
          <p className="text-lg text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam id lectus vel nisl
            sollicitudin pharetra.
          </p>
        </div>
        <div className="w-1/2 p-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-500">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              id="username"
              placeholder='Username'
              className=" w-full p-2 border rounded"
              onChange={handleChange}
            />
          </div>
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
              {loading ? 'Loading...' : 'Sign Up'}
            </button>
            
          </div>
          <p className='text-red-500 mb-2'>{error && "Error occured!"}</p>
          <p>
            Already have an account?{' '}
            <Link to="/sign-in" className="text-blue-500">
              Log in
            </Link>
          </p>
          
        </form>
        </div>
        
      </div>
    </div>
  );
};

export default SignUp;
