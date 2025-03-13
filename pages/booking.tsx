import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

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
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-center mb-8">Book Your Stay</h1>
          
          <p className="text-center text-lg mb-8">
            This is a simple booking form for demonstration purposes.
          </p>
          
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="checkIn">Check-in Date</label>
                <input
                  type="date"
                  id="checkIn"
                  className="w-full p-3 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="checkOut">Check-out Date</label>
                <input
                  type="date"
                  id="checkOut"
                  className="w-full p-3 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="guests">Number of Guests</label>
                <select
                  id="guests"
                  className="w-full p-3 border border-gray-300 rounded"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  className="w-full p-3 border border-gray-300 rounded"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  className="w-full p-3 border border-gray-300 rounded"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full p-3 border border-gray-300 rounded"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="requests">Special Requests</label>
              <textarea
                id="requests"
                rows={4}
                className="w-full p-3 border border-gray-300 rounded"
                placeholder="Any special requests or requirements..."
              ></textarea>
            </div>
            
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded hover:bg-blue-700 transition"
              >
                Book Now
              </button>
            </div>
          </form>
          
          <div className="mt-8 text-center text-gray-600">
            <p>This is a demo booking form. No actual reservations will be made.</p>
          </div>
        </div>
      </main>
    </div>
  );
} 