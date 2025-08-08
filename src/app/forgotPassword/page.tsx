"use client"
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const router = useRouter()
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(email);
    
    try {
      const res = await axios.post("/api/users/forgotPassword", { email });
      setMessage(res.data.message);
      setEmail("");
      // router.push('/login')
    } catch (error: any) {
      setMessage(error.response.data.error);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-bold text-black mb-4">Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded-lg p-2 w-full outline-none text-black border-gray-600 mb-4"
        />
        <button type="submit" className="bg-blue-500 rounded-lg text-white p-2 mt-2 w-full hover:bg-blue-600 hover:cursor-pointer">
          Send Reset Link
        </button>
        {message && <p className="mt-2 text-black">{message}</p>}
      </form>
    </div>
  );
}
