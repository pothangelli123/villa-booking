import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get environment variables directly
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

    // Validate existence
    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({
        success: false,
        error: 'Missing Supabase credentials',
        vars: {
          urlExists: !!supabaseUrl,
          keyExists: !!supabaseKey,
          serviceKeyExists: !!supabaseServiceKey
        }
      });
    }

    // Use service key if available for admin operations
    const key = req.method === 'POST' && req.body?.admin ? supabaseServiceKey || supabaseKey : supabaseKey;
    
    // Create a fresh client
    const supabase = createClient(supabaseUrl, key);
    
    // Handle specific operations for POST requests
    if (req.method === 'POST') {
      const { method, table, query } = req.body || {};
      
      // Table info operation - get column information
      if (method === 'table_info' && table) {
        try {
          // Try to get column information using introspection
          const { data: columns, error: columnsError } = await supabase.rpc(
            'get_columns_for_table',
            { table_name: table }
          );
          
          if (columnsError) {
            console.log('RPC method failed, trying direct query');
            
            // Fallback to direct query for column information
            const { data: columnData, error: columnQueryError } = await supabase
              .from('information_schema.columns')
              .select('column_name, data_type, is_nullable')
              .eq('table_schema', 'public')
              .eq('table_name', table);
              
            if (columnQueryError) {
              // Last resort: Try to select * from the table to get column names
              try {
                console.log('Attempting fallback to JSONB metadata');
                
                // Try a direct SQL query to get column info (requires service key)
                if (supabaseServiceKey) {
                  const adminClient = createClient(supabaseUrl, supabaseServiceKey);
                  const { data: tableData, error: tableError } = await adminClient
                    .from(table)
                    .select('*')
                    .limit(1);
                    
                  if (!tableError && tableData) {
                    // Get column names from the first row if it exists
                    const columns = tableData.length > 0 
                      ? Object.keys(tableData[0]).map(column => ({
                          column_name: column,
                          data_type: typeof tableData[0][column]
                        }))
                      : [];
                      
                    return res.status(200).json({
                      success: true,
                      table,
                      columns,
                      method: 'sample_row',
                      error: null
                    });
                  }
                }
                
                return res.status(500).json({
                  success: false,
                  error: 'Failed to get table schema',
                  details: {
                    rpc_error: columnsError?.message,
                    query_error: columnQueryError?.message
                  }
                });
              } catch (finalError) {
                return res.status(500).json({
                  success: false,
                  error: 'All schema lookup methods failed',
                  details: finalError instanceof Error ? finalError.message : String(finalError)
                });
              }
            }
            
            return res.status(200).json({
              success: true,
              table,
              columns: columnData,
              method: 'information_schema'
            });
          }
          
          return res.status(200).json({
            success: true,
            table,
            columns,
            method: 'rpc'
          });
        } catch (schemaError) {
          return res.status(500).json({
            success: false,
            error: 'Failed to get table schema',
            details: schemaError instanceof Error ? schemaError.message : String(schemaError)
          });
        }
      }
      
      // Custom query operation
      if (method === 'custom_query' && query) {
        try {
          // Executing custom queries requires service key
          if (!supabaseServiceKey) {
            return res.status(403).json({
              success: false,
              error: 'Service key required for custom queries'
            });
          }
          
          const adminClient = createClient(supabaseUrl, supabaseServiceKey);
          const { data, error } = await adminClient.rpc('execute_sql', { sql_query: query });
          
          if (error) {
            return res.status(500).json({
              success: false,
              error: error.message
            });
          }
          
          return res.status(200).json({
            success: true,
            data
          });
        } catch (queryError) {
          return res.status(500).json({
            success: false,
            error: 'Query execution failed',
            details: queryError instanceof Error ? queryError.message : String(queryError)
          });
        }
      }
      
      // If no special method, return an error
      if (method) {
        return res.status(400).json({
          success: false,
          error: `Unknown method: ${method}`
        });
      }
    }

    // Default behavior: Test connection with a basic query
    const { data, error } = await supabase.from('villas').select('count').limit(1);

    return res.status(200).json({
      success: !error,
      data: data,
      error: error,
      connection: {
        url: supabaseUrl.substring(0, 8) + '...',
        hasAnonKey: !!supabaseKey,
        hasServiceKey: !!supabaseServiceKey,
        time: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Test connection error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 