// Edge function for user management
// This function handles user profile operations and role management

module.exports = async function(request) {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };

  // Handle OPTIONS preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    // Extract token from request headers
    const authHeader = request.headers.get('Authorization');
    const userToken = authHeader ? authHeader.replace('Bearer ', '') : null;
    
    // Create client with the edge function token
    const client = createClient({ 
      baseUrl: Deno.env.get('BACKEND_INTERNAL_URL') || 'http://insforge:7130',
      edgeFunctionToken: userToken
    });
    
    // Get authenticated user
    const { data: userData, error: userError } = await client.auth.getCurrentUser();
    if (userError) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Parse URL and method
    const url = new URL(request.url);
    const method = request.method;
    const path = url.pathname;
    
    // Route handling based on path and method
    if (path === '/users/profile') {
      switch (method) {
        case 'GET':
          // Get user profile
          return await getUserProfile(request, client, userData.user, corsHeaders);
          
        case 'PUT':
          // Update user profile
          return await updateUserProfile(request, client, userData.user, corsHeaders);
          
        default:
          return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
      }
    } else if (path === '/users/reputation') {
      switch (method) {
        case 'GET':
          // Get user reputation score
          return await getUserReputation(request, client, userData.user, corsHeaders);
          
        default:
          return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
      }
    } else {
      // Unknown endpoint
      return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('Error in users function:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};

// Helper function to get user profile
async function getUserProfile(request, client, user, corsHeaders) {
  try {
    // Get user profile from InsForge
    const { data, error } = await client.auth.getProfile(user.id);
    
    if (error) {
      console.error('Database error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch profile' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

// Helper function to update user profile
async function updateUserProfile(request, client, user, corsHeaders) {
  try {
    const body = await request.json();
    
    // Update user profile
    const { data, error } = await client.auth.setProfile({
      nickname: body.nickname,
      bio: body.bio,
      avatar_url: body.avatar_url
    });
    
    if (error) {
      console.error('Database error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

// Helper function to get user reputation score
async function getUserReputation(request, client, user, corsHeaders) {
  try {
    // Get user reputation score from database
    const { data, error } = await client.database
      .from('citizen_reputation_scores')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (error) {
      console.error('Database error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify(data || { score: 100, complaint_count: 0, resolved_count: 0 }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Get reputation error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch reputation score' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}