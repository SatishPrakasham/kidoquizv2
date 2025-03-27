import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
import { db } from '../../../lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const PRODUCTION_URL = 'https://kidoquizv2-production.up.railway.app';

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

  // Generate QR code image
  const qrUrl = `${PRODUCTION_URL}/scan/validate?id=${qrData.id}&timestamp=${qrData.timestamp}`;
  const qrImageData = await QRCode.toDataURL(qrUrl);

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

    return NextResponse.json(currentQRCode);
  } catch (error) {
    console.error('Error generating QR code:', error);
    return NextResponse.json({ error: 'Failed to generate QR code' }, { status: 500 });
  }
}

// POST endpoint: Marks QR code as used and logs it to Firestore
export async function POST(request: Request) {
  try {
    const { id, timestamp } = await request.json();

    // Validate request data
    if (!id || !timestamp) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    // Check if QR code exists and matches
    if (!currentQRCode || currentQRCode.id !== id || currentQRCode.timestamp !== timestamp) {
      return NextResponse.json(
        { error: 'Invalid QR code' },
        { status: 400 }
      );
    }

    // Check if QR code is already used
    if (currentQRCode.isUsed) {
      return NextResponse.json(
        { error: 'QR code already used' },
        { status: 400 }
      );
    }

    // Check if QR code is expired (5 minutes)
    const isExpired = Date.now() - timestamp > 5 * 60 * 1000;
    if (isExpired) {
      return NextResponse.json(
        { error: 'QR code expired' },
        { status: 400 }
      );
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error validating QR code:', error);
    return NextResponse.json(
      { error: 'Failed to validate QR code' },
      { status: 500 }
    );
  }
}
