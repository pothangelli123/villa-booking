import React, { useState } from 'react';
import { Booking } from '../utils/supabase';

interface BookingFormProps {
  villaId?: string;
  villaPrice?: number;
}

// Initial form data
const initialFormData = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  check_in: '',
  check_out: '',
  guests: 1,
  special_requests: '',
};

const BookingForm: React.FC<BookingFormProps> = ({ 
  villaId = 'default-villa-id',
  villaPrice = 1200 // Default price per night
}) => {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [bookingReference, setBookingReference] = useState<string | null>(null);
  
  // Calculate number of nights and total price
  const calculateTotalAmount = () => {
    if (!formData.check_in || !formData.check_out) return 0;
    
    const checkIn = new Date(formData.check_in);
    const checkOut = new Date(formData.check_out);
    
    // Calculate number of nights
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    // Return total amount
    return nights * villaPrice;
  };
  
  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      console.log("1. Form submitted, preparing data...");
      
      // Calculate total amount based on dates
      const totalAmount = calculateTotalAmount();
      if (totalAmount <= 0) {
        throw new Error("Invalid dates selected. Please choose valid check-in and check-out dates.");
      }
      
      const bookingData = {
        ...formData,
        villa_id: villaId,
        total_amount: totalAmount,
      };
      
      console.log("2. Submitting booking data to API:", bookingData);
      
      // Submit to booking API endpoint which handles payment and booking creation
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create booking');
      }
      
      console.log("3. API response:", result);
      
      // Show success message and booking reference
      setSuccess(true);
      setBookingReference(result.booking.id || result.payment.id);
      setLoading(false);
      
      // Reset form
      setFormData(initialFormData);
    } catch (err) {
      console.error("Error in form submission:", err);
      
      // Better error handling
      let errorMessage = "An unknown error occurred";
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (err && typeof err === 'object') {
        if ('message' in err && typeof (err as any).message === 'string') {
          errorMessage = (err as any).message;
        }
      }
      
      setError(`Error submitting booking: ${errorMessage}`);
      setLoading(false);
    }
  };
  
  if (success) {
    return (
      <div className="bg-green-50 p-6 rounded-lg border border-green-200">
        <h3 className="text-xl font-semibold text-green-800 mb-2">Booking Confirmed!</h3>
        <p className="text-green-700 mb-4">
          Thank you for your booking. Your reservation has been confirmed.
        </p>
        {bookingReference && (
          <p className="text-green-700 font-semibold">
            Booking Reference: {bookingReference}
          </p>
        )}
        <p className="mt-4 text-sm text-green-600">
          A confirmation email has been sent to {formData.email}.
        </p>
        <button
          className="mt-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          onClick={() => {
            setSuccess(false);
            window.scrollTo(0, 0);
          }}
        >
          Book Another Stay
        </button>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-lg">
          <p className="font-semibold">Error</p>
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="first_name">
              First Name *
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="last_name">
              Last Name *
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="phone">
              Phone *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="check_in">
              Check-in Date *
            </label>
            <input
              type="date"
              id="check_in"
              name="check_in"
              value={formData.check_in}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="check_out">
              Check-out Date *
            </label>
            <input
              type="date"
              id="check_out"
              name="check_out"
              value={formData.check_out}
              onChange={handleChange}
              required
              min={formData.check_in || new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2" htmlFor="guests">
            Number of Guests *
          </label>
          <select
            id="guests"
            name="guests"
            value={formData.guests}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'Guest' : 'Guests'}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2" htmlFor="special_requests">
            Special Requests
          </label>
          <textarea
            id="special_requests"
            name="special_requests"
            value={formData.special_requests}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
        
        {/* Booking Summary */}
        {formData.check_in && formData.check_out && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Booking Summary</h3>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Check-in:</span> {new Date(formData.check_in).toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium">Check-out:</span> {new Date(formData.check_out).toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium">Guests:</span> {formData.guests}
              </p>
              <p className="text-lg font-bold pt-2 border-t border-gray-200 mt-2">
                Total: ${calculateTotalAmount().toLocaleString()}
              </p>
            </div>
          </div>
        )}
        
        <div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-6 text-white font-semibold rounded transition ${
              loading 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Processing...' : 'Book Now'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm; 