import React, { useState } from 'react';
import { createBooking, testSupabaseConnection } from '../utils/supabase';

interface BookingFormProps {
  villaId?: string;
}

const BookingForm: React.FC<BookingFormProps> = ({ villaId = 'default-villa-id' }) => {
  // Form state
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    check_in: '',
    check_out: '',
    guests: 1,
    special_requests: '',
  });
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<{
    tested: boolean;
    success: boolean;
    message: string;
  }>({
    tested: false,
    success: false,
    message: '',
  });
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Test Supabase connection
  const handleTestConnection = async () => {
    try {
      const result = await testSupabaseConnection();
      setConnectionStatus({
        tested: true,
        success: result.success,
        message: result.success 
          ? `Connection successful! Found ${result.data?.length} villa(s).` 
          : `Connection failed: ${result.error}`,
      });
    } catch (err) {
      setConnectionStatus({
        tested: true,
        success: false,
        message: `Error testing connection: ${err instanceof Error ? err.message : String(err)}`,
      });
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      console.log("1. Form submitted, preparing data...");
      
      const bookingData = {
        ...formData,
        villa_id: villaId,
        total_amount: 100000, // This would normally be calculated based on dates and villa price
        status: 'pending' as const,
        payment_id: `pid-${Date.now()}`, // Generate a temporary payment ID
      };
      
      console.log("2. Submitting data to Supabase:", bookingData);
      
      // Submit to Supabase
      const result = await createBooking(bookingData);
      
      console.log("3. Supabase response:", result);
      
      // Show success message
      setSuccess(true);
      setLoading(false);
      
      // Reset form
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        check_in: '',
        check_out: '',
        guests: 1,
        special_requests: '',
      });
    } catch (err) {
      console.error("Error in form submission:", err);
      
      // Better error handling for Supabase errors
      let errorMessage = "An unknown error occurred";
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (err && typeof err === 'object') {
        // For Supabase error objects
        if ('message' in err && typeof err.message === 'string') {
          errorMessage = err.message;
        } else if ('error' in err && typeof err.error === 'string') {
          errorMessage = err.error;
        } else if ('details' in err && typeof err.details === 'string') {
          errorMessage = err.details;
        }
      }
      
      setError(`Error submitting booking: ${errorMessage}`);
      setLoading(false);
    }
  };
  
  return (
    <div className="booking-form-container bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-center mb-6">Book Your Stay</h2>
      
      {/* Connection Test Button - For development/debugging */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <button 
            type="button" 
            onClick={handleTestConnection}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
          >
            Test Supabase Connection
          </button>
          
          {connectionStatus.tested && (
            <div className={`text-sm ${connectionStatus.success ? 'text-green-600' : 'text-red-600'}`}>
              {connectionStatus.message}
            </div>
          )}
        </div>
        <div className="mt-2 text-xs text-gray-500">
          This button is for testing purposes. You can remove it in production.
        </div>
      </div>
      
      {success && (
        <div className="success-message bg-green-50 text-green-800 p-4 rounded-lg mb-6">
          <h3 className="font-bold text-lg">Booking Submitted Successfully!</h3>
          <p>Thank you for your booking. We'll contact you shortly to confirm your reservation.</p>
        </div>
      )}
      
      {error && (
        <div className="error-message bg-red-50 text-red-800 p-4 rounded-lg mb-6">
          <h3 className="font-bold">Error</h3>
          <p>{error}</p>
        </div>
      )}
      
      {!success && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="first_name">First Name</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="last_name">Last Name</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="check_in">Check-in Date</label>
              <input
                type="date"
                id="check_in"
                name="check_in"
                value={formData.check_in}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="check_out">Check-out Date</label>
              <input
                type="date"
                id="check_out"
                name="check_out"
                value={formData.check_out}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="guests">Number of Guests</label>
              <select
                id="guests"
                name="guests"
                value={formData.guests}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded"
                required
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="special_requests">Special Requests</label>
            <textarea
              id="special_requests"
              name="special_requests"
              value={formData.special_requests}
              onChange={handleChange}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded"
            ></textarea>
          </div>
          
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded hover:bg-blue-700 transition disabled:bg-blue-300"
            >
              {loading ? 'Submitting...' : 'Book Now'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default BookingForm; 