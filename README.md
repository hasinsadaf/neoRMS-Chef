# neoRMS Chef Frontend

## Purpose

This service is the Chef-facing web client for neoRMS. It provides authenticated chef users with a real-time order board, order status workflows, and profile management.

## Responsibilities

- Authenticate chef users and enforce Chef-only route access.
- Display and manage restaurant orders in `CONFIRMED`, `PREPARING`, and `READY` states.
- Sync order lifecycle changes in real time using Socket.IO events.
- Update chef profile and password via backend user endpoints.
- Attach auth token and tenant context to outgoing API requests.

## Tech Stack

- React 19 + Vite 7
- React Router 7
- Axios (HTTP client)
- Socket.IO Client (real-time events)
- Tailwind CSS 4
- ESLint 9

## Project Structure

```text
src/
	components/
		auth/           # Login card/form UI
		chef/           # Order card + order detail panel
		layout/         # Chef navbar and shell layout
		routing/        # Route guard for chef auth
		ui/             # Shared panel components
	context/
		AuthContext.jsx     # Auth/session state
		OrdersContext.jsx   # In-memory orders state
		SocketContext.tsx   # Socket connection + event handling
	pages/
		auth/Login.jsx      # Chef sign-in page
		chef/OrdersBoard.jsx# Chef dashboard board
		chef/ChefProfile.jsx# Chef profile page
	services/
		api.js              # Axios instance + interceptors
		auth.js             # Login API calls
		order.js            # Order APIs
		profile.js          # User/chef profile APIs
		socket.js           # Socket emit helpers
	constants.js          # Environment-based URLs + socket event names
```

## Setup / Installation

### Prerequisites

- Node.js 18+ (Node.js 20 recommended)
- npm 9+

### Install dependencies

```bash
npm install
```

## Configuration

Create a `.env` file in the repository root:

```bash
VITE_API_URL=http://localhost:8080
VITE_SOCKET_URL=http://localhost:8080
```

### Required environment variables

- `VITE_API_URL`: Base URL for REST API requests (used by Axios client).
- `VITE_SOCKET_URL`: Base URL for Socket.IO connection.

## Running the Service

### Development

```bash
npm run dev
```

Starts the Vite dev server (default: `http://localhost:5173`).

### Production build

```bash
npm run build
npm run preview
```

## API / Interfaces

This frontend consumes backend HTTP endpoints and Socket.IO events.

### HTTP endpoints consumed

- `POST /auth/login/chef`
- `POST /auth/refresh-token`
- `GET /user/me`
- `PATCH /user/me`
- `GET /order/restaurant-orders/:restaurantId`
- `GET /order/:id`
- `PUT /order/:orderId/status`
- `POST /order/:orderId/pay`
- `GET /restaurant/:restaurantId`

All requests use:

- `Authorization: Bearer <token>` (when logged in)
- `x-tenant-id: <tenantId>` (when available)

### Socket.IO events handled

Inbound events listened by this service:

- `orderConfirmed`
- `orderInProgress`
- `orderDelivered`
- `orderCancelled`
- `socketError`

Outbound events emitted by helper service:

- `acceptOrder`
- `completeOrder`
- `scanAttendance`
- `updateOrderProgress`

## Related Services

This service depends on backend services for data and real-time coordination:

- Authentication service for chef login and token refresh.
- User/Profile service for `/user/me` reads and updates.
- Order service for order listing, detail retrieval, and status transitions.
- Restaurant service for restaurant metadata.
- Socket gateway/service for order lifecycle events across clients.

This repository does not manage backend persistence; it is a client application that consumes those services.
