// app/api/user/route.ts
import { NextResponse } from 'next/server';
import { connect } from "@/dbConfig/dbConfig";

import User from '@/models/userModel';

// --- GET Request (Fetch User Profile) ---
export async function GET(request: Request) {
  try {
    await connect(); // Ensure Mongoose connection is established

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    // Find user by ID using Mongoose model and convert to plain JavaScript object
    const user = await User.findById(userId).lean();

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    console.error('API Error (GET /api/user):', error);
    // Handle Mongoose specific errors like invalid ObjectId format
    if (error.name === 'CastError') {
        return NextResponse.json({ message: 'Invalid User ID format' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Failed to fetch user profile', error: error.message }, { status: 500 });
  }
}

// --- PUT Request (Update User Profile) ---
export async function PUT(request: Request) {
  try {
    await connect(); // Ensure Mongoose connection is established

    const body = await request.json();
    const { _id, ...updatedFields } = body; // Destructure _id and other fields from the request body

    if (!_id) {
      return NextResponse.json({ message: 'User ID (_id) is required for update' }, { status: 400 });
    }

    // Find and update user by ID using Mongoose
    // { new: true } returns the updated document
    // { runValidators: true } runs schema validators on the update operation
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { $set: updatedFields },
      { new: true, runValidators: true }
    ).lean(); // Convert to plain JavaScript object for the response

    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found or nothing to update' }, { status: 404 });
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error: any) {
    console.error('API Error (PUT /api/user):', error);
    if (error.name === 'CastError') {
        return NextResponse.json({ message: 'Invalid User ID format' }, { status: 400 });
    }
    // Handle Mongoose validation errors (e.g., required fields missing, max length exceeded)
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((err: any) => err.message);
        return NextResponse.json({ message: 'Validation failed', errors: messages }, { status: 400 });
    }
    return NextResponse.json({ message: 'Failed to update user profile', error: error.message }, { status: 500 });
  }
}

// --- POST Request (Create User Profile - Optional, for initial setup or user registration) ---
export async function POST(request: Request) {
  try {
    await connect(); // Ensure Mongoose connection is established

    const newUser = await request.json();

    // Create a new user document using Mongoose Model
    const createdUser = await User.create(newUser);

    return NextResponse.json(createdUser.toObject(), { status: 201 }); // Convert to plain JS object for response
  } catch (error: any) {
    console.error('API Error (POST /api/user):', error);
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((err: any) => err.message);
        return NextResponse.json({ message: 'Validation failed', errors: messages }, { status: 400 });
    }
    // Handle duplicate key error (e.g., for unique email field)
    if (error.code === 11000) {
        return NextResponse.json({ message: 'Email already exists' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Failed to create user profile', error: error.message }, { status: 500 });
  }
}

// --- DELETE Request (Delete User Profile - Optional) ---
export async function DELETE(request: Request) {
  try {
    await connect(); // Ensure Mongoose connection is established

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    // Find and delete user by ID using Mongoose
    const deletedUser = await User.findByIdAndDelete(userId).lean();

    if (!deletedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('API Error (DELETE /api/user):', error);
    if (error.name === 'CastError') {
        return NextResponse.json({ message: 'Invalid User ID format' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Failed to delete user profile', error: error.message }, { status: 500 });
  }
}