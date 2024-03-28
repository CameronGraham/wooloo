import React from 'react';
import { Link } from 'react-router-dom';

export interface MovieResultType {
  Poster: string;
  Title: string;
  Type: string;
  Year: string;
  imdbID: string;
  onClick: () => void; // Add onClick prop
  onRemove?: () => void; // Add onRemove prop
}

export const MovieResult = ({ Poster, Title, Type, Year, imdbID, onClick, onRemove }: MovieResultType) => {
  if (!["series", "movie"].includes(Type)) {
    return null;
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
  };

  const renderCloseButton = () => {
    if (onRemove) {
      return (
        <button className="absolute top-2 right-2 text-red-600 font-bold" onClick={onRemove}>
          &#x2715;
        </button>
      );
    }
    return null;
  };

  return (
    <div className="max-w-md mx-auto bg-slate-200 rounded-xl shadow-md overflow-hidden md:max-w-2xl my-3 relative" onClick={onClick}>
      {renderCloseButton()}
      <Link to={imdbID}>
        <div className="md:flex">
          <div className="md:shrink-0">
            <img className="h-48 w-full object-cover" src={Poster} alt={Title} />
          </div>
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-cyan-900 font-semibold">{renderType(Type)}</div>
            <div className="block mt-1 text-lg leading-tight font-medium text-black hover:underline">{Title}</div>
            <p className="mt-2 text-slate-500">({Year})</p>
          </div>
        </div>
      </Link>
    </div>
  );
};
