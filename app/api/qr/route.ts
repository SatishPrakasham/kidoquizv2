import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
import { db } from 'lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

// Always use production URL for QR codes to ensure they work after scanning
const QR_PRODUCTION_URL = 'https://kidoquizv2-production.up.railway.app';

// In-memory QR code
let currentQRCode: {
  id: string;
  timestamp: number;
  isUsed: boolean;
  qrImageData: string;
} | null = null;

// Generate a new QR Code
async function generateNewQRCode() {
  const qrData = {
    id: uuidv4(),
    timestamp: Date.now(),
  };

  // Generate QR code with the quiz URL and the unique ID
  const qrImageData = await QRCode.toDataURL(`${QR_PRODUCTION_URL}/scan/validate?id=${qrData.id}&timestamp=${qrData.timestamp}`);

  currentQRCode = {
    id: qrData.id,
    timestamp: qrData.timestamp,
    isUsed: false,
    qrImageData,
  };

  return currentQRCode;
}

// GET handler - returns the current QR code or generates a new one
export async function GET() {
  try {
    // If no QR code exists or it's older than 5 minutes, generate a new one
    if (!currentQRCode || Date.now() - currentQRCode.timestamp > 5 * 60 * 1000) {
      const newQRCode = await generateNewQRCode();
      return NextResponse.json(newQRCode);
    }

    // Return the existing QR code
    return NextResponse.json(currentQRCode);
  } catch (error) {
    console.error('Error generating QR code:', error);
    return NextResponse.json({ error: 'Failed to generate QR code' }, { status: 500 });
  }
}

// POST handler - validates a QR code
export async function POST(request: Request) {
  try {
    const { id, timestamp } = await request.json();

    // Validate request data
    if (!id) {
      return NextResponse.json(
        { valid: false, message: 'Invalid request data. Missing ID.' },
        { status: 400 }
      );
    }

    // Check if the QR code exists and is valid
    if (!currentQRCode) {
      return NextResponse.json(
        { valid: false, message: 'No active QR code found' },
        { status: 400 }
      );
    }

    // Check if the IDs match
    if (currentQRCode.id !== id) {
      return NextResponse.json(
        { valid: false, message: 'Invalid QR code ID' },
        { status: 400 }
      );
    }

    // Check if the QR code has already been used
    if (currentQRCode.isUsed) {
      return NextResponse.json(
        { valid: false, message: 'QR code has already been used' },
        { status: 400 }
      );
    }

    // Check if the QR code has expired (older than 5 minutes)
    const qrTimestamp = currentQRCode.timestamp;
    if (Date.now() - qrTimestamp > 5 * 60 * 1000) {
      return NextResponse.json(
        { valid: false, message: 'QR code has expired' },
        { status: 400 }
      );
    }

    // Mark the QR code as used
    currentQRCode.isUsed = true;

    // Log to Firestore
    try {
      const qrLogsCollection = collection(db, 'ScannedQRCodes');
      await addDoc(qrLogsCollection, {
        qrId: id,
        timestamp: Timestamp.fromMillis(qrTimestamp),
        scannedAt: Timestamp.now(),
      });
    } catch (firestoreError) {
      console.error('Error logging to Firestore:', firestoreError);
      // Continue even if Firestore logging fails
    }

    // Generate a new QR code for next use
    await generateNewQRCode();

    // Return success
    return NextResponse.json({ 
      valid: true, 
      message: 'QR code validated successfully',
      redirectTo: '/quiz' // Add a redirect URL for the client
    });
  } catch (error) {
    console.error('Error validating QR code:', error);
    return NextResponse.json(
      { valid: false, message: 'Error validating QR code' },
      { status: 500 }
    );
  }
}
