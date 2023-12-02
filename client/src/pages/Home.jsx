import React from 'react'
import Footer from '../components/Footer'

function Home() {

  
  return (
    <div>
    <header>
      
        <img src='https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80' alt='img'>
        </img>

      <div className='text'>
        <h1>Work to learn.</h1>
      <p>Manage your time to never get tired. Work effectively without getting burn out.</p>
      <a href='/sign-in' className='btn'>Start working</a>
      </div>
      </header>
      <div className='card'>
      <img 
      src='https://images.unsplash.com/photo-1532073145718-62df48eaa35e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2068&q=80'
       alt='img'>
       </img>
      <div className='text'>
      <h1>Learn to work.</h1>
      <p>Become productive without any effort. Start learning with ease.</p>
      <a href='/sign-in' className='btn btn-secondary'>Start learning</a>
      </div>
      </div>
      <div className='card'>
      <img src='
      https://images.unsplash.com/photo-1533090161767-e6ffed986c88?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80' alt='img'></img>
      <div className='text'>
        <h1>
          Manage your time without running out of it.
        </h1>
      <p>Be better version of yourself with a little bit of help.</p>
      <a href='/sign-in' className='btn'>Join us</a>
      </div>
      </div>
      <div className='card'>
      <img src='https://images.unsplash.com/photo-1656968559694-ff76e749e3b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80' alt='img'></img>
      <div className='text'>
        <h1>
          Find your work / life balance.
        </h1>
        <p>Do what u need to do without losing in what you want to do.</p>
        <a href='/sign-in' className='btn btn-secondary'>Start now</a>
      </div>
      </div>
      <Footer/>
      </div>
      
  )
}

export default Home
