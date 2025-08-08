"use client";
import React, { useEffect, useState, use } from "react";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import Link from "next/link";

const Header = ({ role }: { role: string }) => {
  return (
    <header className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold">User Profile</h1>
      <nav className="flex items-center space-x-4">
        {role === "admin" && (
          <Link
            href="/admin"
            className="bg-yellow-500 px-4 py-2 rounded-md font-semibold hover:bg-yellow-600 transition"
          >
            Admin Panel
          </Link>
        )}
        <Link
          href="/"
          className="bg-gray-700 px-4 py-2 rounded-md font-semibold hover:bg-gray-800 transition"
        >
          Home
        </Link>
      </nav>
    </header>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white text-center py-4 mt-6">
      &copy; {new Date().getFullYear()} My App. All Rights Reserved.
    </footer>
  );
};

const ProfileDetails = ({ params }: any) => {
  const resolvedParams = use(params);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await axios.get(`/api/users/profile/${resolvedParams?.id}`);
        setUser(res.data.user);
      } catch (err) {
        setError("Failed to fetch user details");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [resolvedParams?.id]);

  if (loading)
    return <div className="text-center text-xl mt-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <Header role={user?.role} />

      <div className="flex flex-col items-center justify-center flex-grow bg-gray-100 p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <div className="flex justify-center">
            <FaUserCircle className="text-gray-500 text-6xl" />
          </div>

          <h2 className="text-2xl text-black font-bold text-center mt-4">
            {user?.username}
          </h2>
          <p className="text-gray-600 text-center">{user?.email}</p>

          <div className="mt-4 space-y-2">
            <p>
              <strong className="font-bold text-black">Role:</strong>{" "}
              <span className="text-green-600 font-bold">{user?.role}</span>
            </p>
            <p>
              <strong className="text-black">Status:</strong>{" "}
              {user?.isVerified ? (
                <span className="text-green-600 font-bold">Verified</span>
              ) : (
                <span className="text-red-500 font-bold">Not Verified</span>
              )}
            </p>
          </div>

          <div className="flex justify-center mt-6">
            <button
              onClick={() => window.history.back()}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfileDetails;
