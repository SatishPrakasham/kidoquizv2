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
                    setMessage('QR code validated successfully! Redirecting to quiz...');
                    setTimeout(() => {
                        window.location.href = '/quiz';
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
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                <div className="text-center">
                    {status === 'validating' && (
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    )}
                    {status === 'success' && (
                        <div className="text-green-500 text-6xl mb-4">✓</div>
                    )}
                    {status === 'error' && (
                        <div className="text-red-500 text-6xl mb-4">✗</div>
                    )}
                    <h2 className={`text-2xl font-semibold mb-4 ${
                        status === 'success' ? 'text-green-500' :
                        status === 'error' ? 'text-red-500' :
                        'text-gray-900'
                    }`}>
                        {status === 'validating' ? 'Validating' :
                         status === 'success' ? 'Success!' :
                         'Error'}
                    </h2>
                    <p className="text-gray-600">{message}</p>
                </div>
            </div>
        </div>
    );
}

function ValidatePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ValidatePageContent />
        </Suspense>
    );
}

export default ValidatePage;
