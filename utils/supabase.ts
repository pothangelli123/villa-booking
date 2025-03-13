import { createClient, SupabaseClient } from '@supabase/supabase-js';

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

// Supabase client initialization
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
let supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
let supabaseClient: SupabaseClient | null = null;
let supabaseAdminClient: SupabaseClient | null = null;

// Log environment variables status
console.log('Supabase environment variables status:', {
  urlExists: !!supabaseUrl,
  anonKeyExists: !!supabaseAnonKey,
  serviceKeyExists: !!supabaseServiceKey,
});

// Attempt to initialize Supabase client with credentials
if (supabaseUrl && supabaseAnonKey) {
  try {
    console.log('Initializing Supabase client with available credentials');
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    console.log('Supabase client initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
  }
}

// Attempt to initialize admin client in server-side code
if (typeof window === 'undefined' && supabaseUrl && supabaseServiceKey) {
  try {
    console.log('Initializing Supabase admin client');
    supabaseAdminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    console.log('Supabase admin client initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Supabase admin client:', error);
  }
}

// Function to create a mock Supabase client
function createMockClient() {
  console.warn('Creating mock Supabase client');
  return {
    from: (table: string) => {
      return {
        select: (columns: string = '*') => {
          console.log(`Mock SELECT ${columns} FROM ${table}`);
          const mockResult = {
            data: table === 'villas' ? mockVillas : mockBookings,
            error: null,
            
            // Add methods that are used in your codebase
            eq: function(column: string, value: any) {
              console.log(`Mock WHERE ${column} = ${value}`);
              let filtered: (Villa | Booking)[] = [];
              if (table === 'villas') {
                filtered = mockVillas.filter((item: Villa) => item[column as keyof Villa] === value);
              } else if (table === 'bookings') {
                filtered = mockBookings.filter((item: Booking) => item[column as keyof Booking] === value);
              }
              
              return {
                data: filtered,
                error: null,
                limit: function(n: number) {
                  console.log(`Mock LIMIT ${n}`);
                  return {
                    data: filtered.slice(0, n),
                    error: null,
                    single: function() {
                      return {
                        data: filtered.length > 0 ? filtered[0] : null,
                        error: filtered.length > 0 ? null : { message: 'Not found' }
                      };
                    }
                  };
                },
                single: function() {
                  return {
                    data: filtered.length > 0 ? filtered[0] : null,
                    error: filtered.length > 0 ? null : { message: 'Not found' }
                  };
                }
              };
            },
            
            limit: function(n: number) {
              console.log(`Mock LIMIT ${n}`);
              const limitedData = (table === 'villas' ? mockVillas : mockBookings).slice(0, n);
              return {
                data: limitedData,
                error: null
              };
            }
          };
          
          return mockResult;
        },
        insert: (data: any) => {
          console.log(`Mock INSERT INTO ${table}`, data);
          const newItem = {
            id: `mock-${Date.now()}`,
            created_at: new Date().toISOString(),
            ...data
          };
          
          if (table === 'villas') {
            mockVillas.push(newItem as Villa);
          } else if (table === 'bookings') {
            mockBookings.push(newItem as Booking);
          } else if (table === 'transactions') {
            // Handle transactions mock table
            console.log('Mock transaction created:', newItem);
          }
          
          return {
            data: [newItem],
            error: null,
            select: () => ({ data: [newItem], error: null })
          };
        },
        update: (data: any) => {
          console.log(`Mock UPDATE ${table}`, data);
          return {
            eq: function(column: string, value: any) {
              console.log(`Mock WHERE ${column} = ${value}`);
              if (table === 'villas') {
                const index = mockVillas.findIndex((item: Villa) => item[column as keyof Villa] === value);
                if (index !== -1) {
                  mockVillas[index] = { ...mockVillas[index], ...data };
                  return { data: mockVillas[index], error: null };
                }
              } else if (table === 'bookings') {
                const index = mockBookings.findIndex((item: Booking) => item[column as keyof Booking] === value);
                if (index !== -1) {
                  mockBookings[index] = { ...mockBookings[index], ...data };
                  return { data: mockBookings[index], error: null };
                }
              }
              
              return { data: null, error: { message: 'Item not found' } };
            },
            match: ({ id }: { id: string }) => {
              console.log(`Mock WHERE id = ${id}`);
              if (table === 'villas') {
                const index = mockVillas.findIndex((item: Villa) => item.id === id);
                if (index !== -1) {
                  mockVillas[index] = { ...mockVillas[index], ...data };
                  return { data: mockVillas[index], error: null };
                }
              } else if (table === 'bookings') {
                const index = mockBookings.findIndex((item: Booking) => item.id === id);
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
          console.log(`Mock DELETE FROM ${table}`);
          return {
            match: ({ id }: { id: string }) => {
              console.log(`Mock WHERE id = ${id}`);
              if (table === 'villas') {
                const index = mockVillas.findIndex((item: Villa) => item.id === id);
                if (index !== -1) {
                  const deleted = mockVillas[index];
                  mockVillas.splice(index, 1);
                  return { data: deleted, error: null };
                }
              } else if (table === 'bookings') {
                const index = mockBookings.findIndex((item: Booking) => item.id === id);
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

// Utility function to get the appropriate Supabase client
export const getSupabaseClient = (admin = false) => {
  // For admin operations (from API routes), use admin client if available
  if (admin && supabaseAdminClient) {
    console.log('Using Supabase admin client');
    return supabaseAdminClient;
  }
  
  // For normal operations, use the regular client if available
  if (supabaseClient) {
    console.log('Using Supabase anon client');
    return supabaseClient;
  }
  
  // If no client is available, log warning and return mock client
  console.warn('No Supabase client available, using mock implementation');
  return createMockClient();
};

// Export default client for convenience
const supabase = getSupabaseClient();
export default supabase;

// Helper function to fetch a villa by ID
export async function getVillaById(id: string): Promise<Villa | null> {
  try {
    const client = getSupabaseClient();
    console.log(`Fetching villa with ID: ${id}`);
    
    const { data, error } = await client
      .from('villas')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('Error fetching villa:', error);
      return null;
    }
    
    return data as Villa;
  } catch (error) {
    console.error('Error fetching villa:', error);
    return null;
  }
}

// Helper function to create a new booking with improved error handling
export async function createBooking(
  bookingData: Omit<Booking, 'id' | 'created_at'>,
  client: any = null
) {
  try {
    // Use provided client or get the default one
    const supabase = client || getSupabaseClient(typeof window === 'undefined');
    
    console.log('Creating booking with client type:', 
      client ? 'provided client' : 
      typeof window === 'undefined' ? 'server-side client' : 'browser client');
    
    console.log('Submitting booking data to Supabase:', bookingData);
    
    // Begin by checking if we have a valid UUID for villa_id
    let villaId = bookingData.villa_id;
    
    // If villa_id is not a valid UUID, try to get the first villa from the database
    if (!isValidUUID(villaId)) {
      console.log('villa_id is not a valid UUID, attempting to find a valid villa');
      try {
        const { data: villas, error } = await supabase
          .from('villas')
          .select('id')
          .limit(1);
          
        if (error) {
          console.error('Error finding valid villa:', error);
          throw new Error(`Failed to find a valid villa: ${error.message}`);
        }
        
        if (villas && villas.length > 0) {
          villaId = villas[0].id;
          console.log('Found valid villa ID:', villaId);
        } else {
          // If no villas exist, create a test villa
          console.log('No villas found, creating a test villa');
          const { data: newVilla, error: villaError } = await supabase
            .from('villas')
            .insert([{
              name: 'Test Villa',
              description: 'Test villa created during booking',
              short_description: 'Test villa',
              location: 'Test location',
              price: bookingData.total_amount / 2,
              bedrooms: 3,
              bathrooms: 2,
              max_guests: bookingData.guests,
              images: [],
              amenities: []
            }])
            .select();
            
          if (villaError) {
            console.error('Error creating test villa:', villaError);
            throw new Error(`Failed to create test villa: ${villaError.message}`);
          }
          
          if (newVilla && newVilla.length > 0) {
            villaId = newVilla[0].id;
            console.log('Created test villa with ID:', villaId);
          } else {
            throw new Error('Failed to create test villa');
          }
        }
      } catch (err) {
        console.error('Error during villa lookup:', err);
        // Fall back to using the original villa_id
        console.log('Falling back to original villa_id:', villaId);
      }
    }
    
    // First, create a transaction record
    console.log('Creating transaction record');
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert([
        {
          payment_id: bookingData.payment_id,
          amount: bookingData.total_amount,
          status: 'completed',
          payment_method: 'credit_card', // Default value
          payment_details: { source: 'direct_booking' }
        }
      ])
      .select();
      
    if (transactionError) {
      console.error('Error creating transaction:', transactionError);
      throw transactionError;
    }
    
    console.log('Transaction created successfully:', transaction);
    
    // Check if bookings table has payment_id column
    let hasPaymentIdColumn = true;
    try {
      // Try a test insert with payment_id to check if it exists
      const testInsert = {
        villa_id: villaId,
        check_in: bookingData.check_in,
        check_out: bookingData.check_out,
        guests: bookingData.guests,
        first_name: 'test',
        last_name: 'user',
        email: 'test@example.com',
        phone: '1234567890',
        total_amount: 1,
        status: 'cancelled',
        payment_id: 'test'
      };
      
      const { error: testError } = await supabase
        .from('bookings')
        .insert([testInsert]);
        
      if (testError && testError.message.includes('payment_id')) {
        console.log('payment_id column does not exist in bookings table');
        hasPaymentIdColumn = false;
      }
      
      // Delete the test booking
      await supabase
        .from('bookings')
        .delete()
        .eq('email', 'test@example.com')
        .eq('status', 'cancelled');
    } catch (testError) {
      console.log('Error testing payment_id column:', testError);
      // Assume it doesn't exist to be safe
      hasPaymentIdColumn = false;
    }
    
    // Now create the booking with or without payment_id
    console.log('Creating booking record');
    let bookingInsert: any = {
      villa_id: villaId,
      check_in: bookingData.check_in,
      check_out: bookingData.check_out,
      guests: bookingData.guests,
      first_name: bookingData.first_name,
      last_name: bookingData.last_name,
      email: bookingData.email,
      phone: bookingData.phone,
      special_requests: bookingData.special_requests,
      total_amount: bookingData.total_amount,
      status: 'confirmed'
    };
    
    // Only include payment_id if the column exists
    if (hasPaymentIdColumn) {
      bookingInsert.payment_id = bookingData.payment_id;
    }
    
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([bookingInsert])
      .select();
      
    if (bookingError) {
      console.error('Error creating booking:', bookingError);
      
      // If the error mentions payment_id, try again without it
      if (hasPaymentIdColumn && bookingError.message.includes('payment_id')) {
        console.log('Retrying without payment_id');
        delete bookingInsert.payment_id;
        
        const { data: retryBooking, error: retryError } = await supabase
          .from('bookings')
          .insert([bookingInsert])
          .select();
          
        if (retryError) {
          console.error('Retry also failed:', retryError);
          throw retryError;
        }
        
        console.log('Booking created successfully on retry:', retryBooking);
        return retryBooking ? retryBooking[0] : null;
      }
      
      throw bookingError;
    }
    
    console.log('Booking created successfully:', booking);
    
    // Update transaction with booking_id
    if (booking && booking.length > 0 && transaction && transaction.length > 0) {
      console.log(`Updating transaction ${transaction[0].id} with booking ID ${booking[0].id}`);
      const { error: updateError } = await supabase
        .from('transactions')
        .update({ booking_id: booking[0].id })
        .eq('id', transaction[0].id);
        
      if (updateError) {
        console.warn('Warning: Could not update transaction with booking ID:', updateError);
      }
    }
    
    return booking ? booking[0] : null;
  } catch (error) {
    console.error('Error in createBooking:', error);
    throw error;
  }
}

// Helper function to check if a string is a valid UUID
function isValidUUID(str: string): boolean {
  if (!str) return false;
  
  // Simple UUID validation regex
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

// Helper function to check villa availability
export async function checkVillaAvailability(
  villaId: string,
  checkIn: string,
  checkOut: string
): Promise<boolean> {
  try {
    // Get client and log action
    const supabaseClient = getSupabaseClient();
    console.log(`Checking availability for villa ${villaId} from ${checkIn} to ${checkOut}`);
    
    // This is a simplified implementation that works with TypeScript
    // Create a query first to workaround TypeScript issues
    const query = supabaseClient
      .from('bookings')
      .select('*');
      
    // @ts-ignore - Ignore TypeScript errors for the next part
    const { data, error } = await query
      // @ts-ignore
      .eq('villa_id', villaId)
      // @ts-ignore
      .eq('status', 'confirmed');
    
    if (error) {
      console.error('Error checking availability:', error);
      return false;
    }
    
    // If there are no bookings, villa is available
    if (!data || data.length === 0) {
      return true;
    }
    
    // Convert dates to timestamps for comparison
    const requestStart = new Date(checkIn).getTime();
    const requestEnd = new Date(checkOut).getTime();
    
    // Check for overlapping bookings
    const hasConflict = data.some((booking: any) => {
      const bookingStart = new Date(booking.check_in).getTime();
      const bookingEnd = new Date(booking.check_out).getTime();
      
      // Check if date ranges overlap
      return (requestStart <= bookingEnd && requestEnd >= bookingStart);
    });
    
    // Return availability (true if no conflict)
    return !hasConflict;
  } catch (error) {
    console.error('Error checking villa availability:', error);
    return false; // Assume unavailable on error
  }
}

// Load mock data if needed
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

// Load mock data on initialization if needed
if (typeof window !== 'undefined' && (!supabaseUrl || !supabaseAnonKey)) {
  loadMockData();
}

// Helper function to test Supabase connection
export async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...');
    const client = getSupabaseClient();
    
    // Try a simple query to check connection
    const { data, error } = await client
      .from('villas')
      .select('id, name')
      .limit(1);
      
    if (error) {
      console.error('Supabase connection test failed:', error);
      return { 
        success: false, 
        error: error.message,
        details: error,
        clientType: client === supabaseClient ? 'anon' : client === supabaseAdminClient ? 'admin' : 'mock'
      };
    }
    
    console.log('Supabase connection successful:', data);
    return { 
      success: true, 
      data, 
      clientType: client === supabaseClient ? 'anon' : client === supabaseAdminClient ? 'admin' : 'mock'
    };
  } catch (error) {
    console.error('Error testing Supabase connection:', error);
    return { 
      success: false, 
      error: String(error),
      clientType: 'unknown'
    };
  }
} 