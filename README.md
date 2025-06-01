
## Mock Mode (for UI Development & Testing)

This project includes a UI-only "mock mode" that allows developers to run the application without needing a live backend. When enabled, it bypasses authentication and provides mock data for all API interactions.

### How to Enable/Disable Mock Mode

Mock mode is controlled by the `NEXT_PUBLIC_MOCK_MODE` environment variable.

1.  Ensure you have a `.env` file in the root of the project (you can copy `.env.example` if it doesn't exist).
2.  Set the variable in your `.env` file:
    ```env
    NEXT_PUBLIC_MOCK_MODE=true   # To enable mock mode
    # NEXT_PUBLIC_MOCK_MODE=false  # To disable mock mode (or remove the line)
    ```
3.  **Restart your Next.js development server** (`pnpm dev`) after changing this variable for the changes to take full effect, especially for server-side mocking.

### How it Works

Mock mode utilizes **Mock Service Worker (MSW)** to intercept outgoing API requests from the **client-side**. Server-side API calls are currently **not** mocked (see important limitation note below). Instead of hitting a real API endpoint, MSW returns predefined mock responses.

-   **Authentication:** When mock mode is active, authentication checks in the middleware are bypassed, allowing you to access protected routes as if you were logged in with a mock user.
-   **API Data:** All data fetched by the application will be sourced from the mock handlers.
    **IMPORTANT LIMITATION:** As of the current implementation, mock mode primarily supports **client-side API mocking**. API calls made from the server (e.g., during server-side rendering, in Server Components, or server actions) are **not** mocked by MSW and will attempt to reach the live backend. This is due to a build issue encountered with server-side MSW setup. Client-side requests (e.g., from `useEffect` hooks or after client-side navigation) are correctly mocked.

### Mock Data and Handlers

Mock API handlers and the data they return are defined in:
```
mocks/handlers.ts
```

This file contains:
-   **Request Handlers:** Functions that specify how MSW should respond to specific API routes (e.g., `GET /api/v1/items`, `POST /api/v1/users/login`).
-   **Mock Data:** Sample data (e.g., lists of items, user objects) that is returned by these handlers.

The handlers use the `NEXT_PUBLIC_API_BASE_URL` environment variable to construct the full API paths they intercept. Ensure this variable is correctly set in your `.env` file (it should match the `API_BASE_URL` used by the actual backend).

### Extending or Modifying Mocks

If you need to:
-   Add mocks for new API endpoints.
-   Change the data returned by existing mocks.
-   Modify the behavior of a mock handler.

You will need to edit `mocks/handlers.ts`.

**Example:** To add a new mock for an endpoint `GET /api/v1/products`:

```typescript
// In mocks/handlers.ts
import { http, HttpResponse } from 'msw';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

const mockProducts = [
  { id: 'prod_1', name: 'Mock Product 1', price: 19.99 },
  // ... more products
];

export const handlers = [
  // ... existing handlers
  http.get(`${API_BASE}/api/v1/products`, () => {
    console.log('[MSW] Intercepted GET /api/v1/products');
    return HttpResponse.json(mockProducts);
  }),
];
```

Remember to define the structure of your mock data to match what the frontend components expect. After modifying `mocks/handlers.ts`, a server restart might be needed if the changes affect server-side rendering or server actions, although MSW should generally pick up changes to handlers hot during development for client-side requests.
