CMS API Documentation

Base URL: http://localhost:3000/api
Content-Type: application/json
Auth: Bearer Token (JWT)

Authentication Module

1. Register
   POST /auth/register
   Request body:

{
"name": "admin",
"email": "admin@gmail.com",
"password": "admin123"
}

Response 201 Created:

{
"success": true,
"message": "User registered successfully.",
"data": {
"user": {
"id": 1,
"name": "admin",
"email": "admin@google.com",
"created_at": "2026-03-01T10:35:20.585Z"
},
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBnb29nbGUuY29tIiwiaWF0IjoxNzcyMzYxMzIwLCJleHAiOjE3NzI5NjYxMjB9.rCRp5uC7IgliDsvrp271bYfUQp7wCwlcVsA7k3ZbJ48"
}
}

Response 409 Conflict (Email sudah terdaftar):

{
"success": false,
"message": "Email already registered."
}

2. Login
   POST /auth/login

Request body:
{
"email": "admin@google.com",
"password": "admin123"
}

Response 200 OK:

{
"success": true,
"message": "Login successful.",
"data": {
"user": {
"id": 1,
"name": "admin",
"email": "admin@google.com"
},
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBnb29nbGUuY29tIiwiaWF0IjoxNzcyMzYxNDY5LCJleHAiOjE3NzI5NjYyNjl9.D_sXTyFogk-I_dxotfHKcDw1DwC_1eSY99n5nYBhobE"
}
}

Response 401 Unauthorized:

{
"success": false,
"message": "Invalid email or password."
}

Content Management Module

Headers(untuk endpoint protected)
Authorization: Bearer <token>

3. Get All Content (List + Search + Pagination)
   GET /contents

http://localhost:3000/api/contents?page=1&limit=5&search=Judul_artikel_2

Response 200 OK:
{
"success": true,
"message": "Content created successfully.",
"data": {
"id": 4,
"title": "Judul Artikel 2",
"body": "Lorem ipsum dolor sir amet.....",
"status": "published",
"user_id": 1,
"created_at": "2026-03-01T10:56:16.143Z",
"updated_at": "2026-03-01T10:56:16.143Z"
}
}

4. Post Content
   POST /contents/

{
"title": "Judul Artikel 1",
"body": "Lorem ipsum dolor sir amet.....",
"status": "draft"
}

Response 200 OK:

{
"success": true,
"message": "Content created successfully.",
"data": {
"id": 2,
"title": "Judul Artikel 1",
"body": "Lorem ipsum dolor sir amet.....",
"status": "draft",
"user_id": 1,
"created_at": "2026-03-01T10:49:40.871Z",
"updated_at": "2026-03-01T10:49:40.871Z"
}
}

5. Update Content
   PUT /contents/:id

{
"title": "Judul Artikel 1",
"body": "Lorem ipsum dolor sir amet.....",
"status": "published"
}

Response 200 OK:

{
"success": true,
"message": "Content updated successfully.",
"data": {
"id": 2,
"title": "Judul Artikel 1",
"body": "Lorem ipsum dolor sir amet.....",
"status": "published",
"user_id": 1,
"created_at": "2026-03-01T10:49:40.871Z",
"updated_at": "2026-03-01T10:53:00.427Z"
}
}

6. Update Content
   DELETE /contents/:id

Response 200 OK:

{
"success": true,
"message": "Content deleted successfully."
}

7. Get Content by ID
   GET /contents/:id

{
"success": true,
"data": {
"id": 4,
"title": "Judul Artikel 2",
"body": "Lorem ipsum dolor sir amet.....",
"status": "published",
"user_id": 1,
"created_at": "2026-03-01T10:56:16.143Z",
"updated_at": "2026-03-01T10:56:16.143Z",
"author_name": "admin"
}
}
