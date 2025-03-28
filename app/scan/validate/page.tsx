'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function ValidatePageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<'validating' | 'success' | 'error'>('validating');
    const [message, setMessage] = useState('Validating QR code...');

    useEffect(() => {
        const validateQR = async () => {
            try {
                const id = searchParams.get('id');
                const timestamp = searchParams.get('timestamp');

                if (!id) {
                    throw new Error('Invalid QR code: Missing ID');
                }

                console.log('Validating QR code:', { id, timestamp });

                const response = await fetch('/api/qr', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        id, 
                        timestamp: timestamp ? parseInt(timestamp, 10) : undefined 
                    }),
                });

                const data = await response.json();

                if (data.valid) {
                    setStatus('success');
                    setMessage('QR code validated successfully! Redirecting to quiz...');
                    
                    // Use the redirect URL from the API response or default to /quiz
                    setTimeout(() => {
                        if (data.redirectTo) {
                            router.push(data.redirectTo);
                        } else {
                            router.push('/quiz');
                        }
                    }, 1500);
                } else {
                    throw new Error(data.message || 'Failed to validate QR code');
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
    }, [searchParams, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100 p-4">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-md w-full">
                <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                
                <div className="p-8">
                    <div className="flex flex-col items-center justify-center text-center">
                        {status === 'validating' && (
                            <>
                                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Validating QR Code</h2>
                                <p className="text-gray-600">Please wait while we process your request...</p>
                            </>
                        )}

                        {status === 'success' && (
                            <>
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Success!</h2>
                                <p className="text-gray-600">{message}</p>
                            </>
                        )}

                        {status === 'error' && (
                            <>
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
                                <p className="text-gray-600">{message}</p>
                                <button 
                                    onClick={() => router.push('/')}
                                    className="mt-6 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                                >
                                    Return Home
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ValidatePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <ValidatePageContent />
        </Suspense>
    );
}

export default ValidatePage;
