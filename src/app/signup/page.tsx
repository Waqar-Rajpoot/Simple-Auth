"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function Signup() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    username: "",
    password: "",
  });

  const [buttonDisabled, setbuttonDisabled] = useState(false);
  const [loading, setloading] = useState(false);

  const onSignup = async (e) => {
    e.preventDefault();

    if (!user.username || !user.email || !user.password) {
      toast.error("All fields are required!");
      return;
    }

    if (user.password.length < 8) {
      toast.error("Password must be at least 8 characters long!");
      return;
    }

    try {
      setloading(true);
      const response = await axios.post("/api/users/signup", user);
      console.log("Signup successfully", response.data);
      toast.success("Registered successfully");
      setUser({ email: "", username: "", password: "" });
      router.push("/login");
    } catch (error: any) {
      console.log("Signup failed", error.message);
      toast.error(error.message);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    if (
      user.email.length > 0 &&
      user.password.length > 0 &&
      user.username.length > 0
    ) {
      setbuttonDisabled(false);
    } else {
      setbuttonDisabled(true);
    }
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <form action="" className=" bg-white p-3 rounded-2xl w-[28%] h-[40%]">
        <h1 className="text-center text-2xl mt-5 text-black font-bold">
          {loading ? "Processing..." : "Signup page"}
        </h1>
        <div className="mt-7">
          <label className="text-black" htmlFor="username">Username</label>
          <br />
          <input
            className="mt-0.5 p-2 border text-black border-gray-900 rounded-lg mb-4 focus:outline-none w-[100%]"
            type="text"
            id="username"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            placeholder="Enter your username"
          />
        </div>
        <div>
          <label className="text-black" htmlFor="email">Email</label>
          <br />
          <input
            className="mt-0.5 p-2 border text-black border-gray-900 rounded-lg mb-4 focus:outline-none w-[100%]"
            type="text"
            id="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label className="text-black" htmlFor="password">Password</label>
          <br />
          <input
            className="mt-0.5 p-2 border text-black border-gray-900 rounded-lg mb-4 focus:outline-none w-[100%]"
            type="password"
            id="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            placeholder="Enter your password"
          />
        </div>
        <div className="flex justify-center items-center flex-col mt-4">
          <button
            onClick={onSignup}
            className="w-full p-2 border-none rounded-lg bg-blue-500 focus:outline-none hover:bg-blue-600 hover:cursor-pointer">
            {buttonDisabled ? "No Signup" : "Signup here!"}
          </button>
          <br />
          <div className="items-center">
          <Link className="text-black hover:text-gray-900 " href="/login">
            Visit Login page?
          </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
