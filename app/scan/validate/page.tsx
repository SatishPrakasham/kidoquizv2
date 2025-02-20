'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function ValidatePageContent() {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'validating' | 'success' | 'error'>('validating');
    const [message, setMessage] = useState('Validating QR code...');

    useEffect(() => {
        const validateQR = async () => {
            try {
                const id = searchParams.get('id');
                const timestamp = searchParams.get('timestamp');

                if (!id || !timestamp) {
                    throw new Error('Invalid QR code data');
                }

                console.log('Validating QR code:', { id, timestamp });

                const response = await fetch('/api/qr', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id, timestamp: parseInt(timestamp, 10) }),
                });

                const data: { success?: boolean; error?: string } = await response.json();

                if (data.success) {
                    setStatus('success');
                    setMessage('QR code validated successfully! Redirecting...');
                    setTimeout(() => {
                        window.location.href = '/user';
                    }, 1500);
                } else {
                    throw new Error(data.error || 'Failed to validate QR code');
                }
            } catch (err) {
                console.error('Validation error:', err);

                if (err instanceof Error) {
                    setMessage(err.message);
                } else {
                    setMessage('Failed to validate QR code');
                }

                setStatus('error');
            }
        };

        validateQR();
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">QR Code Validation</h1>
                    <div className={`p-4 rounded-lg ${
                        status === 'validating' ? 'bg-blue-100 text-blue-700' :
                        status === 'success' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                    }`}>
                        <p>{message}</p>
                    </div>
                    {status === 'error' && (
                        <button
                            onClick={() => window.location.href = '/scan'}
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Try Again
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// ✅ Wrap inside `<Suspense>` to fix the error
export default function ValidatePage() {
    return (
        <Suspense fallback={<div>Loading QR Validation...</div>}>
            <ValidatePageContent />
        </Suspense>
    );
}
