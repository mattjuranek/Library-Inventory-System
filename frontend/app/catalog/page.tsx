"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { UserCircleIcon, CalendarIcon } from '@heroicons/react/24/solid';

interface Book {
  _id: string;
  title: string;
  author: string;
  location?: string;
  genre?: string;
  description?: string;
  quantity: number;
}

interface Movie {
  _id: string;
  title: string;
  author: string;
  location?: string;
  genre?: string;
  description?: string;
  quantity: number;
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
      const searchParams = { [searchType]: query };

      if (itemType === 'books') {
        const res = await axios.get(`http://localhost:4000/books/search`, {
          params: searchParams,
        });
        newItems = res.data || [];
      } else if (itemType === 'movies') {
        const res = await axios.get(`http://localhost:4000/movies/search`, {
          params: searchParams,
        });
        newItems = res.data || [];
      }

      if (loadMore) {
        setItems((prevItems) => [...prevItems, ...newItems]);
        setPage(newPage);
      } else {
        setItems(newItems);
        setPage(1);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      searchItems(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-200 to-blue-500 pb-10">
      <div className="absolute top-5 left-5 flex flex-col space-y-2">
        <Link href="/profile" legacyBehavior>
          <a className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-700 flex items-center">
            <UserCircleIcon className="h-6 w-6" />
            <span className="ml-2">Profile</span>
          </a>
        </Link>
        <Link href="/calendar" legacyBehavior>
          <a className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-700 flex items-center">
            <CalendarIcon className="h-6 w-6" />
            <span className="ml-2">Calendar</span>
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
          >
            <option value="title">Title</option>
            <option value="author">Author</option>
            <option value="location">Location</option>
            <option value="genre">Genre</option>
            <option value="quantity"># Copies</option>
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
          if (itemType === 'books') {
            const book = item as Book;
            return (
              <div key={book._id} className="item p-4 mb-4 bg-white rounded shadow flex">
                <div>
                  <h3 className="text-lg font-bold">{book.title}</h3>
                  <p>Author: {book.author}</p>
                  <p>Location: {book.location || 'Unknown'}</p>
                  <p>Genre: {book.genre || 'Unknown'}</p>
                  <p>Description: {book.description || 'No description available.'}</p>
                  <p>Copies: {book.quantity}</p>
                </div>
              </div>
            );
          } else if (itemType === 'movies') {
            const movie = item as Movie;
            return (
              <div key={movie._id} className="item p-4 mb-4 bg-white rounded shadow flex">
                <div>
                  <h3 className="text-lg font-bold">{movie.title}</h3>
                  <p>Author: {movie.author}</p>
                  <p>Location: {movie.location || 'Unknown'}</p>
                  <p>Genre: {movie.genre || 'Unknown'}</p>
                  <p>Description: {movie.description || 'No description available.'}</p>
                  <p>Copies: {movie.quantity}</p>
                </div>
              </div>
            );
          }
        })}
      </div>
      {items.length > 0 && (      //TODO: Fix load more button
        <button
          onClick={() => searchItems(true)}
          className="p-2 mt-1 mb-1 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Load More
        </button>
      )}
    </div>
  );
}
