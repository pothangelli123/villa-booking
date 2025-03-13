import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import BookingForm from '../components/BookingForm';

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Book Your Stay - Luxury Villa</title>
        <meta name="description" content="Book your stay at our luxury villa with direct booking benefits." />
      </Head>

      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Luxury Villa
          </Link>
          <nav>
            <Link href="/" className="text-gray-600 hover:text-blue-600 ml-6">
              Home
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Book Your Stay</h1>
          
          <p className="text-center text-lg mb-8">
            Fill out the form below to book your stay at our luxury villa.
          </p>
          
          <BookingForm />
          
          <div className="mt-8 text-center text-gray-600">
            <p>Your booking information will be securely stored in our database.</p>
          </div>
        </div>
      </main>
    </div>
  );
} 