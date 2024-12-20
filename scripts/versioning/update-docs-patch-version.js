const path = require('path');
const { execSync } = require('child_process');

const versions = require(path.resolve(__dirname, '../..', 'documentation/versions.json'));

const getLatestDocVersion = () => {
  return versions[0] || '1.0.0';
};

const updateDocVersion = async () => {
  try {
    const currentVersion = getLatestDocVersion();
    console.log('Current doc version:', currentVersion);

    // Parse version components
    const [major, minor, patch] = currentVersion.split('.').map(Number);

    // Create new version with incremented patch
    const newVersion = `${major}.${minor}.${patch + 1}`;
    console.log(`Updating documentation to version ${newVersion}...`);

    try {
      // Create new version using docusaurus command
      execSync(`cd documentation && npm run docusaurus docs:version ${newVersion}`, {
        stdio: 'inherit',
      });

      console.log('Documentation version updated successfully!');
    } catch (error) {
      console.error('Error updating documentation version:', error);
      process.exit(1);
    }
  } catch (error) {
    console.error('Error in update process:', error);
    process.exit(1);
  }
};

// Execute the update
updateDocVersion();
