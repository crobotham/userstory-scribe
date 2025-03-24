
/**
 * Deployment script for multiple environments
 * 
 * Usage: 
 * - For staging: node scripts/deploy.js staging
 * - For production: node scripts/deploy.js production
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const TARGET_ENV = process.argv[2] || 'staging';
const VALID_ENVS = ['staging', 'production'];

// Validate environment
if (!VALID_ENVS.includes(TARGET_ENV)) {
  console.error(`Invalid environment: ${TARGET_ENV}. Valid options are: ${VALID_ENVS.join(', ')}`);
  process.exit(1);
}

console.log(`🚀 Deploying to ${TARGET_ENV} environment...`);

try {
  // Build the application with environment-specific variables
  console.log(`Building for ${TARGET_ENV}...`);
  execSync(`npm run build`, { stdio: 'inherit' });
  
  // Deploy to the correct target based on environment
  console.log(`Deploying to ${TARGET_ENV}...`);
  if (TARGET_ENV === 'staging') {
    // For staging.sonicstories.io deployment
    // Replace with your actual deployment command for staging
    execSync(`echo "Deploying to staging.sonicstories.io"`);
    // Example: execSync(`netlify deploy --prod --site $NETLIFY_STAGING_SITE_ID`, { stdio: 'inherit' });
  } else {
    // For userstory-scribe.lovable.app deployment
    // Replace with your actual deployment command for production
    execSync(`echo "Deploying to userstory-scribe.lovable.app"`);
    // Example: execSync(`netlify deploy --prod --site $NETLIFY_PRODUCTION_SITE_ID`, { stdio: 'inherit' });
  }
  
  console.log(`✅ Deploy to ${TARGET_ENV} completed successfully!`);
} catch (error) {
  console.error(`❌ Deployment failed:`, error);
  process.exit(1);
}
