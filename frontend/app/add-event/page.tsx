"use client"

import Link from 'next/link'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

const AddEvent = () => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState("")
  const [time, setTime] = useState("")
  const [date, setDate] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch("http://localhost:4000/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, description, image, time, date })
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Server error response:', data)
        throw new Error(data.message || "Failed to add event")
      }

      console.log('Server success response:', data)
      setSuccess("Event added successfully")
      setTitle("")
      setDescription("")
      setImage("")
      setTime("")
      setDate("")

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("An unexpected error occurred")
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-200 to-blue-500">
        <h1 className="mb-5 text-2xl font-bold text-white">Add New Event</h1>
        <form className="flex flex-col" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Title"
              required
              className="mb-3 p-2 border border-gray-300 rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Description"
              required
              className="mb-3 p-2 border border-gray-300 rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              type="text"
              placeholder="Image URL"
              className="mb-3 p-2 border border-gray-300 rounded"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
            <input
              type="text"
              placeholder="Time"
              required
              className="mb-3 p-2 border border-gray-300 rounded"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
            <input
              type="text"
              placeholder="Date"
              required
              className="mb-3 p-2 border border-gray-300 rounded"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <button
              type="submit"
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              Add Event
            </button>
        </form>
        {error && <p className="mt-3 text-red-500">{error}</p>}
        {success && <p className="mt-3 text-black">{success}</p>}
        <p className="mt-5 text-white">
            Return to {" "}
            <Link
              href="/"
              className="text-blue-800 transition hover:text-blue-300 hover:underline"
            >
              Home
            </Link>
        </p>
    </div>
  )
}

export default AddEvent
