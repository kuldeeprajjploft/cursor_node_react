# Node.js + MySQL Users CRUD API

Simple Express API with MySQL for **users create / list / get / update / delete**.

## Requirements

- Node.js 18+ (or 20+)
- MySQL (XAMPP MySQL is fine)

## Setup

### 1) Create DB + table

In phpMyAdmin (or MySQL CLI), run the SQL in `schema.sql`.

Default DB name used in this repo: `testing_node_crud`.

### 2) Install dependencies

```bash
npm install
```

### 3) Create your `.env`

This environment blocks committing `.env.example`, so use `env.example` as a template and create a **real** `.env` file in the project root:

```
PORT=3001
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=testing_node_crud
```

### 4) Run the API

```bash
npm run dev
```

Health check:

`GET http://localhost:3001/health`

## React frontend (same project)

The React app lives in `client/` and calls the API using `fetch("/api/...")`.

### Run frontend only

```bash
cd client
npm run dev
```

Frontend URL (default): `http://localhost:5173`

### Run backend + frontend together

From the project root:

```bash
npm run dev:all
```

## API Endpoints

Base URL: `/api/users`

### Create user

`POST /api/users`

Body:

```json
{ "name": "John", "email": "john@example.com", "age": 25 }
```

### List users

`GET /api/users`

### Get user by id

`GET /api/users/:id`

### Update user

`PUT /api/users/:id`

Body (any of these fields):

```json
{ "name": "New Name", "age": 30 }
```

### Delete user

`DELETE /api/users/:id`

## Quick cURL Examples (PowerShell-friendly)

Create:

```bash
curl -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d "{\"name\":\"John\",\"email\":\"john@example.com\",\"age\":25}"
```

List:

```bash
curl http://localhost:3000/api/users
```

Get by id:

```bash
curl http://localhost:3000/api/users/1
```

Update:

```bash
curl -X PUT http://localhost:3000/api/users/1 -H "Content-Type: application/json" -d "{\"name\":\"John Updated\"}"
```

Delete:

```bash
curl -X DELETE http://localhost:3000/api/users/1
```

