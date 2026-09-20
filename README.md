# FitFlow Redesign

## Project Overview

FitFlow Redesign is a cross-platform, AI-powered fitness tracking application developed for the **IT3060 Human Computer Interaction Lab Exercise 05**.

The project focuses on redesigning a fitness application with an improved user experience while integrating intelligent features for personalized fitness and nutrition tracking.

The redesigned application includes:

* AI-powered personalized workout plans
* Nutrition tracking using camera-based recognition
* Community challenges and social interaction
* Offline workout tracking
* User authentication and profile management
* Push notifications

---

## Technology Stack

### Frontend

* React Native
* JavaScript
* React Navigation

### Backend

* Node.js
* Express.js
* MongoDB Atlas

### Authentication & Cloud Services

* Firebase Authentication
* Firebase Firestore
* Firebase Cloud Messaging

### AI & Machine Learning

* TensorFlow Lite
* ML Kit
* AI-based workout recommendation
* Camera-based nutrition recognition

---

## Key Features

### AI Personalized Workout Plans

Generates personalized workout recommendations based on user information, fitness goals, and activity requirements.

### Nutrition Tracking

Allows users to capture food images using the device camera and use recognition technologies to assist with nutrition tracking.

### Community Challenges

Provides a community-oriented experience where users can participate in fitness challenges and interact with other users.

### Offline Workout Tracking

Allows users to continue recording workout activities when an internet connection is unavailable.

### User Authentication

Provides secure registration, login, and user account management.

### Push Notifications

Provides reminders and updates related to workouts, challenges, and other application activities.

---

## Project Structure

```text
fitflow-redesign/
│
├── frontend/
│   ├── src/
│   ├── assets/
│   ├── components/
│   ├── screens/
│   └── navigation/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── services/
│
├── ai-service/
│   ├── models/
│   ├── workout-engine/
│   ├── nutrition-recognition/
│   └── tensorflow-lite/
│
├── docs/
│   ├── architecture/
│   ├── comparison/
│   └── wireframes/
│
├── .github/
│   └── workflows/
│
└── README.md
```

---

## Architecture

The application follows a modular architecture consisting of three main application layers:

1. **Frontend** – React Native mobile application responsible for the user interface and interaction.
2. **Backend** – Node.js and Express.js server responsible for API endpoints, business logic, authentication-related operations, and database communication.
3. **AI Service** – Responsible for intelligent workout recommendations and nutrition recognition functionality.

Supporting services such as Firebase and MongoDB Atlas are integrated according to the requirements of each application component.

The detailed architecture documentation is available in:

* `docs/architecture/architecture-diagram.md`
* `docs/architecture/architecture-decision-record.md`

---

## Documentation

The `docs` directory contains project documentation including:

### Technology Comparison

`docs/comparison/technology-comparison-matrix.md`

Contains the comparison of candidate technologies and the rationale for selected technologies.

### Architecture Documentation

`docs/architecture/architecture-diagram.md`

Describes the overall system architecture and communication between major components.

`docs/architecture/architecture-decision-record.md`

Documents important architectural decisions and the reasoning behind them.

### UI/UX Documentation

`docs/wireframes/`

Contains wireframes, user flows, and other UI/UX design documentation.

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd fitflow-redesign
```

### 2. Frontend

```bash
cd frontend
npm install
npm start
```

### 3. Backend

```bash
cd backend
npm install
npm run dev
```

### 4. AI Service

The AI service will contain the components required for workout recommendation and nutrition recognition.

Configuration and setup instructions will be added as the AI service implementation is completed.

---

## Environment Variables

Environment-specific configuration should be stored in `.env` files and should **not be committed to the repository**.

Example configuration may include:

```env
MONGODB_URI=
FIREBASE_CONFIG=
API_URL=
```

Actual credentials and API keys should be kept private.

---

## Development Workflow

The project uses Git for version control and GitHub for repository management.

The `.github/workflows/` directory contains GitHub Actions workflows for automated development and validation tasks.

---

## Academic Context

**Module:** IT3060 – Human Computer Interaction

**Activity:** Lab Exercise 05

**Project:** FitFlow Redesign

---

## License

This project was developed for academic purposes.
