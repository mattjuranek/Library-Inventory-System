"use client"

import Link from 'next/link'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

const UpdateBook = () =>{
    const [title, setTitle] = useState("")
    const [author, setAuthor] = useState("")
    const [newTitle, setNewTitle] = useState("")
    const [newAuthor, setNewAuthor] = useState("")
    const [location, setLocation] = useState("")
    const [genre, setGenre] = useState("")
    const [description, setDescription] = useState("")
    const [quantity, setQuantity] = useState("")
    const [status, setStatus] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const router = useRouter()


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)

        if (!newTitle && !newAuthor && !location && !genre && !description && !quantity && !status) {
            setError('Please input information to update!');
            return;
          }

        try {
            const response = await fetch(`http://localhost:4000/books`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ title, author, newTitle, newAuthor, location, genre, description, quantity, status})
            })
      
            if (!response.ok) {
              // Check if response is not OK
              const errorData = await response.json();
              console.error('Server error response:', errorData)
              throw new Error(errorData.message || "Failed to update book")
            }
      
            const data = await response.json()
            console.log('Server success response:', data)
            setSuccess("Book updated successfully")
            setTitle("")
            setAuthor("")
            setNewTitle("")
            setNewAuthor("")
            setLocation("")
            setGenre("")
            setDescription("")
            setQuantity("")
            setStatus("")
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
                <h1 className="mb-5 text-2xl font-bold text-white">Update Book Details</h1>
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
                      placeholder="Current Author"
                      required
                      className="mb-3 p-2 border border-gray-300 rounded"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
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
                      placeholder="New Author"
                      className="mb-3 p-2 border border-gray-300 rounded"
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                    />
                     <input
                      type="text"
                      placeholder="Location"
                      className="mb-3 p-2 border border-gray-300 rounded"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                     <input
                      type="text"
                      placeholder="Genre"
                      className="mb-3 p-2 border border-gray-300 rounded"
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                    />
                     <textarea
                      placeholder="Description"
                      className="mb-3 p-2 border border-gray-300 rounded"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                     <input
                      type="number"
                      placeholder="Quantity"
                      className="mb-3 p-2 border border-gray-300 rounded"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                    <select value={status} onChange = {(e)=>setStatus(e.target.value)} className="mb-3 p-2 border border-gray-300 rounded"> 
                        <option value="">Select Status</option>
                        <option value ="available">Available</option>
                        <option value="checked out">Checked Out</option>
                        <option value="reserved">Reserved</option>
                    </select>
                    <button
                      type="submit"
                      className="p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                    >
                      Update Book
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

export default UpdateBook