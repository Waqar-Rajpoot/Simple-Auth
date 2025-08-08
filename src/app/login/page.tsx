"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function Login() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [buttonDisabled, setbuttonDisabled] = useState(false);
  const [loading, setloading] = useState(false);

  const onLogin = async (e: any) => {
    e.preventDefault();

    if (!user.email || !user.password) {
          toast.error("All fields are required!");
          return;
        }
    try {
      setloading(true);
      const response = await axios.post("/api/users/login", user);
      console.log("login successfully", response.data);
      toast.success("Login successfully");
      setUser({ email: "", password: "" });
      router.push("/profile");
    } catch (error: any) {

      console.log("Login failed", error.response?.data?.error || "Something went wrong");
      toast.error(error.response?.data?.error || "Something went wrong");
    
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0) {
      setbuttonDisabled(false);
    } else {
      setbuttonDisabled(true);
    }
  }, [user]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form action="" className="bg-white p-3 rounded-2xl w-[28%] h-[40%]">
        <h1 className="text-center text-2xl mt-5 text-black">{loading ? "Processing..." : "Login page"}</h1>

        <div className="mt-7">
          <label className="text-black" htmlFor="email">Email</label>
          <br />
          <input
            className="text-black mt-0.5 p-2 border rounded-lg mb-4 focus:outline-none w-[100%]"
            type="text"
            id="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="Enter your email"
          />
        </div>
        <div className="mt-1">
          <label className="text-black" htmlFor="password">Password</label>
          <br />
          <input
            className="text-black mt-0.5 p-2 border rounded-lg mb-4 focus:outline-none w-[100%]"
            type="password"
            id="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            placeholder="Enter your password"
          />
        </div>
        <div className="flex justify-center items-center flex-col mt-4">
          <button
            onClick={onLogin}
            className="w-full p-2 border-none rounded-lg bg-blue-500 focus:outline-none  hover:cursor-pointer hover:bg-blue-600"
          >
            {buttonDisabled ? "No login" : "Login here!"}
          </button>
          <br />
          <div className="flex justify-between w-full items-center border">
            <Link className="text-black" href="/forgotPassword">
              Forgot Password?
            </Link>
          <Link className="text-black " href="/signup">
            Visit Signup page?
          </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
