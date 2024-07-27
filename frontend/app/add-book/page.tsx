"use client"

import Link from 'next/link'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

const AddBook = () => {
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [publisher, setPublisher] = useState("")
  const [publishedDate, setPublishedDate] = useState("")
  const [description, setDescription] = useState("")
  const [thumbnail, setThumbnail] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch("http://localhost:4000/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, author, publisher, publishedDate, description, imageLinks: { thumbnail }, quantity })
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Server error response:', data)
        throw new Error(data.message || "Failed to add book")
      }

      console.log('Server success response:', data)
      setSuccess("Book added successfully")
      setTitle("")
      setAuthor("")
      setPublisher("")
      setPublishedDate("")
      setDescription("")
      setThumbnail("")
      setQuantity(1)

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
        <h1 className="mb-5 text-2xl font-bold text-white">Add New Book</h1>
        <form className="flex flex-col" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Title"
              required
              className="mb-3 p-2 border border-gray-300 rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Author"
              required
              className="mb-3 p-2 border border-gray-300 rounded"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
            <input
              type="text"
              placeholder="Publisher"
              className="mb-3 p-2 border border-gray-300 rounded"
              value={publisher}
              onChange={(e) => setPublisher(e.target.value)}
            />
            <input
              type="text"
              placeholder="Published Date"
              className="mb-3 p-2 border border-gray-300 rounded"
              value={publishedDate}
              onChange={(e) => setPublishedDate(e.target.value)}
            />
            <textarea
              placeholder="Description"
              className="mb-3 p-2 border border-gray-300 rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              type="text"
              placeholder="Thumbnail URL"
              className="mb-3 p-2 border border-gray-300 rounded"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
            />
            <input
              type="number"
              placeholder="Quantity"
              required
              className="mb-3 p-2 border border-gray-300 rounded"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
            />
            <button
              type="submit"
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              Add Book
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

export default AddBook
