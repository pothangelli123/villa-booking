import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { testSupabaseConnection } from '../utils/supabase';
import supabase from '../utils/supabase';

export default function DebugSupabasePage() {
  const [connectionStatus, setConnectionStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [testBookingResult, setTestBookingResult] = useState<any>(null);
  const [testPaymentResult, setTestPaymentResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [tables, setTables] = useState<any[]>([]);

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

  const listTables = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use the API route to list tables
      const response = await fetch('/api/list-tables', { method: 'GET' });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to list tables');
      }
      
      const result = await response.json();
      console.log('Tables result:', result);
      
      if (result.tables) {
        setTables(result.tables);
      }
    } catch (err) {
      console.error('Error listing tables:', err);
      setError(`Error listing tables: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const createTestTable = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use API route to create the table
      const response = await fetch('/api/create-table', { method: 'POST' });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create table');
      }
      
      const result = await response.json();
      console.log('Table creation result:', result);
      
      // Refresh table list
      await listTables();
    } catch (err) {
      console.error('Error creating test table:', err);
      setError(`Error creating table: ${err instanceof Error ? err.message : String(err)}`);
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
        check_in: new Date().toISOString().split('T')[0], // Today
        check_out: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days later
        guests: 2,
        special_requests: 'This is a test booking',
        villa_id: 'test-villa-id',
        total_amount: 1000,
      };

      // Use the API route for the integrated booking + payment flow
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create booking');
      }

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

  const testPaymentProcessing = async () => {
    setLoading(true);
    setError(null);
    try {
      // Call the payment API directly
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: 1500 }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to process payment');
      }

      setTestPaymentResult(result);
      console.log('Test payment result:', result);
    } catch (err) {
      console.error('Error processing test payment:', err);
      
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
      
      setError(`Payment processing error: ${errorMessage}`);
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
            
            {/* Database Tables Section */}
            <div className="p-6 border border-gray-200 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Database Tables</h2>
              <div className="flex gap-3 mb-4">
                <button
                  onClick={listTables}
                  disabled={loading}
                  className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded hover:bg-indigo-700 transition disabled:bg-indigo-300"
                >
                  {loading ? 'Loading...' : 'List Tables'}
                </button>
                <button
                  onClick={createTestTable}
                  disabled={loading}
                  className="flex-1 bg-teal-600 text-white py-3 px-6 rounded hover:bg-teal-700 transition disabled:bg-teal-300"
                >
                  {loading ? 'Creating...' : 'Create Bookings Table'}
                </button>
              </div>
              
              {tables.length > 0 && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium">Tables in Database:</h3>
                  <ul className="mt-2 p-3 bg-gray-100 rounded text-sm overflow-auto">
                    {tables.map((table, index) => (
                      <li key={index} className="mb-1">
                        {typeof table === 'string' ? table : (table.table_name || JSON.stringify(table))}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {/* Test Payment Processing */}
            <div className="p-6 border border-gray-200 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Test Payment Processing</h2>
              <button
                onClick={testPaymentProcessing}
                disabled={loading}
                className="w-full bg-purple-600 text-white py-3 px-6 rounded hover:bg-purple-700 transition disabled:bg-purple-300"
              >
                {loading ? 'Processing...' : 'Process Test Payment'}
              </button>
              
              {testPaymentResult && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium">Payment Result:</h3>
                  <pre className="mt-2 p-3 bg-gray-100 rounded text-sm overflow-auto">
                    {JSON.stringify(testPaymentResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>
            
            {/* Test Booking Creation */}
            <div className="p-6 border border-gray-200 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Test Integrated Booking Process</h2>
              <p className="mb-4 text-gray-600">This will test the complete flow: payment processing + booking creation in Supabase</p>
              <button
                onClick={testBookingCreation}
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 px-6 rounded hover:bg-green-700 transition disabled:bg-green-300"
              >
                {loading ? 'Creating...' : 'Test Complete Booking Process'}
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