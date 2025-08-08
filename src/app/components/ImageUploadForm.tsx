// app/components/ImageUploadForm.tsx
'use client'; // This directive makes it a Client Component

import { useState, useRef } from 'react';
import ImageKit from 'imagekit-javascript'; // Client-side SDK
import Image from 'next/image';

// Initialize ImageKit SDK with public keys and authentication endpoint
// These environment variables are available client-side due to NEXT_PUBLIC_ prefix
const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY as string,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT as string,
    authenticationEndpoint: '/api/imagekit-auth', // Our Next.js App Router API route
});

export default function ImageUploadForm() {
    const [status, setStatus] = useState<string>('');
    const [statusType, setStatusType] = useState<'success' | 'error' | ''>('');
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
    const [uploadedImageDetails, setUploadedImageDetails] = useState<any | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const folderNameRef = useRef<HTMLInputElement>(null);

    const handleUpload = async () => {
        const file = fileInputRef.current?.files?.[0];
        const folder = folderNameRef.current?.value.trim() || '/';

        if (!file) {
            updateStatus('Please select an image file.', 'error');
            return;
        }

        // Clear previous results
        updateStatus('', '');
        setUploadedImageUrl(null);
        setUploadedImageDetails(null);

        updateStatus('Uploading...', '');

        try {
            const uploadResult = await imagekit.upload({
                file: file,
                fileName: file.name,
                folder: folder,
                tags: ['nextjs-app-router', 'upload-example'],
            });

            updateStatus('Upload successful!', 'success');
            setUploadedImageUrl(uploadResult.url);
            setUploadedImageDetails(uploadResult);

        } catch (error: any) {
            console.error('Upload failed:', error);
            let errorMessage = 'Failed to upload image. Please try again.';
            if (error.message) {
                errorMessage += ` Details: ${error.message}`;
            }
            updateStatus(errorMessage, 'error');
        }
    };

    const updateStatus = (message: string, type: 'success' | 'error' | '') => {
        setStatus(message);
        setStatusType(type);
    };

    return (
        <div className="container mx-auto p-6 md:p-10 bg-white shadow-lg rounded-xl max-w-2xl mt-10">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
                Upload Image to ImageKit.io
            </h1>

            <div className="mb-6">
                <label htmlFor="imageFile" className="block text-gray-700 text-sm font-bold mb-2">
                    Select Image:
                </label>
                <input
                    type="file"
                    id="imageFile"
                    accept="image/*"
                    ref={fileInputRef}
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
            </div>

            <div className="mb-6">
                <label htmlFor="folderName" className="block text-gray-700 text-sm font-bold mb-2">
                    Folder (optional):
                </label>
                <input
                    type="text"
                    id="folderName"
                    placeholder="e.g., my-uploads"
                    ref={folderNameRef}
                    className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                />
            </div>

            <button
                onClick={handleUpload}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
            >
                Upload Image
            </button>

            {status && (
                <div
                    className={`mt-6 p-4 rounded-lg text-center font-semibold ${
                        statusType === 'success'
                            ? 'bg-green-100 text-green-800 border border-green-200'
                            : 'bg-red-100 text-red-800 border border-red-200'
                    }`}
                >
                    {status}
                </div>
            )}

            {uploadedImageDetails && (
                <div className="mt-8 p-6 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Uploaded Image Details:</h3>
                    <p className="text-gray-600 mb-2">
                        <strong className="text-gray-800">File Name:</strong> {uploadedImageDetails.name}
                    </p>
                    <p className="text-gray-600 mb-2">
                        <strong className="text-gray-800">Image URL:</strong>{' '}
                        <a
                            href={uploadedImageDetails.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline break-words"
                        >
                            {uploadedImageDetails.url}
                        </a>
                    </p>
                    <p className="text-gray-600 mb-2">
                        <strong className="text-gray-800">Thumbnail URL:</strong>{' '}
                        <a
                            href={uploadedImageDetails.thumbnailUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline break-words"
                        >
                            {uploadedImageDetails.thumbnailUrl}
                        </a>
                    </p>
                    <p className="text-gray-600">
                        <strong className="text-gray-800">File ID:</strong> {uploadedImageDetails.fileId}
                    </p>
                </div>
            )}

            {uploadedImageUrl && (
                <Image
                    src={uploadedImageUrl}
                    alt="Uploaded"
                    className="mt-6 max-w-full h-auto rounded-lg shadow-md border border-gray-200"
                />
            )}
        </div>
    );
}