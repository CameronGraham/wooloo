import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom'

import ActivityFeed from './components/ActivityFeed';

const App = () => {

  // eslint-disable-next-line
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      const generatedUsername = generateUsername(); // Replace with your username generation logic
      setUsername(generatedUsername);
      localStorage.setItem('username', generatedUsername);
    }
  }, []);

  // Function to generate a username
  const generateUsername = () => {
    // Implement your username generation logic here
    return 'User' + Math.floor(Math.random() * 1000);
  };

  return ( 
    
    <div className='context'>
      <div className="area">
        <ul className="circles">
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>   
          <div className='container mx-auto min-h-screen p-2 md:p-8 relative'>
            <Link to={'/'}>
              <h1 className='cursor-pointer text-5xl font-thin flex'><div>🐑</div> <span className="ml-4">Wooloo</span></h1>
            </Link>

            <div className='my-8'>
              <Outlet />
              <div>
                <ActivityFeed />
              </div>
            </div>
          </div>
        </div>  

      </div>
  )
}

export default App
