import ngrok from '@ngrok/ngrok';

const listener = await ngrok.forward({
  addr: 5173,
  authtoken_from_env: true,
  pooling_enabled: true, // allows restart while previous tunnel still online (ERR_NGROK_334)
});

const url = listener.url();
console.log('');
console.log('ngrok tunnel active:');
console.log('  Public URL:', url);
console.log('');
console.log('Share this URL to access the app from another device.');
console.log('Press Ctrl+C to stop the tunnel.');
console.log('');

// Keep the process alive - without this, Node exits and the tunnel goes offline (ERR_NGROK_3200)
// process.stdin.resume() may not work when run in background; use interval as fallback
process.stdin.resume();
const keepAlive = setInterval(() => {}, 86400000); // 24h - prevents exit
process.on('SIGINT', () => {
  clearInterval(keepAlive);
  process.exit(0);
});
