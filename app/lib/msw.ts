// app/lib/msw.ts
export async function initMsw() {
  if (process.env.NEXT_PUBLIC_MOCK_MODE === 'true') {
    if (typeof window === 'undefined') {
      console.log('[MSW] Server-side mocking is currently disabled due to build issues with msw/node.');
      // The following block is commented out to allow the build to pass.
      // console.log('[MSW] Initializing MSW for Node.js environment (server-side).');
      // try {
      //   // Attempt dynamic import only when truly needed
      //   const { server } = await import('../../mocks/server'); // server imports msw/node
      //   server.listen({ onUnhandledRequest: 'bypass' });
      //   console.log('[MSW] MSW server listener started for Node.js.');
      // } catch (error) {
      //   console.error('[MSW] Failed to initialize msw/node:', error);
      // }
    } else {
      console.log('[MSW] Initializing MSW for browser environment.');
      // Using await import for browser setup as well for consistency
      const { worker } = await import('../../mocks/browser');
      await worker.start({ onUnhandledRequest: 'bypass' });
      console.log('[MSW] MSW worker started for browser.');
    }
  }
}
