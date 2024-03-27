import React from 'react'
import { Link, Outlet } from 'react-router-dom'

const App = () => {
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
              <h1 className='cursor-pointer text-5xl font-thin'>🐑 Wooloo</h1>
            </Link>
            <div className='my-8'>
              <Outlet />
            </div>
          </div>
        </div>  
      </div>
  )
}

export default App
