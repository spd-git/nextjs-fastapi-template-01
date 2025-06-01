import { http, HttpResponse } from 'msw';

// Use NEXT_PUBLIC_API_BASE_URL from env, fallback to a default if not set
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

// Define mock data
const mockUser = {
  id: 'mock-user-id',
  username: 'mockuser',
  email: 'mockuser@example.com',
  // Add other fields as expected by the frontend, e.g., from usersCurrentUser response
  // For example, if the actual API returns { "user": { ... } }, then mockUser should match that structure.
  // Based on usersCurrentUser usage in middleware, it seems to expect a direct user object or an error.
};

const mockItems: Array<{id: string, name: string, description: string, quantity: number, created_at?: string, updated_at?: string}> = [
  { id: 'item-1', name: 'Mock Item 1', description: 'This is a mock item from MSW', quantity: 100, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'item-2', name: 'Mock Item 2', description: 'Another mock item served by MSW', quantity: 50, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

let nextItemIdSuffix = 3;

export const handlers = [
  // Mock for user authentication check
  http.get(`${API_BASE}/api/v1/users/current_user`, ({ request }) => {
    console.log(`[MSW] Intercepted GET ${API_BASE}/api/v1/users/current_user`);
    // In mock mode, always return the mock user, simulating successful authentication
    return HttpResponse.json(mockUser);
  }),

  // Mock for fetching items
  http.get(`${API_BASE}/api/v1/items`, () => {
    console.log(`[MSW] Intercepted GET ${API_BASE}/api/v1/items`);
    return HttpResponse.json(mockItems);
  }),

  // Mock for adding an item
  http.post(`${API_BASE}/api/v1/items`, async ({ request }) => {
    console.log(`[MSW] Intercepted POST ${API_BASE}/api/v1/items`);
    const newItemData = await request.json() as { name: string; description: string; quantity: number };
    const newItem = {
      ...newItemData,
      id: `item-${nextItemIdSuffix++}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockItems.push(newItem);
    return HttpResponse.json(newItem, { status: 201 });
  }),

  // Mock for deleting an item
  http.delete(`${API_BASE}/api/v1/items/:item_id`, ({ params }) => {
    const itemId = params.item_id as string;
    console.log(`[MSW] Intercepted DELETE ${API_BASE}/api/v1/items/${itemId}`);
    const itemIndex = mockItems.findIndex(item => item.id === itemId);
    if (itemIndex > -1) {
      mockItems.splice(itemIndex, 1);
      return new HttpResponse(null, { status: 204 }); // No content
    }
    return HttpResponse.json({ detail: 'Item not found' }, { status: 404 });
  }),

  // Mock for login
  http.post(`${API_BASE}/api/v1/users/login`, async () => {
    console.log(`[MSW] Intercepted POST ${API_BASE}/api/v1/users/login`);
    return HttpResponse.json({ accessToken: 'mock-access-token-from-msw', token_type: 'bearer' });
  }),

  // Mock for password reset (assuming POST /api/v1/users/request_password_reset)
  http.post(`${API_BASE}/api/v1/users/request_password_reset`, async () => {
    console.log(`[MSW] Intercepted POST ${API_BASE}/api/v1/users/request_password_reset`);
    return new HttpResponse(null, { status: 200 }); // Simulate success
  }),

  // Mock for password reset confirmation (assuming POST /api/v1/users/reset_password)
  http.post(`${API_BASE}/api/v1/users/reset_password`, async () => {
    console.log(`[MSW] Intercepted POST ${API_BASE}/api/v1/users/reset_password`);
    return new HttpResponse(null, { status: 200 }); // Simulate success
  }),

  // Mock for registration (assuming POST /api/v1/users/register)
  http.post(`${API_BASE}/api/v1/users/register`, async ({request}) => {
    console.log(`[MSW] Intercepted POST ${API_BASE}/api/v1/users/register`);
    const body = await request.json() as { username: string, email: string };
    // console.log('[MSW] Registration data:', body);
    // Simulate successful registration
    return HttpResponse.json({
        id: 'new-mock-user-' + Date.now(),
        username: body.username,
        email: body.email,
        // ... other fields returned by your actual API on registration
    }, { status: 201 });
  }),
];
