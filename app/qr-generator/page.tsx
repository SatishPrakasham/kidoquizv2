'use client';
import React from 'react';
import QRDisplay from '../components/QRDisplay';

export default function QRGeneratorPage(): React.JSX.Element {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">KidoQuiz</h1>
                    <h2 className="text-xl font-semibold text-gray-700 mb-6"> Quiz QR Code</h2>
                    <QRDisplay />
                </div>
            </div>
        </div>
    );
}
