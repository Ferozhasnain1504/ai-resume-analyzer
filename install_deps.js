const { execSync } = require('child_process');
try {
  console.log("Starting npm install...");
  const output = execSync('npm.cmd install', { stdio: 'inherit' });
  console.log("Install finished!");
} catch (error) {
  console.error("Installation failed:", error);
}
