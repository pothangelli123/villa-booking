/**
 * Mock API utility to use instead of Supabase
 * For testing purposes until Supabase is properly set up
 */

import fs from 'fs';
import path from 'path';

let villas = [];
let bookings = [];

try {
  // In Next.js, these paths are relative to the project root
  const villasPath = path.join(process.cwd(), 'data', 'villas.json');
  const bookingsPath = path.join(process.cwd(), 'data', 'bookings.json');
  
  if (fs.existsSync(villasPath)) {
    villas = JSON.parse(fs.readFileSync(villasPath, 'utf8'));
  }
  
  if (fs.existsSync(bookingsPath)) {
    bookings = JSON.parse(fs.readFileSync(bookingsPath, 'utf8'));
  }
} catch (error) {
  console.error('Error loading mock data:', error);
}

export const mockApi = {
  villas: {
    getAll: () => Promise.resolve({ data: villas, error: null }),
    getById: (id) => {
      const villa = villas.find(v => v.id === id);
      return Promise.resolve({ 
        data: villa ? [villa] : [], 
        error: villa ? null : { message: 'Villa not found' } 
      });
    }
  },
  bookings: {
    create: (bookingData) => {
      const newBooking = {
        id: Math.random().toString(36).substring(2, 15),
        ...bookingData,
        created_at: new Date().toISOString(),
        status: 'pending'
      };
      
      bookings.push(newBooking);
      
      // In a real app, we would save this to a file
      // But for demo purposes, we'll just keep it in memory
      return Promise.resolve({ data: newBooking, error: null });
    },
    getByEmail: (email) => {
      const userBookings = bookings.filter(b => b.email === email);
      return Promise.resolve({ data: userBookings, error: null });
    }
  }
};

// This is a placeholder for when you have actual Supabase set up
export const getSupabaseClient = () => {
  console.warn('Using mock API instead of Supabase');
  return {
    from: (table) => {
      if (table === 'villas') {
        return {
          select: () => ({
            eq: () => ({
              single: () => mockApi.villas.getById(),
              // Add more methods as needed
            }),
            // Add more methods as needed
          }),
          // Add more methods as needed
        };
      }
      
      // Add more tables as needed
      return {};
    },
    // Add more Supabase methods as needed
  };
};

export default mockApi;
