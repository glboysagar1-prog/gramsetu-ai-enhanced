#!/usr/bin/env node

/**
 * Supabase Storage Setup Script
 * 
 * This script helps you set up the required storage bucket for your Replit backend.
 * 
 * Usage:
 *   node setup-supabase-storage.js
 * 
 * Requirements:
 *   1. SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in environment variables
 *   2. Supabase project must be created
 */

import { createClient } from '@supabase/supabase-js';

// Check environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   - SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_KEY');
  console.error('\nPlease set these in your .env file or environment.');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function setupStorage() {
  console.log('🚀 Setting up Supabase Storage...');
  
  try {
    // Check if bucket already exists
    const { data: buckets, error: listError } = await supabase
      .storage
      .listBuckets();
    
    if (listError) {
      console.error('❌ Error listing buckets:', listError.message);
      process.exit(1);
    }
    
    const existingBucket = buckets.find(bucket => bucket.name === 'user-files');
    
    if (existingBucket) {
      console.log('✅ Storage bucket "user-files" already exists');
      return;
    }
    
    // Create the bucket
    console.log('📦 Creating storage bucket "user-files"...');
    const { data, error } = await supabase
      .storage
      .createBucket('user-files', {
        public: false, // Private bucket for security
        fileSizeLimit: 52428800, // 50MB limit
        allowedMimeTypes: [
          'image/*',
          'application/pdf',
          'text/*',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ]
      });
    
    if (error) {
      console.error('❌ Error creating bucket:', error.message);
      process.exit(1);
    }
    
    console.log('✅ Storage bucket "user-files" created successfully!');
    console.log('🔒 Bucket is private for security');
    console.log('📊 File size limit: 50MB');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    process.exit(1);
  }
}

// Run the setup
setupStorage();