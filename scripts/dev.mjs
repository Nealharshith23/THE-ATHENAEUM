import { spawn } from 'node:child_process';

const isWindows = process.platform === 'win32';

const children = [
  spawn(process.execPath, ['server/server.js'], { stdio: 'inherit' }),
  spawn(isWindows ? 'vite.cmd' : 'vite', ['--host', '127.0.0.1'], { stdio: 'inherit', shell: false })
];

function stop() {
  for (const child of children) child.kill();
}

process.on('SIGINT', () => {
  stop();
  process.exit(0);
});

process.on('SIGTERM', () => {
  stop();
  process.exit(0);
});
