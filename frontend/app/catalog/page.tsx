"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { UserCircleIcon } from '@heroicons/react/24/solid';

interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    imageLinks?: {
      thumbnail?: string;
    };
  };
}

interface Movie {
  id: string;
  title: string;
  release_date: string;
  overview: string;
  poster_path: string;
}

export default function Catalog() {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('title');
  const [items, setItems] = useState<(Book | Movie)[]>([]);
  const [itemType, setItemType] = useState('books');
  const [lastItemType, setLastItemType] = useState(itemType);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (itemType !== lastItemType) {
      setItems([]);
      setPage(1);
      setLastItemType(itemType);
    }
  }, [itemType, lastItemType]);

  const searchItems = async (loadMore = false) => {
    try {
      const newPage = loadMore ? page + 1 : 1;
      let newItems: (Book | Movie)[] = [];

      // Searching books
      if (itemType === 'books') {
        const queryParam = searchType === 'author' ? `inauthor:${query}` : `intitle:${query}`;
        const res = await fetch(`/api/books?query=${queryParam}&page=${newPage}`);
        const data = await res.json();
        newItems = data.items || [];
      } 
      // Searching movies
      else if (itemType === 'movies') {
        const res = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
          params: {
            api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY,
            query: query,
            page: newPage,
          },
        });
        newItems = res.data.results || [];
      }

      if (loadMore) {
        setItems((prevItems) => [...prevItems, ...newItems]);
        setPage(newPage);
      } else {
        setItems(newItems);
        setPage(1);
      }
    } 
    catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ( e.key === 'Enter') {
      searchItems(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-200 to-blue-500 pb-10">
      <div className="absolute top-5 left-5">
        <Link href="/profile" legacyBehavior>
          <a className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-700 flex items-center">
            <UserCircleIcon className="h-6 w-6" />
            <span className="ml-2">Profile</span>
          </a>
        </Link>
      </div>
      <h1 className="mb-5 text-2xl font-bold text-white">Catalog</h1>
      <div className="flex flex-col items-center w-full max-w-md">
        <div className="mb-3 flex w-full">
          <select
            value={itemType}
            onChange={(e) => setItemType(e.target.value)}
            className="p-2 border border-gray-300 rounded-l"
          >
            <option value="books">Books</option>
            <option value="movies">Movies</option>
          </select>
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="p-2 border border-gray-300"
            disabled={itemType === 'movies'}
          >
            <option value="title">Title</option>
            <option value="author">Author</option>
          </select>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Search for ${itemType} by ${searchType}...`}
            className="p-2 w-full border-t border-b border-r border-gray-300 rounded-r"
          />
        </div>
        <button
          onClick={() => searchItems(false)}
          className="p-2 w-full bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>
      <div id="results" className="w-full max-w-4xl mt-5">
        {items.length > 0 && items.map((item) => {
          // Display book results
          if (itemType === 'books') {
            const book = item as Book;
            const bookInfo = book.volumeInfo || {};
            return (
              <div key={book.id} className="item p-4 mb-4 bg-white rounded shadow flex">
                {bookInfo.imageLinks && bookInfo.imageLinks.thumbnail ? (
                  <img
                    src={bookInfo.imageLinks.thumbnail}
                    alt={bookInfo.title}
                    className="mr-4 max-w-xs object-contain"
                  />
                ) : (
                  <div className="mr-4 h-16 w-12 bg-gray-300 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold">{bookInfo.title}</h3>
                  <p>{bookInfo.authors ? bookInfo.authors.join(', ') : 'Unknown Author'}</p>
                  <p>{bookInfo.publisher ? bookInfo.publisher : 'Unknown Publisher'}, {bookInfo.publishedDate}</p>
                  <p>{bookInfo.description ? bookInfo.description : 'No description available.'}</p>
                </div>
              </div>
            );
          } 
          // Display movie results
          else if (itemType === 'movies') {
            const movie = item as Movie;
            return (
              <div key={movie.id} className="item p-4 mb-4 bg-white rounded shadow flex">
                <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} className="mr-4 max-w-xs object-contain" />
                <div>
                  <h3 className="text-lg font-bold">{movie.title}</h3>
                  <p>Release Date: {movie.release_date}</p>
                  <p>{movie.overview ? movie.overview : 'No overview available.'}</p>
                </div>
              </div>
            );
          }
        })}
      </div>
      {items.length > 0 && (
        <button
          onClick={() => searchItems(true)}
          className="p-2 mt-1 mb-1 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Load More
        </button>
      )}
      <style jsx>{`
        .item img {
          max-width: 100px;
        }
      `}</style>
    </div>
  );
}