import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
import { networkInterfaces } from 'os';

// Function to get local IP address
function getLocalIPAddress(): string {
    const nets = networkInterfaces();
    const addresses: string[] = [];

    Object.keys(nets).forEach((name) => {
        const interfaces = nets[name];
        if (interfaces) {
            interfaces.forEach((net) => {
                if (net.family === 'IPv4' && !net.internal) {
                    addresses.push(net.address);
                }
            });
        }
    });

    return addresses[0] || 'localhost';
}

// Temporary in-memory storage (will replace with database later)
let activeQRs: { [userId: string]: { id: string; timestamp: number; isUsed: boolean; qrImageData: string } } = {};

// QR code expiration time (5 minutes)
const EXPIRE_TIME = 5 * 60 * 1000; // 5 minutes

// Generate a new QR code for a specific user
async function generateNewQRCode(userId: string) {
    // Check if a valid QR code already exists
    if (activeQRs[userId] && !activeQRs[userId].isUsed) {
        return activeQRs[userId]; // Return the existing QR code if still valid
    }

    // Create new QR data
    const qrData = {
        id: uuidv4(),
        timestamp: Date.now(),
        isUsed: false,
    };

    // Generate a QR code URL
    const urlParams = new URLSearchParams({
        id: qrData.id,
        timestamp: qrData.timestamp.toString(),
    });

    const localIP = getLocalIPAddress();
    const qrUrl = `http://${localIP}:3000/scan/validate?${urlParams.toString()}`;
    console.log('Generated QR URL:', qrUrl);

    // Generate the QR code image
    const qrImageData = await QRCode.toDataURL(qrUrl);

    // Store the new QR code
    activeQRs[userId] = { ...qrData, qrImageData };

    return activeQRs[userId];
}

// Cleanup function to remove expired QR codes
setInterval(() => {
    const currentTime = Date.now();
    Object.keys(activeQRs).forEach((userId) => {
        if (currentTime - activeQRs[userId].timestamp > EXPIRE_TIME) {
            console.log(`QR Code for user ${userId} expired and removed.`);
            delete activeQRs[userId];
        }
    });
}, 60 * 1000); // Runs every 60 seconds

// GET endpoint to retrieve or generate a QR code for a user
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'User ID is required' },
                { status: 400 }
            );
        }

        // Generate or retrieve the user's QR code
        const qrData = await generateNewQRCode(userId);

        return NextResponse.json({
            success: true,
            data: {
                qrImageData: qrData.qrImageData,
                timestamp: qrData.timestamp,
            },
        });
    } catch (error) {
        console.error('Error generating QR code:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to generate QR code' },
            { status: 500 }
        );
    }
}

// POST endpoint to validate and process QR code scan
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { id, userId } = body;

        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'User ID is required' },
                { status: 400 }
            );
        }

        if (!activeQRs[userId]) {
            return NextResponse.json(
                { success: false, error: 'No active QR code found' },
                { status: 404 }
            );
        }

        const currentQRCode = activeQRs[userId];

        if (currentQRCode.id !== id) {
            return NextResponse.json(
                { success: false, error: 'Invalid QR code' },
                { status: 400 }
            );
        }

        // Check if the QR code has expired
        if (Date.now() - currentQRCode.timestamp > EXPIRE_TIME) {
            delete activeQRs[userId]; // Remove expired QR code
            return NextResponse.json(
                { success: false, error: 'QR code expired. Please request a new one.' },
                { status: 400 }
            );
        }

        if (currentQRCode.isUsed) {
            return NextResponse.json(
                { success: false, error: 'This QR code has already been used' },
                { status: 400 }
            );
        }

        // Mark the QR code as used
        currentQRCode.isUsed = true;

        // Generate a new QR code for the next request
        activeQRs[userId] = await generateNewQRCode(userId);

        return NextResponse.json({
            success: true,
            message: 'QR code validated successfully',
        });
    } catch (error) {
        console.error('Error validating QR code:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to process QR code' },
            { status: 500 }
        );
    }
}
