import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
import clientPromise from '@/lib/mongodb'; // Ensure correct import of MongoDB client

const PRODUCTION_URL = 'https://kidoquizv2-production.up.railway.app';

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
    return { ...qrData, qrImageData };
}

// **GET endpoint to retrieve the latest QR code**
// **GET endpoint to retrieve the latest QR code**
export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("QuizApp"); // Change this to your database name
        const qrCollection = db.collection("qrCodes");

        // Fetch the latest unused QR code
        let qrCode = await qrCollection.findOne(
            { isUsed: false },
            { sort: { timestamp: -1 } }
        );

        // If no valid QR code exists, generate a new one
        if (!qrCode) {
            const newQRCode = await generateNewQRCode();
            const insertResult = await qrCollection.insertOne(newQRCode);
            
            // Fetch the newly inserted QR code to ensure it's not null
            qrCode = await qrCollection.findOne({ _id: insertResult.insertedId });

            if (!qrCode) {
                throw new Error("Failed to retrieve newly created QR code.");
            }
        }

        return NextResponse.json({
            success: true,
            data: {
                id: qrCode.id,
                qrImageData: qrCode.qrImageData,
                timestamp: qrCode.timestamp,
                _id: qrCode._id, // MongoDB-generated ID
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


// **POST endpoint to validate and process QR code scan**
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { id } = body;

        const client = await clientPromise;
        const db = client.db("QuizApp");
        const qrCollection = db.collection("qrCodes");

        // Find the QR code in the database
        const qrCode = await qrCollection.findOne({ id });

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

        // Mark the QR code as used
        await qrCollection.updateOne({ id }, { $set: { isUsed: true } });

        // Generate a new QR code for the next user
        const newQRCode = await generateNewQRCode();
        const insertedResult = await qrCollection.insertOne(newQRCode);

        // Fetch the inserted document to include the `_id`
        const insertedQRCode = await qrCollection.findOne({ _id: insertedResult.insertedId });

        return NextResponse.json({
            success: true,
            message: "QR code validated successfully",
            newQRCode: {
                id: insertedQRCode?.id,
                qrImageData: insertedQRCode?.qrImageData,
                timestamp: insertedQRCode?.timestamp,
                _id: insertedQRCode?._id, // MongoDB-generated ID
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
