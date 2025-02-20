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
                // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
                if (net.family === 'IPv4' && !net.internal) {
                    addresses.push(net.address);
                }
            });
        }
    });

    // Return the first valid IP address or localhost if none found
    return addresses[0] || 'localhost';
}

// Temporary in-memory storage (replace with your database)
let currentQRCode: {
    id: string;
    timestamp: number;
    isUsed: boolean;
    qrImageData: string;
} | null = null;

// Generate a new QR code
async function generateNewQRCode() {
    const qrData = {
        id: uuidv4(),
        timestamp: Date.now(),
        isUsed: false,
    };

    // Create a URL that includes the QR data
    const urlParams = new URLSearchParams({
        id: qrData.id,
        timestamp: qrData.timestamp.toString()
    });
    
    // Use local IP address with port 3000
    const localIP = getLocalIPAddress();
    const qrUrl = `http://${localIP}:3000/scan/validate?${urlParams.toString()}`;
    console.log('Generated QR URL:', qrUrl); // For debugging
    const qrImageData = await QRCode.toDataURL(qrUrl);

    return { ...qrData, qrImageData };
}

// GET endpoint to retrieve current QR code
export async function GET() {
    try {
        // If no QR code exists or current one is used, generate new one
        if (!currentQRCode || currentQRCode.isUsed) {
            currentQRCode = await generateNewQRCode();
        }

        return NextResponse.json({
            success: true,
            data: {
                qrImageData: currentQRCode.qrImageData,
                timestamp: currentQRCode.timestamp,
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
        const { id } = body;

        if (!currentQRCode) {
            return NextResponse.json(
                { success: false, error: 'No active QR code found' },
                { status: 404 }
            );
        }

        if (currentQRCode.id !== id) {
            return NextResponse.json(
                { success: false, error: 'Invalid QR code' },
                { status: 400 }
            );
        }

        if (currentQRCode.isUsed) {
            return NextResponse.json(
                { success: false, error: 'This QR code has expired. Please visit campus for a new one.' },
                { status: 400 }
            );
        }

        // Mark current QR as used
        currentQRCode.isUsed = true;

        // Generate new QR code for next user
        currentQRCode = await generateNewQRCode();

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
