'use client';

export default function UserPage() {
    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Welcome!</h1>
                    
                    <div className="space-y-4">
                        <button
                            onClick={() => window.location.href = '/user/new'}
                            className="w-full bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600"
                        >
                            I am a New User
                        </button>
                        
                        <button
                            onClick={() => window.location.href = '/user/existing'}
                            className="w-full bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600"
                        >
                            I am an Existing User
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
