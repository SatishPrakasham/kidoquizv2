import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

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
    isUsed: false,
  };

  const urlParams = new URLSearchParams({
    id: qrData.id,
    timestamp: qrData.timestamp.toString(),
  });

  const qrUrl = `${PRODUCTION_URL}/scan/validate?${urlParams.toString()}`;
  const qrImageData = await QRCode.toDataURL(qrUrl);

  currentQRCode = { ...qrData, qrImageData };
  return currentQRCode;
}

// GET endpoint: Returns the latest valid QR code
export async function GET() {
  try {
    if (!currentQRCode || currentQRCode.isUsed) {
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
    console.error('🚨 GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch QR code' },
      { status: 500 }
    );
  }
}

// POST endpoint: Marks QR code as used and logs it to Firestore
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
        { success: false, error: 'QR code already used' },
        { status: 400 }
      );
    }

    currentQRCode.isUsed = true;

    // Save to Firebase
    await addDoc(collection(db, 'ScannedQRCodes'), {
      id: currentQRCode.id,
      timestamp: currentQRCode.timestamp,
      scannedAt: Date.now(),
    });

    // Generate new one for next request
    const newQRCode = await generateNewQRCode();

    return NextResponse.json({
      success: true,
      message: 'QR code validated and saved to Firestore',
      newQRCode: {
        id: newQRCode.id,
        qrImageData: newQRCode.qrImageData,
        timestamp: newQRCode.timestamp,
      },
    });
  } catch (error) {
    console.error('🚨 POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process QR code' },
      { status: 500 }
    );
  }
}
