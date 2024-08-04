"use client";

import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const UpdateEvent = () => {
  const [title, setTitle] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newImage, setNewImage] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newDate, setNewDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("http://localhost:4000/events", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, newTitle, newDescription, newImage, newTime, newDate })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error response:', errorData);
        throw new Error(errorData.message || "Failed to update event");
      }

      const data = await response.json();
      console.log('Server success response:', data);
      setSuccess("Event updated successfully");
      setTitle("");
      setNewTitle("");
      setNewDescription("");
      setNewImage("");
      setNewTime("");
      setNewDate("");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-200 to-blue-500">
      <h1 className="mb-5 text-2xl font-bold text-white">Update Event</h1>
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Current Title"
          required
          className="mb-3 p-2 border border-gray-300 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="New Title"
          className="mb-3 p-2 border border-gray-300 rounded"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="New Description"
          className="mb-3 p-2 border border-gray-300 rounded"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="New Image URL"
          className="mb-3 p-2 border border-gray-300 rounded"
          value={newImage}
          onChange={(e) => setNewImage(e.target.value)}
        />
        <input
          type="text"
          placeholder="New Time (HH:MM)"
          className="mb-3 p-2 border border-gray-300 rounded"
          value={newTime}
          onChange={(e) => setNewTime(e.target.value)}
        />
        <input
          type="text"
          placeholder="New Date (YYYY-MM-DD)"
          className="mb-3 p-2 border border-gray-300 rounded"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
        />
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Update Event
        </button>
      </form>
      {error && <p className="mt-3 text-red-500">{error}</p>}
      {success && <p className="mt-3 text-black">{success}</p>}
      <p className="mt-5 text-white">
        Return to {" "}
        <Link href="/" className="text-blue-800 transition hover:text-blue-300 hover:underline">
          Home
        </Link>
      </p>
    </div>
  );
};

export default UpdateEvent;
