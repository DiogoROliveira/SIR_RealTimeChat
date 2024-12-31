# Real-Time Chat System

A real-time chat application built with Vue.js and Node.js that enables users to communicate in public and private rooms with instant message updates.

## Features

-   **User Authentication**

    -   Secure registration and login with JWT
    -   User profile customization with avatars and information about themselves

-   **Room Management**

    -   Create and delete public/private chat rooms
    -   Browse available rooms
    -   Join rooms with capacity control
    -   Private room access via access code system

-   **Real-Time Messaging**
    -   Instant message delivery using WebSocket technology
    -   Message history persistence
    -   User presence notifications (join/leave/kick events)

## Tech Stack

This project was developed using the **MEVN Tech Stack** (MongoDB, Express.js, Vue.js, Node.js)

<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=mongodb,express,vue,nodejs&theme=dark" />
  </a>
</p>

### Frontend

-   Vue.js 3
-   Vite
-   Socket.IO Client
-   Vue Router for navigation
-   Custom components for UI elements

### Backend

-   Node.js with Express
-   MongoDB for data persistence
-   Socket.IO for real-time communication
-   JWT for authentication
-   Custom middleware for route protection

## Installation

### Prerequisites

-   Node.js (v16 or higher)
-   MongoDB instance
-   npm or yarn package manager

### Backend Setup

1. Navigate to the backend directory:

```bash
cd Backend
```

2. Install dependencies:

```bash
npm install
```

3. Navigate to the /src directory:

```bash
cd src
```

4. Create a .env file with the following variables:

```js
PORT = 3000;
MONGODB_URI = your_mongodb_connection_string;
JWT_SECRET = your_jwt_secret;
```

5. Start the server:

```bash
npm start
```

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd Frontend
```

2. Install dependencies:

```bash
npm install
```

3. Change API_URL in [Dashboard.vue](/Frontend/src/components/Dashboard.vue) to match Node server URL:

```js
API_URL = `http://localhost:3000`;
```

4. Start the development server:

```bash
npm run dev
```

## Project Structure

### Backend

-   `src/models/` - Database schemas and models
-   `src/utils/` - Utility functions, middleware and routes
-   `src/server.js` - Main application entry point

### Frontend

-   `src/components/` - Vue components
-   `src/router/` - Route definitions
-   `src/assets/` - Static assets
-   `src/utils/` - Helper functions

### File Tree

```sv
|__ Backend
|    |__ /src
|    |    |__ /models
|    |    |__ /utils
|    |    |__ .env
|    |    |__ server.js
|    |__ .gitignore
|    |__ package-lock.json
|    |__ package.json
|
|__ Frontend
|    |__ /public
|    |__ /src
|    |    |__ /assets
|    |    |__ /components
|    |    |    |__ /icons
|    |    |    |__ /utils
|    |    |    |__ Vue Components
|    |    |__ /router
|    |    |__ App.vue
|    |    |__ main.js
|    |__ .gitignore
|    |__ index.html
|    |__ jsconfig.json
|    |__ package-lock.json
|    |__ package.json
|    |__ README.md
|    |__ vite.config.js
|
|__ .gitignore
|__ ENUNCIADO.md
|__ package-lock.json
|__ package.json
|__ README.en.md
|__ README.md
```

## API Endpoints

### Authentication

-   `POST /register` - User registration
-   `POST /login` - User login
-   `GET /user` - Fetch information about logged in user
-   `PUT /user/profile` - Updates user information

### Rooms

-   `GET /rooms` - Get all rooms that the logged in user is in
-   `POST /rooms` - Create new room
-   `DELETE /rooms/:roomId` - Delete room
-   `POST /rooms/:roomId/join` - Join room
-   `POST /rooms/:accessCode/joinP` - Join private room through access code
-   `POST /rooms/:roomId/leave` - Leave room
-   `POST /rooms/:roomId/kick` - Kick user from room

### Messages

-   `GET /rooms/:id/messages` - Get room message history

## Deployment

The application is deployed on render.com. Both Frontend and Backend are deployed on the same URL since the Backend serves the Frontend's static files:

-   App URL: [URL to be added]

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Authors

-   Diogo Rosas Oliveira (29950)
-   David Gonçalo Gomes Reis (29216)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.

## Acknowledgments

-   Professor Pedro Miguel Moreira for project guidance
-   IPVC for providing the development environment
-   Documentation and inspiration from similar open-source projects

This but in Portuguese [README](README.md).
