<div align="center">

# film-react-nest 🎬

### Film Catalog · Fullstack App

*browse and discover films — from database to UI, full stack*

![TypeScript](https://img.shields.io/badge/TypeScript-1e1e2e?style=for-the-badge&logo=typescript&logoColor=a6e3a1)
![React](https://img.shields.io/badge/React-1e1e2e?style=for-the-badge&logo=react&logoColor=a6e3a1)
![NestJS](https://img.shields.io/badge/NestJS-1e1e2e?style=for-the-badge&logo=nestjs&logoColor=a6e3a1)
![MongoDB](https://img.shields.io/badge/MongoDB-1e1e2e?style=for-the-badge&logo=mongodb&logoColor=a6e3a1)

</div>

---

## 📋 about

A fullstack film catalog application. React frontend communicates with a NestJS REST API backed by MongoDB.

<!-- Add a screenshot or GIF here -->
<!-- ![demo](link-to-screenshot) -->

## 🛠️ tech stack

**Frontend**
- React + TypeScript
- REST API integration

**Backend**
- NestJS + TypeScript
- MongoDB + Mongoose
- REST API

## 🚀 getting started

**Backend:**

```bash
cd backend
cp .env.example .env
# set DATABASE_DRIVER=mongodb and DATABASE_URL in .env

npm ci
npm run start:debug
```

**Frontend:**

```bash
cd frontend
npm ci
npm start
```

> MongoDB must be running before starting the backend.
> Seed the DB: run `test/mongodb_initial_stub.js` in mongo console.

---

<div align="center">
<sub>Yandex Practicum · Fullstack Developer</sub>
</div>
