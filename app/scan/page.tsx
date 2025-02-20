'use client';

import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function ScanPage() {
    const [scanResult, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        // Create scanner instance
        const scanner = new Html5QrcodeScanner(
            "qr-reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            /* verbose= */ false
        );

        const handleScanError = (error: Error | string) => {
            console.error(error);
        };

        const handleScanSuccess = async (decodedText: string) => {
            if (isProcessing) return;

            setIsProcessing(true);
            scanner.pause(true);

            try {
                let qrData;
                try {
                    qrData = JSON.parse(decodedText);
                } catch {
                    throw new Error('Invalid QR code format');
                }

                const response = await fetch('/api/qr', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(qrData),
                });

                const data = await response.json();

                if (data.success) {
                    setResult('QR code validated successfully! Redirecting to user page...');
                    setTimeout(() => {
                        window.location.href = '/user';
                    }, 2000);
                } else {
                    setError(data.error || 'Invalid QR code');
                    scanner.resume();
                }
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred');
                }
                scanner.resume();
            } finally {
                setIsProcessing(false);
            }
        };

        // Start QR scanner
        scanner.render(handleScanSuccess, handleScanError);

        // Cleanup function to remove scanner instance
        return () => {
            scanner.clear();
        };
    }, [isProcessing]);

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Scan QR Code</h1>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                            <p>{error}</p>
                        </div>
                    )}

                    {scanResult && (
                        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                            <p>{scanResult}</p>
                        </div>
                    )}

                    <div id="qr-reader" className="mx-auto"></div>

                    <p className="text-sm text-gray-500 mt-4">
                        Position the QR code within the frame to scan
                    </p>
                </div>
            </div>
        </div>
    );
}
