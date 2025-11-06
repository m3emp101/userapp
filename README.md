# MERN Todo App

A full-stack Todo application built with the MERN stack (MongoDB, Express, React, Node.js). The backend exposes a RESTful API for creating, reading, updating, and deleting todos, while the frontend provides a responsive interface for end users.

## Project Structure

- `server/` – Express + Mongoose API server
- `client/` – React single-page application built with Vite

## Prerequisites

- Node.js 18+
- npm 9+
- A MongoDB instance (local or hosted). You can use [MongoDB Atlas](https://www.mongodb.com/atlas/database) for a free cloud database or run MongoDB locally via Docker.

## 1. Backend Setup (`server/`)

```bash
cd server
npm install
cp .env.example .env
# then edit .env to point MONGODB_URI at your MongoDB instance
npm run dev
```

### Environment variables

- `MONGODB_URI` – connection string, e.g. `mongodb://127.0.0.1:27017/todo_app`
- `PORT` – optional (defaults to `4000`)
- `CLIENT_ORIGIN` – optional comma-separated list of allowed origins for CORS

### API Overview

Base URL: `http://localhost:4000/api`

| Method | Endpoint         | Description           |
| ------ | ---------------- | --------------------- |
| GET    | `/todos`         | List todos            |
| POST   | `/todos`         | Create a new todo     |
| PATCH  | `/todos/:id`     | Update an existing todo |
| DELETE | `/todos/:id`     | Remove a todo         |

#### Example usage with `curl`

```bash
# Create a todo
curl -X POST http://localhost:4000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Ship MERN demo","dueDate":"2025-11-08"}'

# List todos
curl http://localhost:4000/api/todos

# Toggle completion
curl -X PATCH http://localhost:4000/api/todos/<TODO_ID> \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'

# Delete
curl -X DELETE http://localhost:4000/api/todos/<TODO_ID>
```

## 2. Frontend Setup (`client/`)

```bash
cd client
npm install
cp .env.example .env
# If you are running the backend on a different host/port, update VITE_API_BASE_URL
npm run dev
```

The development server runs at `http://localhost:5173` by default and proxies API calls to the backend. If you deploy the backend separately, set `VITE_API_BASE_URL` to the deployed API base.

## Using the App

1. Start the backend (`npm run dev` inside `server/`).
2. Start the frontend (`npm run dev` inside `client/`).
3. Open the browser at the URL that Vite prints (usually `http://localhost:5173`).
4. Create todos with the form, toggle them complete using the checkboxes, and delete them with the `Delete` button. Filtering controls let you view all, active, or completed items.

## Production Build

```bash
cd client
npm run build
# Static assets output to client/dist

cd server
npm run start # ensure NODE_ENV=production and MongoDB are configured
```

Deploy the frontend build (`client/dist`) to any static host and the backend to your preferred Node environment. Configure `VITE_API_BASE_URL` in the frontend build time environment to point at the deployed backend.

## Troubleshooting

- **Cannot connect to MongoDB**: Verify the `MONGODB_URI`, ensure MongoDB is running, and that your IP is allow-listed if using Atlas.
- **CORS errors**: Set `CLIENT_ORIGIN` in the server `.env` to the origin of the frontend (e.g. `CLIENT_ORIGIN=http://localhost:5173`).
- **API 404 from frontend**: Check that both servers are running and that `VITE_API_BASE_URL` (or the dev proxy) matches the backend URL.

## License

MIT
