import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';

// Define your production URL (Replace this with your actual Railway URL)
const PRODUCTION_URL = 'https://kidoquizv2-production.up.railway.app';

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

    // Create a URL that includes the QR data (Pointing to your live Railway domain)
    const urlParams = new URLSearchParams({
        id: qrData.id,
        timestamp: qrData.timestamp.toString()
    });

    const qrUrl = `${PRODUCTION_URL}/scan/validate?${urlParams.toString()}`;
    console.log('Generated QR URL:', qrUrl); // For debugging
    const qrImageData = await QRCode.toDataURL(qrUrl);

    return { ...qrData, qrImageData };
}

// GET endpoint to retrieve current QR code
export async function GET() {
    try {
        // If no QR code exists or current one is used, generate a new one
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
