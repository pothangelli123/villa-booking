import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { testSupabaseConnection, createBooking } from '../utils/supabase';

export default function DebugSupabasePage() {
  const [connectionStatus, setConnectionStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [testBookingResult, setTestBookingResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await testSupabaseConnection();
      setConnectionStatus(result);
      console.log('Connection test result:', result);
    } catch (err) {
      console.error('Error testing connection:', err);
      setError(`Connection test error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const testBookingCreation = async () => {
    setLoading(true);
    setError(null);
    try {
      // Test booking data
      const testData = {
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        phone: '123-456-7890',
        check_in: '2023-12-01',
        check_out: '2023-12-05',
        guests: 2,
        special_requests: 'This is a test booking',
        villa_id: 'test-villa-id',
        total_amount: 1000,
        payment_id: `test-pid-${Date.now()}`,
        status: 'pending' as const
      };

      const result = await createBooking(testData);
      setTestBookingResult(result);
      console.log('Test booking result:', result);
    } catch (err) {
      console.error('Error creating test booking:', err);
      
      // Detailed error reporting
      let errorMessage = "Unknown error";
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (err && typeof err === 'object') {
        try {
          errorMessage = JSON.stringify(err, null, 2);
        } catch {
          errorMessage = Object.keys(err as object).join(', ');
        }
      }
      
      setError(`Booking creation error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Debug Supabase Connection</title>
        <meta name="description" content="Debug page for Supabase connection" />
      </Head>

      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Luxury Villa
          </Link>
          <nav className="flex gap-4">
            <Link href="/" className="text-gray-600 hover:text-blue-600">
              Home
            </Link>
            <Link href="/booking" className="text-gray-600 hover:text-blue-600">
              Booking
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-center mb-8">Supabase Debug Page</h1>
          
          <div className="space-y-8">
            {/* Connection Test Section */}
            <div className="p-6 border border-gray-200 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Test Supabase Connection</h2>
              <button
                onClick={testConnection}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded hover:bg-blue-700 transition disabled:bg-blue-300"
              >
                {loading ? 'Testing...' : 'Test Connection'}
              </button>
              
              {connectionStatus && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium">Connection Status:</h3>
                  <pre className="mt-2 p-3 bg-gray-100 rounded text-sm overflow-auto">
                    {JSON.stringify(connectionStatus, null, 2)}
                  </pre>
                </div>
              )}
            </div>
            
            {/* Test Booking Creation */}
            <div className="p-6 border border-gray-200 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Test Booking Creation</h2>
              <button
                onClick={testBookingCreation}
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 px-6 rounded hover:bg-green-700 transition disabled:bg-green-300"
              >
                {loading ? 'Creating...' : 'Create Test Booking'}
              </button>
              
              {testBookingResult && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium">Booking Result:</h3>
                  <pre className="mt-2 p-3 bg-gray-100 rounded text-sm overflow-auto">
                    {JSON.stringify(testBookingResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>
            
            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-50 text-red-800 rounded-lg">
                <h3 className="font-bold">Error</h3>
                <pre className="mt-2 whitespace-pre-wrap">{error}</pre>
              </div>
            )}
            
            {/* Environment Variables */}
            <div className="p-6 border border-gray-200 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
              <div className="space-y-2">
                <p>
                  <strong>NEXT_PUBLIC_SUPABASE_URL:</strong>{' '}
                  {process.env.NEXT_PUBLIC_SUPABASE_URL 
                    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 8)}...` 
                    : 'Not defined'}
                </p>
                <p>
                  <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong>{' '}
                  {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
                    ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 5)}...` 
                    : 'Not defined'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 