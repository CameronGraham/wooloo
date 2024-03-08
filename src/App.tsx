import React from 'react'
import { Link, Outlet } from 'react-router-dom'

const App = () => {
  return (
    <div className='animBack'>
      <div className='container mx-auto min-h-screen max-w-screen-lg p-2 md:p-8'>
        <Link to={'/'}>
          <h1 className='cursor-pointer text-5xl font-thin'>🐑 Wooloo</h1>
        </Link>

        <div className='my-8'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default App
