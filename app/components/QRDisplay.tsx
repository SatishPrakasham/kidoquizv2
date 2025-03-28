"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { RefreshCw } from "lucide-react";

export default function QRDisplay() {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchQRCode = async () => {
    try {
      setLoading(true);
      setRefreshing(true);
      setError(null);
      const response = await fetch("/api/qr");
      const data = await response.json();

      if (data.error) {
        setError(data.error || "Failed to generate QR code");
      } else {
        // The API now returns the QR code data directly
        setQrCode(data.qrImageData);
        setCurrentId(data.id);
      }
    } catch (err) {
      console.error("QR Code error:", err);
      setError("Unable to load QR code. Please try again.");
    } finally {
      setLoading(false);
      setTimeout(() => setRefreshing(false), 500);
    }
  };

  useEffect(() => {
    fetchQRCode();
  }, []);

  useEffect(() => {
    const checkInterval = setInterval(async () => {
      try {
        const res = await fetch("/api/qr");
        const data = await res.json();

        // Check if the QR code has changed
        if (data?.id && data.id !== currentId) {
          setQrCode(data.qrImageData);
          setCurrentId(data.id);
        }
      } catch (error) {
        console.error("Error checking for QR updates:", error);
      }
    }, 3000);

    return () => clearInterval(checkInterval);
  }, [currentId]);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">Join the Quiz</h2>

      {loading && !qrCode ? (
        <div className="flex flex-col items-center justify-center h-64 w-64 bg-white rounded-lg border-2 border-indigo-200 p-4">
          <div className="animate-spin h-12 w-12 mb-4">
            <RefreshCw className="h-12 w-12 text-indigo-500" />
          </div>
          <p className="text-indigo-600 font-medium">Preparing your quiz...</p>
        </div>
      ) : error ? (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 w-full max-w-xs">
          <p className="font-medium">{error}</p>
          <button
            onClick={fetchQRCode}
            className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md text-sm transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : (
        qrCode && (
          <div className="relative">
            <div
              className={`relative w-64 h-64 mx-auto border-2 border-indigo-300 rounded-lg p-3 bg-white shadow-md ${refreshing ? "opacity-70" : "opacity-100"} transition-opacity duration-300`}
            >
              {refreshing && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-60 z-10 rounded-lg">
                  <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
                </div>
              )}
              <Image
                src={qrCode || "/placeholder.svg"}
                alt="QR Code"
                width={256}
                height={256}
                className="w-full h-full"
              />
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-3 -right-3 h-8 w-8 bg-purple-500 rounded-full shadow-md"></div>
            <div className="absolute -bottom-3 -left-3 h-8 w-8 bg-indigo-500 rounded-full shadow-md"></div>
          </div>
        )
      )}

      <div className="mt-6 text-center">
        <p className="text-sm font-semibold text-indigo-700 mb-2">Scan this QR code to start the quiz</p>
        <div className="flex items-center justify-center space-x-1 text-xs text-indigo-500">
          <RefreshCw className="h-3 w-3" />
          <p>QR updates when scanned</p>
        </div>
        <p className="text-xs text-indigo-400 mt-1">This QR code will be valid until scanned</p>
      </div>

      <div className="mt-6">
        <button
          onClick={fetchQRCode}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh QR Code
            </>
          )}
        </button>
      </div>
    </div>
  );
}
