import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';

// Define your production URL (Replace with your Railway URL)
const PRODUCTION_URL = 'https://kidoquizv2-production.up.railway.app';

// Temporary in-memory storage for QR code
let currentQRCode: {
    id: string;
    timestamp: number;
    isUsed: boolean;
    qrImageData: string;
} | null = null;

// Function to generate a new QR code
async function generateNewQRCode() {
    const qrData = {
        id: uuidv4(),
        timestamp: Date.now(),
        isUsed: false,
    };

    const urlParams = new URLSearchParams({
        id: qrData.id,
        timestamp: qrData.timestamp.toString(),
    });

    const qrUrl = `${PRODUCTION_URL}/scan/validate?${urlParams.toString()}`;
    console.log('Generated QR URL:', qrUrl);

    const qrImageData = await QRCode.toDataURL(qrUrl);
    currentQRCode = { ...qrData, qrImageData }; // Save in memory
    return currentQRCode;
}

// GET endpoint to retrieve the latest QR code
export async function GET() {
    try {
        if (!currentQRCode || currentQRCode.isUsed) {
            console.log('⚠️ No valid QR found. Generating a new one...');
            currentQRCode = await generateNewQRCode();
        }

        return NextResponse.json({
            success: true,
            data: {
                id: currentQRCode.id,
                qrImageData: currentQRCode.qrImageData,
                timestamp: currentQRCode.timestamp,
            },
        });
    } catch (error) {
        console.error('🚨 Error fetching QR code:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch QR code' },
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
                { success: false, error: 'This QR code has expired. Please request a new one.' },
                { status: 400 }
            );
        }

        // Mark the QR code as used
        currentQRCode.isUsed = true;

        // Generate a new QR code for the next user
        const newQRCode = await generateNewQRCode();

        return NextResponse.json({
            success: true,
            message: 'QR code validated successfully',
            newQRCode: {
                id: newQRCode.id,
                qrImageData: newQRCode.qrImageData,
                timestamp: newQRCode.timestamp,
            },
        });
    } catch (error) {
        console.error('🚨 Error validating QR code:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to process QR code' },
            { status: 500 }
        );
    }
}
