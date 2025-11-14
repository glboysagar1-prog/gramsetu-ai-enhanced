// Edge function for complaint management
// This function handles all complaint-related operations

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
    // Use BACKEND_INTERNAL_URL environment variable for internal Docker communication
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
    const searchParams = url.searchParams;
    
    // Route handling based on path and method
    if (path === '/complaints') {
      switch (method) {
        case 'POST':
          // Create a new complaint
          return await createComplaint(request, client, userData.user, corsHeaders);
          
        case 'GET':
          // Get complaints (with optional filters)
          return await getComplaints(request, client, userData.user, corsHeaders, searchParams);
          
        default:
          return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
      }
    } else if (path.startsWith('/complaints/')) {
      // Extract complaint ID from path
      const complaintId = path.split('/')[2];
      
      if (!complaintId) {
        return new Response(JSON.stringify({ error: 'Complaint ID required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      switch (method) {
        case 'GET':
          // Get a specific complaint
          return await getComplaint(request, client, userData.user, corsHeaders, complaintId);
          
        case 'PUT':
          // Update a complaint
          return await updateComplaint(request, client, userData.user, corsHeaders, complaintId);
          
        case 'DELETE':
          // Delete a complaint
          return await deleteComplaint(request, client, userData.user, corsHeaders, complaintId);
          
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
    console.error('Error in complaints function:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};

// Helper function to create a complaint
async function createComplaint(request, client, user, corsHeaders) {
  try {
    const body = await request.json();
    
    // Insert complaint into database
    const { data, error } = await client.database
      .from('complaints')
      .insert([{
        user_id: user.id,
        title: body.title,
        description: body.description,
        category: body.category,
        latitude: body.latitude,
        longitude: body.longitude,
        status: 'pending',
        evidence_url: body.evidence_url || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Database error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify(data), {
      status: 201,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Create complaint error:', error);
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

// Helper function to get complaints
async function getComplaints(request, client, user, corsHeaders, searchParams) {
  try {
    let query = client.database
      .from('complaints')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Apply filters if provided
    if (searchParams.has('status')) {
      query = query.eq('status', searchParams.get('status'));
    }
    
    if (searchParams.has('category')) {
      query = query.eq('category', searchParams.get('category'));
    }
    
    // Regular users can only see their own complaints
    // Admin users can see all complaints
    if (user.role !== 'national-admin' && user.role !== 'state-officer' && user.role !== 'district-officer') {
      query = query.eq('user_id', user.id);
    }
    
    // Limit results
    const limit = parseInt(searchParams.get('limit')) || 50;
    query = query.limit(limit);
    
    const { data, error } = await query;
    
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
    console.error('Get complaints error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch complaints' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

// Helper function to get a specific complaint
async function getComplaint(request, client, user, corsHeaders, complaintId) {
  try {
    let query = client.database
      .from('complaints')
      .select('*')
      .eq('id', complaintId);
    
    // Regular users can only see their own complaints
    if (user.role !== 'national-admin' && user.role !== 'state-officer' && user.role !== 'district-officer') {
      query = query.eq('user_id', user.id);
    }
    
    const { data, error } = await query.single();
    
    if (error) {
      console.error('Database error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    if (!data) {
      return new Response(JSON.stringify({ error: 'Complaint not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Get complaint error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch complaint' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

// Helper function to update a complaint
async function updateComplaint(request, client, user, corsHeaders, complaintId) {
  try {
    const body = await request.json();
    
    // Check if user has permission to update this complaint
    let permissionQuery = client.database
      .from('complaints')
      .select('user_id')
      .eq('id', complaintId);
    
    // Regular users can only update their own complaints
    if (user.role !== 'national-admin' && user.role !== 'state-officer' && user.role !== 'district-officer') {
      permissionQuery = permissionQuery.eq('user_id', user.id);
    }
    
    const { data: permissionData, error: permissionError } = await permissionQuery.single();
    
    if (permissionError || !permissionData) {
      return new Response(JSON.stringify({ error: 'Complaint not found or access denied' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Update complaint
    const { data, error } = await client.database
      .from('complaints')
      .update({
        title: body.title,
        description: body.description,
        category: body.category,
        latitude: body.latitude,
        longitude: body.longitude,
        status: body.status,
        evidence_url: body.evidence_url,
        updated_at: new Date().toISOString()
      })
      .eq('id', complaintId)
      .select()
      .single();
    
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
    console.error('Update complaint error:', error);
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

// Helper function to delete a complaint
async function deleteComplaint(request, client, user, corsHeaders, complaintId) {
  try {
    // Check if user has permission to delete this complaint
    let permissionQuery = client.database
      .from('complaints')
      .select('user_id')
      .eq('id', complaintId);
    
    // Regular users can only delete their own complaints
    if (user.role !== 'national-admin' && user.role !== 'state-officer' && user.role !== 'district-officer') {
      permissionQuery = permissionQuery.eq('user_id', user.id);
    }
    
    const { data: permissionData, error: permissionError } = await permissionQuery.single();
    
    if (permissionError || !permissionData) {
      return new Response(JSON.stringify({ error: 'Complaint not found or access denied' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Delete complaint
    const { data, error } = await client.database
      .from('complaints')
      .delete()
      .eq('id', complaintId);
    
    if (error) {
      console.error('Database error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ message: 'Complaint deleted successfully' }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Delete complaint error:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete complaint' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}