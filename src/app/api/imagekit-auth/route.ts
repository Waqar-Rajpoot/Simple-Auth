// app/api/imagekit-auth/route.ts
import { NextResponse } from 'next/server';
import ImageKit from 'imagekit'; // Server-side SDK

// Initialize ImageKit SDK with server-side keys from .env.local
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT as string,
});

export async function GET(request: Request) {
    try {
        // Get authentication parameters from ImageKit SDK
        const authenticationParameters = imagekit.getAuthenticationParameters();
        return NextResponse.json(authenticationParameters);
    } catch (error) {
        console.error('Error generating ImageKit authentication parameters:', error);
        return NextResponse.json({ error: 'Failed to get authentication parameters.' }, { status: 500 });
    }
}