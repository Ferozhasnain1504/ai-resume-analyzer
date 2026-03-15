const { execSync } = require('child_process');

try {
  console.log("Installing Spline Dependencies via execSync...");
  execSync('npm install @splinetool/react-spline @splinetool/runtime --no-save', { stdio: 'inherit', shell: true });
  console.log("Done.");
} catch (error) {
  console.error("Installation failed.");
}
