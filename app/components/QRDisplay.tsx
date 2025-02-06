'use client';

import { useEffect, useState } from 'react';

export default function QRDisplay() {
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchQRCode = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch('/api/qr');
            const data = await response.json();

            if (data.success) {
                setQrCode(data.data.qrImageData);
            } else {
                setError(data.error || 'Failed to generate QR code');
            }
        } catch (err) {
            setError('Failed to fetch QR code');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQRCode();
        const interval = setInterval(fetchQRCode, 30000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="mb-4 text-gray-600">
                <p>Loading QR Code...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                <p>{error}</p>
            </div>
        );
    }

    if (!qrCode) {
        return null;
    }

    return (
        <div className="mb-4">
            <div className="relative w-64 h-64 mx-auto border-2 border-gray-200 rounded-lg p-2 bg-white shadow-sm">
                <img
                    src={qrCode}
                    alt="QR Code"
                    className="w-full h-full"
                />
            </div>
            <p className="text-sm text-gray-600 mt-4 font-medium">
                Scan this QR code to start the quiz
            </p>
            <p className="text-xs text-gray-500 mt-2">
                This QR code will be valid until scanned
            </p>
            <p className="text-xs text-gray-400">
                Auto-refreshing every 30 seconds
            </p>
        </div>
    );
}
