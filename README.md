# Fullstack Movie Reservation System

## Overview

This project is a comprehensive fullstack application for managing movie reservations. The backend is built using Java with a Microservices architecture, and the frontend consists of two separate ReactJS projects: one for the user interface and one for the admin interface.

## Backend

The backend is composed of the following microservices:

1. **Auth Service**: Manages user authentication and authorization.
2. **Gateway Service**: Acts as an entry point to the system, routing requests to the appropriate microservice.
3. **Media Service**: Handles media content management, such as movie posters and trailers.
4. **Movie Service**: Manages movie-related data, including movie details and schedules.
5. **Registry Service**: Provides service discovery to ensure that microservices can locate each other.
6. **Reservation Service**: Manages reservations for movie tickets.
7. **Seat Service**: Manages seat availability and selection.

### Technologies Used

- **Java**
- **Spring Boot**
- **Spring Cloud** (for microservices and service discovery)
- **Eureka** (for service registry)

## Frontend

The frontend is divided into two separate projects:

1. **User Interface**: This ReactJS project provides the main interface for end users to browse movies, view details, make reservations, and manage their accounts.
2. **Admin Interface**: This ReactJS project provides an interface for administrators to manage movies, view reservations, and perform other administrative tasks.

### User Interface Features

- **Movie Browsing**: Browse and search for movies.
- **Movie Details**: View detailed information about movies.
- **Reservations**: Make and manage reservations.
- **Account Management**: Manage user account information.

### Admin Interface Features

- **Movie Management**: Add, update, and delete movies.
- **Reservation Management**: View and manage reservations.
- **User Management**: Manage user accounts.

### Technologies Used

- **ReactJS**
- **Redux** (for state management)
- **React Router** (for routing)
- **Axios** (for making API requests)

## Getting Started

### Prerequisites

- **Java 17**
- **Node.js**
- **npm or yarn**

### Installation

1. **Backend**:

   - Clone the repository and navigate to the backend directory.
   - Build the project using Maven: `mvn clean install`.

2. **Frontend**:
   - Clone the repository and navigate to the frontend directories (user and admin).
   - Install dependencies using npm or yarn: `npm install` or `yarn install`.
   - Start the development server: `npm start` or `yarn start`.

## Contributing

Contributions are welcome! Please fork the repository and submit pull requests for any enhancements or bug fixes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
