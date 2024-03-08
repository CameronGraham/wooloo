// MovieResult.tsx
import React from 'react'
import { Link } from 'react-router-dom'

export interface MovieResultType {
  Poster: string
  Title: string
  Type: string
  Year: string
  imdbID: string
  onClick: () => void // Add onClick prop
}

export const MovieResult = ({ Poster, Title, Type, Year, imdbID, onClick }: MovieResultType) => {
  if (!["series", "movie"].includes(Type)) {
    return null
  }

  const renderType = (type: string) => {
    switch (type) {
      case 'series':
        return 'Series';
      case 'movie':
        return 'Movie';
      default:
        return 'Unknown';
    }
  }

  return (
    <div onClick={onClick}> {/* Add onClick handler */}
      <Link to={imdbID}>
        <div className='relative my-2 h-60 overflow-hidden rounded bg-slate-300 p-3 shadow text-black'>
          <div className='flex h-full justify-between'>
            <img src={Poster} className='h-full' alt={Title} />
            <div className='mr-auto ml-4 mt-8 '>
              <h6 className='text-4xl font-thin '>{Title}</h6>
              <div className=''>({Year})</div>
              <div className='font-bold opacity-30'>{renderType(Type)}</div>
            </div>
           
          </div>
        </div>
      </Link>
    </div>
  )
}
