// Script to create demo users in InsForge backend (v2)
const { createClient } = require('@insforge/sdk');

async function createDemoUsers() {
  console.log('Creating demo users in InsForge backend...');
  
  // Initialize client
  const client = createClient({ 
    baseUrl: 'https://89gp4et3.us-east.insforge.app'
  });
  
  // Demo credentials for each role
  const demoUsers = [
    { 
      email: 'citizen@gramsetu.in', 
      password: 'citizen123',
      role: 'citizen',
      nickname: 'Demo Citizen'
    },
    { 
      email: 'field@gramsetu.in', 
      password: 'field123',
      role: 'field-worker',
      nickname: 'Demo Field Officer'
    },
    { 
      email: 'district@gramsetu.in', 
      password: 'district123',
      role: 'district-officer',
      nickname: 'Demo District Officer'
    },
    { 
      email: 'state@gramsetu.in', 
      password: 'state123',
      role: 'state-officer',
      nickname: 'Demo State Officer'
    },
    { 
      email: 'admin@gramsetu.in', 
      password: 'admin123',
      role: 'national-admin',
      nickname: 'Demo National Admin'
    }
  ];
  
  // We'll store the created users to update their profiles after creation
  const createdUsers = [];
  
  // First, create all users
  for (const user of demoUsers) {
    try {
      console.log(`Creating user: ${user.email}`);
      
      // Sign up the user
      const { data, error } = await client.auth.signUp({
        email: user.email,
        password: user.password
      });
      
      if (error) {
        if (error.message.includes('already exists')) {
          console.log(`User ${user.email} already exists, will try to log in...`);
          
          // Try to log in to get the user data
          const { data: loginData, error: loginError } = await client.auth.signInWithPassword({
            email: user.email,
            password: user.password
          });
          
          if (loginError) {
            console.error(`Error logging in as ${user.email}:`, loginError.message);
            continue;
          }
          
          createdUsers.push({
            ...user,
            id: loginData.user.id,
            accessToken: loginData.accessToken
          });
        } else {
          console.error(`Error creating user ${user.email}:`, error.message);
          continue;
        }
      } else {
        console.log(`User ${user.email} created successfully`);
        createdUsers.push({
          ...user,
          id: data.user.id,
          accessToken: data.accessToken
        });
      }
      
    } catch (error) {
      console.error(`Exception while creating user ${user.email}:`, error.message);
    }
  }
  
  // Now update profiles for all users
  console.log('\nUpdating user profiles...');
  for (const user of createdUsers) {
    try {
      console.log(`Updating profile for: ${user.email}`);
      
      // Create a new client with the user's access token
      const userClient = createClient({ 
        baseUrl: 'https://89gp4et3.us-east.insforge.app',
        accessToken: user.accessToken
      });
      
      // Update profile with nickname
      const { data: profileData, error: profileError } = await userClient.auth.setProfile({
        nickname: user.nickname
      });
      
      if (profileError) {
        console.error(`Error updating profile for ${user.email}:`, profileError.message);
      } else {
        console.log(`Profile updated for ${user.email}:`, profileData);
      }
      
      // For citizen users, also create an entry in citizen_reputation_scores
      if (user.role === 'citizen') {
        try {
          console.log(`Creating reputation score for citizen: ${user.email}`);
          
          // Try to insert the reputation score
          const { data: reputationData, error: reputationError } = await userClient.database
            .from('citizen_reputation_scores')
            .upsert({
              user_id: user.id,
              score: 100,
              complaint_count: 0,
              resolved_count: 0
            })
            .select()
            .single();
          
          if (reputationError) {
            console.error(`Error creating reputation score for ${user.email}:`, reputationError.message);
          } else {
            console.log(`Reputation score created for ${user.email}:`, reputationData);
          }
        } catch (reputationError) {
          console.error(`Exception creating reputation score for ${user.email}:`, reputationError.message);
        }
      }
      
    } catch (error) {
      console.error(`Exception while updating profile for ${user.email}:`, error.message);
    }
  }
  
  console.log('\nDemo user creation process completed');
  console.log('Created users:', createdUsers.map(u => ({ email: u.email, role: u.role })));
}

// Run the script
createDemoUsers();