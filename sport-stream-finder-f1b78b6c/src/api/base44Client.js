import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "68c13c5bca494419f1b78b6c", 
  requiresAuth: true // Ensure authentication is required for all operations
});
