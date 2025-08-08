"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";


const VerifyEmailPage = () => {
  const router = useRouter()
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);

  const verifyUserEmail = async () => {
    try {
      await axios.post("/api/users/verifyemail", { token });
      setVerified(true);
      router.push('/login')
    } catch (error: any) {
      setError(true);
      console.log(error.response.data);
      toast.error(error.response.data);
    }
  };

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken || "");
  }, []);

  useEffect(() => {
    if (token.length > 0) {
      verifyUserEmail();
    }
  }, [token]);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bol text-center mb-4 bg-blue-500 text-black py-2 rounded-md w-full">
          Verifing Your Email...
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Please wait while we verify your email address.
        </p>  
        {verified ? (
          <div className="mt-6 text-center">
            <h2 className="text-2xl font-semibold text-green-600">Email Verified Successfully!</h2>
          </div>
        ) : error ? (
          <div className="mt-6 text-center">
            <h2 className="text-2xl font-semibold text-red-600">Verification Failed</h2>
            <p className="text-gray-600 mt-2">Please try again or contact support.</p>
          </div>
        ) : (
          <div className="mt-6 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}
      </div>
    </div>
  );
  
};

export default VerifyEmailPage;
