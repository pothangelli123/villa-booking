import { createClient } from '@supabase/supabase-js';

// Mock data for fallback when Supabase isn't available
let mockVillas = [];
let mockBookings = [];

// Try to initialize Supabase client with environment variables
let supabaseUrl: string | undefined;
let supabaseKey: string | undefined;
let supabaseClient: any = null;

// Handle the case when running in the browser where window is defined
if (typeof window !== 'undefined') {
  supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // Load mock data if needed
  try {
    // In Next.js, you can't directly use fs in the browser,
    // so we'll load mock data from an API endpoint if needed
    if (!supabaseUrl || !supabaseKey) {
      console.warn('Missing Supabase credentials, will use mock data');
    } else {
      // Initialize Supabase client if credentials are available
      supabaseClient = createClient(supabaseUrl, supabaseKey);
    }
  } catch (error) {
    console.error('Error initializing Supabase:', error);
  }
}

// Function to get the Supabase client or use mock API
export const getSupabaseClient = () => {
  // Return actual client if available
  if (supabaseClient) {
    return supabaseClient;
  }
  
  console.warn('Using mock API instead of Supabase. Set up .env.local with your Supabase credentials.');
  
  // Return a mock implementation that mimics Supabase's API
  return {
    from: (table: string) => {
      return {
        select: (columns?: string) => {
          const mockSelect = {
            data: table === 'villas' ? mockVillas : mockBookings,
            error: null,
            
            // Mock supabase query methods
            eq: (column: string, value: any) => {
              let filtered = [];
              if (table === 'villas') {
                filtered = mockVillas.filter((item: any) => item[column] === value);
              } else if (table === 'bookings') {
                filtered = mockBookings.filter((item: any) => item[column] === value);
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
            },
            
            // More methods can be added as needed
          };
          
          return mockSelect;
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
};

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

export default getSupabaseClient();

// Types for our Supabase tables
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

// Helper function to fetch a villa by ID
export async function getVillaById(id: string): Promise<Villa | null> {
  const { data, error } = await supabase
    .from('villas')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching villa:', error);
    return null;
  }

  return data;
}

// Helper function to create a new booking
export async function createBooking(bookingData: Omit<Booking, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('bookings')
    .insert([
      {
        ...bookingData,
        created_at: new Date().toISOString(),
      },
    ])
    .select();

  if (error) {
    console.error('Error creating booking:', error);
    throw error;
  }

  return data[0];
}

// Helper function to check villa availability
export async function checkVillaAvailability(
  villaId: string,
  checkIn: string,
  checkOut: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('villa_id', villaId)
    .eq('status', 'confirmed')
    .or(`check_in.lte.${checkOut},check_out.gte.${checkIn}`);

  if (error) {
    console.error('Error checking availability:', error);
    return false;
  }

  // If there are no overlapping bookings, the villa is available
  return data.length === 0;
} 