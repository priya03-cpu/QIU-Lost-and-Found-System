# QIU Campus Lost & Found System

A web-based Lost & Found Management System for Quest International University.

Update project documentation

## Features
- Submit Lost item report
- Submit Found item report
- View Lost items listing
- View Found items listing
- View item details
- Admin: update status (Active / Claimed / Resolved)
- Admin: delete report

## Tech Stack
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Database: MySQL

## Setup (Local)
1. Install dependencies:
   npm install
2. Create MySQL database:
   - Create database: `campus_lost_found`
   - Create table: `items`
3. Create `.env` file (use `.env.example` as reference)
4. Run the server:
   npm start
5. Open:
   http://localhost:3000

## Security
- Server-side validation
- Sanitization
- Parameterized queries (SQL Injection protection)
- Basic XSS prevention (escape output)
- `.env` for secrets 
System updated with improved CRUD functionality