import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Check for environment variables and their existence
    const envStatus = {
      NEXT_PUBLIC_SUPABASE_URL: {
        exists: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        length: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0,
        preview: process.env.NEXT_PUBLIC_SUPABASE_URL 
          ? `${process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 8)}...` 
          : null
      },
      NEXT_PUBLIC_SUPABASE_ANON_KEY: {
        exists: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        length: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
        preview: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
          ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 5)}...` 
          : null
      },
      SUPABASE_SERVICE_KEY: {
        exists: !!process.env.SUPABASE_SERVICE_KEY,
        length: process.env.SUPABASE_SERVICE_KEY?.length || 0,
        preview: process.env.SUPABASE_SERVICE_KEY 
          ? `${process.env.SUPABASE_SERVICE_KEY.substring(0, 5)}...` 
          : null
      }
    };
    
    // Check if .env.local exists
    let envLocalExists = false;
    let envLocalContents = null;
    
    try {
      const envPath = path.join(process.cwd(), '.env.local');
      envLocalExists = fs.existsSync(envPath);
      
      if (envLocalExists) {
        // Read file but mask sensitive values
        const content = fs.readFileSync(envPath, 'utf8');
        // Replace sensitive values with redacted versions
        envLocalContents = content
          .split('\n')
          .map(line => {
            // For each line, check if it's a sensitive variable
            const match = line.match(/^(NEXT_PUBLIC_SUPABASE_URL|NEXT_PUBLIC_SUPABASE_ANON_KEY|SUPABASE_SERVICE_KEY)=(.+)$/);
            if (match) {
              const varName = match[1];
              const varValue = match[2];
              // Show first few chars and mask the rest
              const maskedValue = varValue.substring(0, 8) + '...';
              return `${varName}=${maskedValue}`;
            }
            return line;
          })
          .join('\n');
      }
    } catch (fileError) {
      console.error('Error checking .env.local file:', fileError);
    }
    
    // Check if the app is running in development or production mode
    const nodeEnv = process.env.NODE_ENV;
    
    // Return the environment information
    return res.status(200).json({
      success: true,
      environment: nodeEnv,
      env_variables: envStatus,
      env_local_file: {
        exists: envLocalExists,
        masked_contents: envLocalContents
      },
      server_time: new Date().toISOString(),
      project_root: process.cwd()
    });
  } catch (error) {
    console.error('Error checking environment:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to check environment',
      details: error instanceof Error ? error.message : String(error)
    });
  }
} 