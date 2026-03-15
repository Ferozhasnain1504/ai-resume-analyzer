import fs from 'fs';
import path from 'path';
import https from 'https';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packages = [
  '@splinetool/react-spline',
  '@splinetool/runtime'
];

console.log('Using Node to install dependencies directly to bypass shell escaping issues...');
try {
  // Use child_process to run npm install with a JSON payload strategy to bypass the command line parsing problem completely
  const pkgPath = path.join(__dirname, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  
  // They are already in dependencies from our previous step
  // Just trigger npm install without arguments
  console.log('Triggering npm install from within node environment...');
  
  // This uses the shell to execute a generic install
  execSync('npm install', { stdio: 'inherit', cwd: __dirname });
  
  console.log('Success!');
} catch (err) {
  console.error('Failed:', err.message);
}
