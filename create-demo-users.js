// Script to create demo users in InsForge backend
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
  
  for (const user of demoUsers) {
    try {
      console.log(`Creating user: ${user.email} with role: ${user.role}`);
      
      // Sign up the user
      const { data, error } = await client.auth.signUp({
        email: user.email,
        password: user.password
      });
      
      if (error) {
        if (error.message.includes('already exists')) {
          console.log(`User ${user.email} already exists, skipping...`);
        } else {
          console.error(`Error creating user ${user.email}:`, error.message);
        }
        continue;
      }
      
      console.log(`User ${user.email} created successfully`);
      
      // Update profile with nickname and role
      const { error: profileError } = await client.auth.setProfile({
        nickname: user.nickname,
        role: user.role
      });
      
      if (profileError) {
        console.error(`Error updating profile for ${user.email}:`, profileError.message);
      } else {
        console.log(`Profile updated for ${user.email}`);
      }
      
      // For citizen users, also create an entry in citizen_reputation_scores
      if (user.role === 'citizen') {
        try {
          const { error: reputationError } = await client.database
            .from('citizen_reputation_scores')
            .upsert({
              user_id: data.user.id,
              score: 100,
              complaint_count: 0,
              resolved_count: 0
            });
          
          if (reputationError) {
            console.error(`Error creating reputation score for ${user.email}:`, reputationError.message);
          } else {
            console.log(`Reputation score created for ${user.email}`);
          }
        } catch (reputationError) {
          console.error(`Error creating reputation score for ${user.email}:`, reputationError.message);
        }
      }
      
    } catch (error) {
      console.error(`Exception while creating user ${user.email}:`, error.message);
    }
  }
  
  console.log('Demo user creation process completed');
}

// Run the script
createDemoUsers();