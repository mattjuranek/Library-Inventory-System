"use client"

import Link from "next/link"
import React, { useState } from "react"
import { useRouter } from "next/navigation"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    try {
      const response = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username: email, password })
      })

      if (!response.ok) {
        throw new Error("Login failed")
      }

      const data = await response.json()
      localStorage.setItem("accessToken", data.accessToken)
      localStorage.setItem("refreshToken", data.refreshToken)

      router.push("/profile")
    } 
    catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } 
      else {
        setError("An unexpected error occurred")
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-200 to-blue-500">
        <h1 className="mb-5 text-2xl font-bold text-white">Login</h1>
        <form className="flex flex-col" onSubmit={handleSubmit}>
            <input
            type="email"
            placeholder="Email"
            required
            className="mb-3 p-2 border border-gray-300 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
            <input
            type="password"
            placeholder="Password"
            required
            className="mb-3 p-2 border border-gray-300 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
            <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
            Login
            </button>
        </form>
        {error && <p className="mt-3 text-red-500">{error}</p>}
        <p className="mt-5 text-white">
            Don't have an account?{" "}
            <Link
            href="/signup"
            className="text-blue-800 transition hover:text-blue-300 hover:underline"
            >
            Signup
            </Link>
        </p>
    </div>
  )
}

export default Login