"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function AdminPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axios.get("/api/users/admin/getUsers");
        setUsers(response.data.users);
      } catch (error: any) {
        toast.error(error.response?.data?.error || "Failed to fetch users.");
      }
    }

    fetchUsers();
  }, []);

  async function updateUserRole(userId: string, role: string) {
    try {
      await axios.post("/api/users/admin/updateUserRole", { userId, role });
      toast.success(`User updated to ${role}`);
      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, role } : user
        )
      );
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update user role.");
    }
  }

  async function deleteUser(userId: string) {
    try {
      await axios.delete("/api/users/admin/deleteUser", { data: { userId } });
      toast.success("User deleted.");
      setUsers((prev) => prev.filter((user) => user._id !== userId));
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to delete user.");
    }
  }

  return (
    <div className="container mx-auto mt-10 p-5">
      <h1 className="text-3xl font-bold mb-5">Admin Dashboard</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-900">
            <th className="border p-2">Username</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td className="border p-2 text-center">{user.username}</td>
              <td className="border p-2 text-center">{user.email}</td>
              <td className="border p-2 text-center">{user.role}</td>
              
              <td className="border p-2 gap-4 flex justify-center">
                <button onClick={() => updateUserRole(user._id, user.role === "admin" ? "user" : "admin")} className="bg-blue-500 text-white px-3 py-1 rounded">
                  {user.role === "admin" ? "Demote" : "Promote"}
                </button>
                <button onClick={() => deleteUser(user._id)} className="bg-red-500 text-white px-3 py-1 rounded">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
