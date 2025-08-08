// "use client";
// import React, { useState } from "react";
// import Link from "next/link";
// import toast from "react-hot-toast";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import { FaUserCircle } from "react-icons/fa";

// const Profile = () => {
//   const router = useRouter();
//   const [data, setData] = useState("Nothing");

//   const logout = async () => {
//     try {
//       await axios.get("/api/users/logout");
//       toast.success("Logout successful");
//       router.push("/login");
//     } catch (error: any) {
//       console.error(error.message);
//       toast.error("Failed to logout");
//     }
//   };

//   const getUserDetails = async () => {
//     try {
//       const res = await axios.get("/api/users/me");
//       setData(res.data.data._id);
//     } catch (error: any) {
//       console.error(error.message);
//       toast.error("Failed to fetch user details");
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-300">
//       {/* Header */}
//       <header className="bg-blue-600 text-white py-4 text-center text-2xl font-semibold shadow-md">
//         Profile Page
//       </header>

//       {/* Profile Card */}
//       <div className="flex flex-col items-center justify-center flex-grow p-6">
//         <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full text-center">
//           <FaUserCircle className="text-gray-400 text-6xl mx-auto mb-4" />
//           <h2 className="text-lg font-semibold text-black">User ID:</h2>
//           <p className="text-gray-700 text-sm mb-4">
//             {data === "Nothing" ? "No User Data" : <Link href={`/profile/${data}`} className="text-blue-500 hover:underline">{data}</Link>}
//           </p>
//           <div className="flex flex-col gap-3">
//             <button
//               onClick={logout}
//               className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition"
//             >
//               Logout
//             </button>
//             <button
//               onClick={getUserDetails}
//               className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition"
//             >
//               Get User Details
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Footer */}
//       <footer className="bg-gray-800 text-white text-center py-3 text-sm">
//         &copy; {new Date().getFullYear()} Your Company. All rights reserved.
//       </footer>
//     </div>
//   );
// };

// export default Profile;


// app/profile/page.tsx
'use client'; // <-- THIS IS CRUCIAL FOR REACT HOOKS AND REDUX HOOKS

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'; // Adjust path as needed
import { fetchUserProfile, updateUserProfile, clearUpdateError } from '@/lib/redux/slices/userProfileSlice'; // Adjust path as needed
import UserProfileForm from '@/components/UserProfileForm'; // Adjust path as needed
import Image from 'next/image';

export default function UserProfilePage() {
  const dispatch = useAppDispatch();
  // Select relevant state from the Redux store
  const { profile, loading, error, updateLoading, updateError } = useAppSelector((state) => state.user);

  // IMPORTANT: This userId MUST match an _id of a document in your MongoDB 'users' collection.
  // If no user with this ID exists, the page will show "User not found" or "No profile data available."
  const userId = '6661909a7b973ef4d94b0d0c'; // Replace with an actual ObjectId from your DB!

  // Effect hook to fetch user profile when the component mounts or dependencies change
  useEffect(() => {
    // Only dispatch fetch if profile data is not already loaded, not currently loading, and no error occurred
    // This prevents redundant fetches on re-renders if data is already present or being fetched
    if (!profile && !loading && !error) {
      dispatch(fetchUserProfile(userId));
    }
  }, [dispatch, userId, profile, loading, error]); // Dependencies for the effect

  // Handler for saving updated profile data
  const handleUpdateProfile = (updatedFields: { firstName: string; lastName: string; email: string; bio: string }) => {
    if (profile) {
      // Dispatch the async thunk to update the user profile in the database
      dispatch(updateUserProfile({ _id: profile._id, ...updatedFields }));
    }
  };

  // Effect to clear update error message after a few seconds (for user feedback)
  useEffect(() => {
    if (updateError) {
      const timer = setTimeout(() => {
        dispatch(clearUpdateError());
      }, 5000); // Clear error after 5 seconds
      return () => clearTimeout(timer); // Cleanup timer on component unmount or error change
    }
  }, [updateError, dispatch]);


  return (
    <div className="min-h-screen bg-gray-100 p-8 flex justify-center items-start">
      <div className="w-full max-w-xl">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">Your Profile</h1>

        {/* Loading and Error Feedback for initial fetch */}
        {loading && (
          <div className="text-center text-lg text-blue-600">Loading profile...</div>
        )}

        {error && (
          <div className="text-center text-lg text-red-600">Error loading profile: {error}. Please try again.</div>
        )}

        {/* Display User Profile Overview (only if profile data is available) */}
        {profile && (
          <div className="bg-white p-6 rounded-lg shadow-xl mb-8 text-center">
            <Image
              src={profile.avatarUrl}
              alt="User Avatar"
              className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-blue-500"
            />
            <h2 className="text-3xl font-semibold text-gray-900">{profile.firstName} {profile.lastName}</h2>
            <p className="text-gray-600">{profile.email}</p>
            <p className="text-gray-700 mt-4 italic">{profile.bio}</p>
          </div>
        )}

        {/* User Profile Edit Form (only if profile data is available) */}
        {profile && (
          <UserProfileForm
            initialProfile={{
              firstName: profile.firstName,
              lastName: profile.lastName,
              email: profile.email,
              bio: profile.bio,
            }}
            onSave={handleUpdateProfile}
            loading={updateLoading} // Pass update loading status
            error={updateError}     // Pass update error message
          />
        )}

        {/* Message if no profile data is available after loading, and no error occurred */}
        {!profile && !loading && !error && (
            <div className="text-center text-lg text-gray-500">No profile data available.</div>
        )}
      </div>
    </div>
  );
}