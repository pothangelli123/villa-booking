import { createClient } from '@supabase/supabase-js';

// Define villa and booking types
export type Villa = {
  id: string;
  name: string;
  description: string;
  short_description: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  images: string[];
  amenities: string[];
  created_at: string;
};

export type Booking = {
  id: string;
  check_in: string;
  check_out: string;
  guests: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  special_requests?: string;
  total_amount: number;
  payment_id: string;
  villa_id: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
};

// Mock data for fallback when Supabase isn't available
let mockVillas: Villa[] = [];
let mockBookings: Booking[] = [];

// Try to initialize Supabase client with environment variables
let supabaseUrl: string | undefined;
let supabaseKey: string | undefined;
let supabaseClient: ReturnType<typeof createClient> | null = null;

// Handle the case when running in the browser where window is defined
if (typeof window !== 'undefined') {
  supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  console.log('Supabase config:', { 
    urlDefined: !!supabaseUrl, 
    keyDefined: !!supabaseKey,
    urlValue: supabaseUrl ? supabaseUrl.substring(0, 8) + '...' : 'undefined',
    keyValue: supabaseKey ? supabaseKey.substring(0, 5) + '...' : 'undefined'
  });
  
  // Load mock data if needed
  try {
    // In Next.js, you can't directly use fs in the browser,
    // so we'll load mock data from an API endpoint if needed
    if (!supabaseUrl || !supabaseKey) {
      console.warn('Missing Supabase credentials, will use mock data');
    } else {
      // Initialize Supabase client if credentials are available
      supabaseClient = createClient(supabaseUrl, supabaseKey);
      console.log('Supabase client initialized successfully');
    }
  } catch (error) {
    console.error('Error initializing Supabase:', error);
  }
}

// Initialize Supabase client if we have valid credentials
if (supabaseUrl && supabaseKey) {
  supabaseClient = createClient(supabaseUrl, supabaseKey);
}

// Utility function to get the Supabase client
export const getSupabaseClient = () => {
  if (!supabaseClient) {
    // Return mock client if actual client isn't available
    return {
      from: (table: string) => {
        return {
          select: (columns: string) => {
            return {
              data: table === 'villas' ? mockVillas : mockBookings,
              error: null,
              
              // Mock supabase query methods
              eq: (column: string, value: any) => {
                let filtered: (Villa | Booking)[] = [];
                if (table === 'villas') {
                  filtered = mockVillas.filter((item: Villa) => item[column as keyof Villa] === value);
                } else if (table === 'bookings') {
                  filtered = mockBookings.filter((item: Booking) => item[column as keyof Booking] === value);
                }
                
                return {
                  data: filtered,
                  error: null,
                  single: () => {
                    return {
                      data: filtered.length > 0 ? filtered[0] : null,
                      error: filtered.length > 0 ? null : { message: 'Not found' }
                    };
                  }
                };
              }
            };
          },
          insert: (data: any) => {
            const newItem = {
              id: `mock-${Date.now()}`,
              created_at: new Date().toISOString(),
              ...data
            };
            
            if (table === 'villas') {
              mockVillas.push(newItem);
            } else if (table === 'bookings') {
              mockBookings.push(newItem);
            }
            
            return {
              data: newItem,
              error: null
            };
          },
          update: (data: any) => {
            return {
              match: ({ id }: { id: string }) => {
                if (table === 'villas') {
                  const index = mockVillas.findIndex((item: any) => item.id === id);
                  if (index !== -1) {
                    mockVillas[index] = { ...mockVillas[index], ...data };
                    return { data: mockVillas[index], error: null };
                  }
                } else if (table === 'bookings') {
                  const index = mockBookings.findIndex((item: any) => item.id === id);
                  if (index !== -1) {
                    mockBookings[index] = { ...mockBookings[index], ...data };
                    return { data: mockBookings[index], error: null };
                  }
                }
                
                return { data: null, error: { message: 'Item not found' } };
              }
            };
          },
          delete: () => {
            return {
              match: ({ id }: { id: string }) => {
                if (table === 'villas') {
                  const index = mockVillas.findIndex((item: any) => item.id === id);
                  if (index !== -1) {
                    const deleted = mockVillas[index];
                    mockVillas.splice(index, 1);
                    return { data: deleted, error: null };
                  }
                } else if (table === 'bookings') {
                  const index = mockBookings.findIndex((item: any) => item.id === id);
                  if (index !== -1) {
                    const deleted = mockBookings[index];
                    mockBookings.splice(index, 1);
                    return { data: deleted, error: null };
                  }
                }
                
                return { data: null, error: { message: 'Item not found' } };
              }
            };
          }
        };
      }
    };
  }
  return supabaseClient;
};

const supabase = getSupabaseClient();
export default supabase;

// Helper function to fetch a villa by ID
export async function getVillaById(id: string): Promise<Villa | null> {
  try {
    if (supabaseClient) {
      // Use type assertion to satisfy TypeScript
      const query = supabase
        .from('villas')
        .select('*') as any;
        
      const { data, error } = await query
        .eq('id', id)
        .single();
        
      if (error) {
        console.error('Error fetching villa:', error);
        return null;
      }
      
      return data as Villa;
    } else {
      // For mock implementation
      const villa = mockVillas.find(v => v.id === id);
      return villa || null;
    }
  } catch (error) {
    console.error('Error fetching villa:', error);
    return null;
  }
}

