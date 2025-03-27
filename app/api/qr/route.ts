import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
import { db } from '../../../lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

// Get the app URL from environment variables
const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

if (!APP_URL) {
  throw new Error('NEXT_PUBLIC_APP_URL environment variable is not set');
}

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

  // Generate QR code image using environment URL
  const qrUrl = new URL('/scan/validate', APP_URL);
  qrUrl.searchParams.set('id', qrData.id);
  qrUrl.searchParams.set('timestamp', qrData.timestamp.toString());
  
  const qrImageData = await QRCode.toDataURL(qrUrl.toString());

  currentQRCode = {
    ...qrData,
    isUsed: false,
    qrImageData,
  };

  return currentQRCode;
}

// GET endpoint: Returns the latest valid QR code
export async function GET() {
  try {
    // If no QR code exists or current one is used, generate new one
    if (!currentQRCode || currentQRCode.isUsed) {
      currentQRCode = await generateNewQRCode();
    }

    // Check if QR code is expired (5 minutes)
    const isExpired = Date.now() - currentQRCode.timestamp > 5 * 60 * 1000;
    if (isExpired) {
      currentQRCode = await generateNewQRCode();
    }

    return NextResponse.json({
      success: true,
      data: currentQRCode,
    });

  } catch (error) {
    console.error('Error generating QR code:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to generate QR code'
    }, { status: 500 });
  }
}

// POST endpoint: Marks QR code as used and logs it to Firestore
export async function POST(request: Request) {
  try {
    const { id, timestamp } = await request.json();

    // Validate request data
    if (!id || !timestamp) {
      return NextResponse.json({ 
        success: false,
        error: 'Invalid request data'
      }, { status: 400 });
    }

    // Check if QR code exists and matches
    if (!currentQRCode || currentQRCode.id !== id || currentQRCode.timestamp !== timestamp) {
      return NextResponse.json({ 
        success: false,
        error: 'Invalid QR code'
      }, { status: 400 });
    }

    // Check if QR code is already used
    if (currentQRCode.isUsed) {
      return NextResponse.json({ 
        success: false,
        error: 'QR code already used'
      }, { status: 400 });
    }

    // Check if QR code is expired (5 minutes)
    const isExpired = Date.now() - timestamp > 5 * 60 * 1000;
    if (isExpired) {
      return NextResponse.json({ 
        success: false,
        error: 'QR code expired'
      }, { status: 400 });
    }

    // Mark QR code as used
    currentQRCode.isUsed = true;

    // Log to Firestore
    const qrLogsCollection = collection(db, 'qr_logs');
    await addDoc(qrLogsCollection, {
      qrId: id,
      timestamp: Timestamp.fromMillis(timestamp),
      usedAt: Timestamp.now(),
    });

    // Generate new QR code for next use
    const newQRCode = await generateNewQRCode();

    return NextResponse.json({
      success: true,
      data: {
        message: 'QR code validated successfully',
        newQRCode,
      }
    });

  } catch (error) {
    console.error('Error validating QR code:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to validate QR code'
    }, { status: 500 });
  }
}
