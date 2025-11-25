const { spawn, exec } = require('child_process');
const path = require('path');

console.log('Starting FST Servis (Backend + Expo)...\n');

const backendProcess = spawn('node', ['server.js'], {
  cwd: __dirname,
  stdio: ['ignore', 'pipe', 'pipe'],
  env: { ...process.env }
});

backendProcess.stdout.on('data', (data) => {
  console.log(`[Backend] ${data.toString().trim()}`);
});

backendProcess.stderr.on('data', (data) => {
  console.error(`[Backend Error] ${data.toString().trim()}`);
});

backendProcess.on('error', (err) => {
  console.error('[Backend] Failed to start:', err);
});

backendProcess.on('exit', (code) => {
  console.log(`[Backend] Exited with code ${code}`);
});

setTimeout(() => {
  console.log('\n[Expo] Starting Metro Bundler...\n');
  
  const expoProcess = spawn('npx', ['expo', 'start'], {
    cwd: __dirname,
    stdio: 'inherit',
    env: {
      ...process.env,
      EXPO_PACKAGER_PROXY_URL: `https://${process.env.REPLIT_DEV_DOMAIN}`,
      REACT_NATIVE_PACKAGER_HOSTNAME: process.env.REPLIT_DEV_DOMAIN
    },
    shell: true
  });

  expoProcess.on('error', (err) => {
    console.error('[Expo] Failed to start:', err);
  });

  const cleanup = () => {
    console.log('\nShutting down...');
    backendProcess.kill('SIGTERM');
    expoProcess.kill('SIGTERM');
    process.exit(0);
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
  
}, 2000);

console.log('[Backend] Starting on port 8082...');
