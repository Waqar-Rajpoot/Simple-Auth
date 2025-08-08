// components/UserProfileForm.tsx
'use client';

import React, { useEffect, useState } from 'react';

// Define props for the form component
interface UserProfileFormProps {
  initialProfile: {
    firstName: string;
    lastName: string;
    email: string;
    bio: string;
  };
  onSave: (updatedFields: { firstName: string; lastName: string; email: string; bio: string }) => void;
  loading: boolean; // Indicates if an update operation is in progress
  error: string | null; // Error message from the update operation
}

const UserProfileForm = ({ initialProfile, onSave, loading, error }: UserProfileFormProps) => {
  const [formData, setFormData] = useState(initialProfile);

  // Corrected: Update form data if initialProfile changes
  // All values used within the effect's logic (initialProfile and formData fields)
  // are now correctly listed in the dependency array.
  // The conditional check inside ensures setFormData is only called when initialProfile
  // is genuinely different from the current formData, preventing infinite re-renders.
  useEffect(() => {
    if (initialProfile.firstName !== formData.firstName ||
        initialProfile.lastName !== formData.lastName ||
        initialProfile.email !== formData.email ||
        initialProfile.bio !== formData.bio) {
      setFormData(initialProfile);
    }
  }, [
    initialProfile, // Trigger effect if initialProfile object reference changes
    // These are included because they are read within the effect's comparison logic
    formData.firstName,
    formData.lastName,
    formData.email,
    formData.bio
  ]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Profile</h2>

      <div className="mb-4">
        <label htmlFor="firstName" className="block text-gray-700 text-sm font-bold mb-2">First Name:</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="lastName" className="block text-gray-700 text-sm font-bold mb-2">Last Name:</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          disabled // Email is typically not editable from profile settings
        />
      </div>

      <div className="mb-6">
        <label htmlFor="bio" className="block text-gray-700 text-sm font-bold mb-2">Bio:</label>
        <textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows={4}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        ></textarea>
      </div>

      {error && (
        <p className="text-red-500 text-xs italic mb-4">{error}</p>
      )}

      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={loading} // Disable button during save operation
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
};

export default UserProfileForm;