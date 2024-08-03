import Link from 'next/link';
import React from 'react';
import { UserCircleIcon, CalendarIcon } from '@heroicons/react/24/solid';

const Employee = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-200 to-blue-500'>
      <div className="absolute top-5 left-5 flex flex-col space-y-2">
        <Link href="/profile" legacyBehavior>
          <a className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-700 flex items-center">
            <UserCircleIcon className="h-6 w-6" />
            <span className="ml-2">Profile</span>
          </a>
        </Link>
      </div>
      <h2 className='mb-5 text-2xl font-bold text-white'>Welcome to Your Employee Portal!</h2>
      <div className='flex flex-col'>
        <Link href='/add-book' className='mb-3 p-2 bg-blue-500 text-white rounded hover:bg-blue-700 text-center'> 
          Add Book 
        </Link>
        <Link href='/remove-book' className='mb-3 p-2 bg-blue-500 text-white rounded hover:bg-blue-700 text-center'>
          Remove Book
        </Link>
        <Link href='/update-book' className='mb-3 p-2 bg-blue-500 text-white rounded hover:bg-blue-700 text-center'>
          Update Book
        </Link>
        <Link href='/add-movie' className='mb-3 p-2 bg-blue-500 text-white rounded hover:bg-blue-700 text-center'>
          Add Movie
        </Link>
        <Link href='/remove-movie' className='mb-3 p-2 bg-blue-500 text-white rounded hover:bg-blue-700 text-center'>
          Remove Movie
        </Link>
        <Link href='/update-movie' className='mb-3 p-2 bg-blue-500 text-white rounded hover:bg-blue-700 text-center'>
          Update Movie
        </Link>
        <Link href='/add-member' className='mb-3 p-2 bg-blue-500 text-white rounded hover:bg-blue-700 text-center'>
          Add Member
        </Link>
      </div>
    </div>
  );
};

export default Employee;
