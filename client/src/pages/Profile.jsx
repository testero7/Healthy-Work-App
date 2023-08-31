import React from 'react'
import { useSelector } from 'react-redux'
export default function Profile() {
  const { loading, error }  = useSelector((state) => state.user)
  const {currentUser} = useSelector(state => state.user);
  return (
    <div className='p-3 max-w-lg mx-auto'>
        <h1 className='text-4xl font-sans text-center my-7 text-blue-400'>Profile</h1>
        <form className='flex flex-col gap-4'>
            <img src={currentUser.rest.photo}
            alt='profile'
            className='h-24 w-24 
            mt-2
            self-center 
            cursor-pointer 
            rounded-full 
            object-cover'
            />
        <input defaultValue={currentUser.rest.username} type='text' id='username' placeholder='Username' className='bg-slate-100 rounded-lg p-3'/>
        <input defaultValue={currentUser.rest.email} type='email' id='email' placeholder='E-mail' className='bg-slate-100 rounded-lg p-3'/>
        <input type='password' id='password' placeholder='Password' className='bg-slate-100 rounded-lg p-3'/>
        <button
                disabled={loading}
                type="submit"
                className="bg-blue-400
                 text-white px-4
                  py-2 rounded-lg 
                  hover:opacity-95
                  disabled:opacity-80"
              >
               {loading ? 'Loading...' : 'Update'}
                
        </button>
        </form>
        <div className='mt-4 flex justify-between'>
        <button
                disabled={loading}
                type="button"
                className="bg-red-600
                 text-white px-4
                  py-2 rounded-lg 
                  hover:opacity-95
                  disabled:opacity-80"
              >
               {loading ? 'Loading...' : 'Delete account'}
                
       </button>

       <button
                disabled={loading}
                type="button"
                className="bg-gray-400
                 text-white px-4
                  py-2 rounded-lg 
                  hover:opacity-95
                  disabled:opacity-80"
              >
               {loading ? 'Loading...' : 'Sign out'}
                
       </button>
    
       </div>
    </div>
  )
}
