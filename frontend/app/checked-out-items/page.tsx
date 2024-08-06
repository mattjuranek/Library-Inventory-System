"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, MagnifyingGlassIcon, CalendarIcon } from '@heroicons/react/24/solid';

const CheckedOutItems = () => {
  const router = useRouter();

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-200 to-blue-500">
      <div className="absolute top-5 left-5 flex flex-col space-y-2">
        <Link href="/catalog" legacyBehavior>
          <a className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-700 flex items-center">
            <MagnifyingGlassIcon className="h-6 w-6" />
            <span className="ml-2">Search</span>
          </a>
        </Link>
        <Link href="/calendar" legacyBehavior>
          <a className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-700 flex items-center">
            <CalendarIcon className="h-6 w-6" />
            <span className="ml-2">Calendar</span>
          </a>
        </Link>
        <button
          onClick={() => router.back()}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-700 flex items-center"
        >
          <ArrowLeftIcon className="h-6 w-6" />
          <span className="ml-2">Back</span>
        </button>
      </div>
      <h1 className="mb-5 text-2xl font-bold text-white">Checked Out Items</h1>
      <div className="flex flex-col items-center justify-center p-5 rounded bg-white shadow-lg">
        <p className="text-gray-800">No items checked out</p>
      </div>
    </div>
  );
};

export default CheckedOutItems;