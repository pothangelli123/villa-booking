import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Log environment variable status to debug
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';
    
    console.log('Supabase environment variable status:', {
      urlExists: !!supabaseUrl,
      anonKeyExists: !!supabaseAnonKey,
      serviceKeyExists: !!supabaseServiceKey,
      urlLength: supabaseUrl?.length || 0,
      anonKeyLength: supabaseAnonKey?.length || 0,
      serviceKeyLength: supabaseServiceKey?.length || 0
    });
    
    // Validate Supabase credentials
    if (!supabaseUrl || (!supabaseAnonKey && !supabaseServiceKey)) {
      return res.status(500).json({
        success: false,
        error: 'Missing Supabase credentials',
        variables: {
          urlExists: !!supabaseUrl,
          anonKeyExists: !!supabaseAnonKey,
          serviceKeyExists: !!supabaseServiceKey
        }
      });
    }
    
    // Try with service key first (preferred for admin operations)
    const key = supabaseServiceKey || supabaseAnonKey;
    console.log(`Creating Supabase client with ${supabaseServiceKey ? 'service' : 'anon'} key`);
    
    // Create a fresh Supabase client
    const supabase = createClient(supabaseUrl, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    
    console.log('Checking database connection...');
    
    try {
      // Try standard PostgreSQL information_schema query
      const { data: tables, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');
        
      if (error) {
        console.error('Error querying information_schema:', error);
        
        // Fallback to RPC method if information_schema fails
        try {
          console.log('Trying RPC fallback to list tables...');
          const { data: rpcTables, error: rpcError } = await supabase.rpc('get_tables');
          
          if (rpcError) {
            console.error('RPC fallback also failed:', rpcError);
            
            // Last resort: try to query villas table to check connection
            console.log('Trying to query villas table as last resort...');
            const { data: villas, error: villasError } = await supabase
              .from('villas')
              .select('id, name')
              .limit(1);
              
            if (villasError) {
              console.error('All connection attempts failed:', villasError);
              throw new Error('Could not connect to Supabase database: ' + villasError.message);
            }
            
            return res.status(200).json({
              success: true,
              tables: ['villas'], // We know at least this table exists
              method: 'fallback_query',
              error_info: {
                information_schema: error.message,
                rpc: rpcError.message
              }
            });
          }
          
          console.log('RPC fallback successful, tables:', rpcTables);
          return res.status(200).json({
            success: true,
            tables: rpcTables,
            method: 'rpc'
          });
        } catch (fallbackError) {
          console.error('All fallback methods failed:', fallbackError);
          return res.status(500).json({
            success: false,
            error: 'Failed to list tables with all methods',
            details: {
              information_schema_error: error.message,
              fallback_error: fallbackError instanceof Error ? fallbackError.message : String(fallbackError)
            }
          });
        }
      }
      
      console.log('Successfully retrieved tables:', tables);
      return res.status(200).json({
        success: true,
        tables: tables,
        method: 'information_schema'
      });
    } catch (dbError) {
      console.error('Database query error:', dbError);
      return res.status(500).json({
        success: false,
        error: 'Failed to query database',
        details: dbError instanceof Error ? dbError.message : String(dbError)
      });
    }
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error',
      details: error instanceof Error ? error.message : String(error)
    });
  }
} 