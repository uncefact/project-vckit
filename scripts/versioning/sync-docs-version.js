const path = require('path');
const { execSync } = require('child_process');

const rootPackageJson = path.resolve(__dirname, '../..', 'package.json');
const fullRepoVersion = require(rootPackageJson).version;
const versions = require(path.resolve(__dirname, '../..', 'documentation/versions.json'));

const getLatestDocVersion = () => {
  return versions[0] || '1.0.0';
};

const updateDocVersion = async () => {
  try {
    const latestDocVersion = getLatestDocVersion();

    // Parse versions properly
    const [repoMajor, repoMinor] = fullRepoVersion.split('.');
    const [docMajor, docMinor] = latestDocVersion.split('.');

    // Determine the type of version change
    const isMajorChange = repoMajor !== docMajor;
    const isMinorChange = !isMajorChange && repoMinor !== docMinor;

    if (isMajorChange || isMinorChange) {
      console.log('Current doc version:', latestDocVersion);
      console.log('Repository version:', fullRepoVersion);
      console.log(`Version change type: ${isMajorChange ? 'MAJOR' : 'MINOR'}`);

      // Create the new version maintaining the appropriate part
      const newVersion = `${repoMajor}.${repoMinor}.0`;

      try {
        console.log(`Updating documentation to version ${newVersion}...`);
        execSync(`cd documentation && npm run docusaurus docs:version ${newVersion}`, {
          stdio: 'inherit',
        });
        console.log('Documentation version updated successfully!');
      } catch (error) {
        console.error('Error updating documentation version:', error);
        process.exit(1);
      }
    } else {
      console.log('Documentation is already up to date with repository version');
    }
  } catch (error) {
    console.error('Error in update process:', error);
    process.exit(1);
  }
};

// Execute the update
updateDocVersion();
