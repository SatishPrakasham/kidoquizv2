import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Define your production URL (Replace with your Railway URL)
const PRODUCTION_URL = 'https://kidoquizv2-production.up.railway.app';

// Generate a new QR code and store it in the database
async function generateNewQRCode() {
    const qrData = {
        id: uuidv4(),
        timestamp: BigInt(Date.now()), // Ensure timestamp is stored as BigInt
        isUsed: false,
    };

    const urlParams = new URLSearchParams({
        id: qrData.id,
        timestamp: qrData.timestamp.toString(),
    });

    const qrUrl = `${PRODUCTION_URL}/scan/validate?${urlParams.toString()}`;
    console.log('Generated QR URL:', qrUrl);
    const qrImageData = await QRCode.toDataURL(qrUrl);

    // Save to the database
    await prisma.qRCode.create({
        data: {
            id: qrData.id,
            timestamp: qrData.timestamp, // Store as BigInt
            isUsed: false,
            qrImageData: qrImageData,
        },
    });

    return { ...qrData, qrImageData };
}

// GET endpoint to retrieve the latest QR code
export async function GET() {
    try {
        // Fetch the latest unused QR code from the database
        let qrCode = await prisma.qRCode.findFirst({
            where: { isUsed: false },
            orderBy: { timestamp: 'desc' }, // Get the most recent one
        });

        // If no valid QR code exists, generate a new one
        if (!qrCode) {
            qrCode = await generateNewQRCode();
        }

        return NextResponse.json({
            success: true,
            data: {
                id: qrCode.id,
                qrImageData: qrCode.qrImageData,
                timestamp: Number(qrCode.timestamp), // Convert BigInt to Number for response
            },
        });
    } catch (error) {
        console.error('Error fetching QR code:', error);
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

        // Find the QR code in the database
        const qrCode = await prisma.qRCode.findUnique({
            where: { id },
        });

        if (!qrCode) {
            return NextResponse.json(
                { success: false, error: 'Invalid QR code' },
                { status: 400 }
            );
        }

        if (qrCode.isUsed) {
            return NextResponse.json(
                { success: false, error: 'This QR code has expired. Please request a new one.' },
                { status: 400 }
            );
        }

        // Mark the QR code as used in the database
        await prisma.qRCode.update({
            where: { id },
            data: { isUsed: true },
        });

        // Generate a new QR code for the next user
        const newQRCode = await generateNewQRCode();

        return NextResponse.json({
            success: true,
            message: 'QR code validated successfully',
            newQRCode: {
                id: newQRCode.id,
                qrImageData: newQRCode.qrImageData,
                timestamp: Number(newQRCode.timestamp), // Convert BigInt to Number
            },
        });
    } catch (error) {
        console.error('Error validating QR code:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to process QR code' },
            { status: 500 }
        );
    }
}
