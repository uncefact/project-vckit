const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
try {
  // Read version.json
  const versionPath = path.join(__dirname, '..', 'version.json');
  const versionContent = fs.readFileSync(versionPath, 'utf8');
  const { docVersion } = JSON.parse(versionContent);
  if (!docVersion) {
    throw new Error('docVersion not found in version.json');
  }
  // Navigate to the documentation directory
  const docPath = path.join(__dirname, '..', 'documentation');
  process.chdir(docPath);
  // Execute the Docusaurus version command
  execSync(`npm run docusaurus docs:version ${docVersion}`, { stdio: 'inherit' });
  console.log(`Successfully created documentation version ${docVersion}`);
  process.exit(0);
} catch (error) {
  console.error('Error creating documentation version:', error.message);
  process.exit(1);
}
