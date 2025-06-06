// instrumentation.ts (Server-side MSW part is disabled due to build issues)
export async function register() {
  if (process.env.NEXT_PUBLIC_MOCK_MODE === 'true') {
    console.log('[Instrumentation] Detected mock mode, initializing MSW for Node.js server...');
    // Ensure the path to msw is correct based on your project structure
    ///    const { initMsw } = await import('./app/lib/msw');
    ///    await initMsw();
    console.log('[Instrumentation] MSW initialized for Node.js server.');
  } else {
    // console.log('[Instrumentation] Mock mode is not enabled. MSW will not be started for the server.');
  }
}