// Helper function to create a new booking
export async function createBooking(bookingData: Omit<Booking, 'id' | 'created_at'>) {
  try {
    console.log('Submitting booking data to Supabase:', bookingData);
    
    if (supabaseClient) {
      console.log('Using real Supabase client for booking creation');
      
      // Use type assertion to satisfy TypeScript
      const query = supabase
        .from('bookings')
        .insert([
          {
            ...bookingData,
            created_at: new Date().toISOString(),
          },
        ]) as any;
      
      console.log('Prepared insert query for bookings table');
      
      try {
        const { data, error } = await query.select();
        
        if (error) {
          console.error('Supabase error details:', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint
          });
          throw error;
        }

        console.log('Booking created successfully:', data);
        return data[0] as Booking;
      } catch (queryError) {
        console.error('Supabase query execution error:', queryError);
        throw queryError;
      }
    } else {
      // For mock implementation, create a fake ID and return the booking
      console.log('Using mock implementation for booking creation');
      const newBooking = {
        ...bookingData,
        id: `mock-${Date.now()}`,
        created_at: new Date().toISOString()
      } as Booking;
      
      mockBookings.push(newBooking);
      console.log('Mock booking created:', newBooking);
      return newBooking;
    }
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
}

// Helper function to check villa availability
export async function checkVillaAvailability(
  villaId: string,
  checkIn: string,
  checkOut: string
): Promise<boolean> {
  try {
    // For Supabase client
    if (supabaseClient) {
      // Use type assertion to satisfy TypeScript
      const query = supabase
        .from('bookings')
        .select('*') as any;
        
      const { data, error } = await query
        .eq('villa_id', villaId)
        .eq('status', 'confirmed');

      if (error) {
        console.error('Error checking availability:', error);
        return false;
      }

      // If there are no bookings for this villa, it's available
      if (!data || data.length === 0) {
        return true;
      }

      // Check if there are any overlapping bookings
      const bookings = data as Booking[];
      const hasOverlap = bookings.some(booking => {
        const bookingStart = new Date(booking.check_in).getTime();
        const bookingEnd = new Date(booking.check_out).getTime();
        const requestStart = new Date(checkIn).getTime();
        const requestEnd = new Date(checkOut).getTime();

        return (requestStart <= bookingEnd && requestEnd >= bookingStart);
      });

      // If there are no overlapping bookings, the villa is available
      return !hasOverlap;
    } 
    // For mock implementation
    else {
      // Filter bookings manually for the mock implementation
      const confirmedBookings = mockBookings.filter(
        booking => booking.villa_id === villaId && booking.status === 'confirmed'
      );
      
      if (confirmedBookings.length === 0) {
        return true;
      }
      
      // Check for overlapping bookings
      const hasOverlap = confirmedBookings.some(booking => {
        const bookingStart = new Date(booking.check_in).getTime();
        const bookingEnd = new Date(booking.check_out).getTime();
        const requestStart = new Date(checkIn).getTime();
        const requestEnd = new Date(checkOut).getTime();

        return (requestStart <= bookingEnd && requestEnd >= bookingStart);
      });
      
      return !hasOverlap;
    }
  } catch (error) {
    console.error('Error checking availability:', error);
    return false;
  }
}

// Attempt to load mock data from public URL
export const loadMockData = async () => {
  try {
    // In a real app, you would fetch this from an API endpoint
    // For now, we'll just use some hardcoded data
    mockVillas = [
      {
        id: "550e8400-e29b-41d4-a716-446655440000",
        name: "Luxury Beachfront Villa",
        description: "Experience the ultimate luxury getaway at our stunning beachfront villa. Nestled on the pristine shores of a private beach, this exquisite property offers breathtaking ocean views from every angle.",
        short_description: "Stunning beachfront villa with private pool, direct beach access, and breathtaking ocean views.",
        location: "Malibu, California",
        price: 1200.00,
        bedrooms: 5,
        bathrooms: 6,
        max_guests: 12,
        images: [
          "/images/villa-exterior.jpg",
          "/images/villa-interior-1.jpg",
          "/images/villa-interior-2.jpg",
          "/images/villa-bedroom.jpg",
          "/images/villa-bathroom.jpg",
          "/images/villa-pool.jpg",
          "/images/villa-beach.jpg",
          "/images/villa-dining.jpg"
        ],
        amenities: [
          "Private Pool",
          "Direct Beach Access",
          "Ocean View",
          "Fully Equipped Kitchen",
          "Air Conditioning",
          "Free WiFi",
          "Smart TV",
          "Outdoor Dining Area",
          "BBQ Grill",
          "Parking",
          "Gym",
          "Home Theater",
          "Laundry Facilities",
          "24/7 Security",
          "Concierge Service"
        ],
        created_at: new Date().toISOString()
      }
    ];
    
    mockBookings = [];
    
    console.log('Mock data loaded successfully');
  } catch (error) {
    console.error('Error loading mock data:', error);
  }
};

// Load mock data on initialization
if (typeof window !== 'undefined' && (!supabaseUrl || !supabaseKey)) {
  loadMockData();
}

// Helper function to test Supabase connection
export async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    if (supabaseClient) {
      // Use actual Supabase client
      const { data, error } = await supabaseClient
        .from('villas')
        .select('id, name')
        .limit(1);
        
      if (error) {
        console.error('Supabase connection test failed:', error);
        return { success: false, error: error.message };
      }
      
      console.log('Supabase connection successful:', data);
      return { success: true, data };
    } else {
      // Using mock implementation
      console.warn('Supabase client not initialized, using mock data');
      return { success: false, error: 'Supabase client not initialized' };
    }
  } catch (error) {
    console.error('Error testing Supabase connection:', error);
    return { success: false, error: String(error) };
  }
} 