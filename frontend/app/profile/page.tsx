"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

const Profile = () => {
  const [user, setUser] = useState<{ username: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken")
    if (!accessToken) {
      router.push("/login")
      return
    }

    const fetchUserProfile = async () => {
      try {
        const response = await fetch("http://localhost:4000/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
          }
        })

        if (!response.ok) {
          throw new Error("Failed to fetch user profile")
        }

        const data = await response.json()
        console.log("Fetched user data:", data)
        setUser({ username: data.username })
      } 
      catch (err) {
        console.error(err)
        router.push("/login")
      }
    }

    fetchUserProfile()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    router.push("/login")
  }

  if (!user) {
    return <p>Loading...</p>
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-200 to-blue-500">
      <h1 className="mb-5 text-2xl font-bold text-white">Profile</h1>
      <div className="flex flex-col items-center justify-center p-5 rounded bg-transparent">
        <p className="mb-3 text-white">Username: {user.username}</p>
        <button
          onClick={handleLogout}
          className="p-2 bg-red-500 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default Profile
