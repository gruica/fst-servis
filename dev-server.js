const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting FST Servis Development Environment...\n');

// Start backend API server
console.log('📦 Starting Backend API (port 3000)...');
const backend = spawn('node', ['server.js'], {
  cwd: '/home/runner/workspace',
  env: { ...process.env, NODE_ENV: 'production' }
});

backend.stdout.on('data', (data) => {
  console.log(`[BACKEND] ${data}`);
});

backend.stderr.on('data', (data) => {
  console.error(`[BACKEND ERROR] ${data}`);
});

backend.on('error', (err) => {
  console.error('Backend failed to start:', err);
});

// Give backend time to start, then start frontend
setTimeout(() => {
  console.log('\n📱 Starting Frontend (Expo)...\n');
  const frontend = spawn('npm', ['run', 'dev'], {
    cwd: '/home/runner/workspace',
    env: {
      ...process.env,
      EXPO_PACKAGER_PROXY_URL: `https://${process.env.REPLIT_DEV_DOMAIN}`,
      REACT_NATIVE_PACKAGER_HOSTNAME: process.env.REPLIT_DEV_DOMAIN,
      EXPO_PUBLIC_API_URL: 'http://localhost:3000'
    },
    stdio: 'inherit'
  });

  frontend.on('error', (err) => {
    console.error('Frontend failed to start:', err);
  });

  process.on('SIGINT', () => {
    console.log('\n\n🛑 Shutting down...');
    backend.kill();
    frontend.kill();
    process.exit(0);
  });
}, 2000);
