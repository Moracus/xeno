# Mini CRM Platform

A Mini CRM platform designed for campaign management, customer data ingestion, and AI-driven insights. This tool allows businesses to create audience segments, deliver campaigns, and analyze performance effectively.

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Local Setup Instructions](#local-setup-instructions)
4. [Architecture Diagram](#architecture-diagram)
5. [Summary of AI Tools and Other Tech Used](#summary-of-ai-tools-and-other-tech-used)
6. [Known Limitations or Assumptions](#known-limitations-or-assumptions)

---

## Features

### Core Functionality
- **Data Ingestion APIs**: Secure REST APIs to ingest customer and order data.
- **Campaign Creation UI**: Interactive drag-and-drop query builder to define audience segments based on flexible rules.
- **Campaign Delivery**: Simulates campaign delivery using a dummy API and logs success/failure.
- **Authentication**: Google OAuth 2.0-based login for secure access.

### AI Integration
- **Natural Language Query Generation**: Converts natural language into structured audience segment rules.


---

## Tech Stack

**Frontend**
- Framework: React.js
- State Management: React Hooks
- UI Library: XYFlow (for query builder)

**Backend**
- Framework: Node.js (Express.js)
- Database: MongoDB
- AI Integration: Deepseek R1 inference API to generate queries

---

## Local Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- npm or yarn
- MongoDB (Local or Atlas)

### Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-repo/crm-platform.git
   cd xeno
2. **Install Dependencies**
   ```bash
   cd backend
   npm install
   cd frontend
   npm install
3. **Setup Enviroment variables**
   create a .ENV file in frontend and backend
  - *Backend varialbes:-*
   ```bash
     MONGO_URL=
    GOOGLE_CLIENT_ID= 
    FRONTEND_URL=
    JWT_SECRET= 
    HF_TOKEN =
   ```
  Note :- you can get the hf token from hugging face.
  - *Frontend Variables:-*
  ```bash
  VITE_BACKENDURL= 
  VITE_GOOGLE_CLIENT_ID=
```
4. **Run the application**
   -*Start the Backend*
   ```npm run dev```
   -*Start the Frontend*
   ```npm run dev```
5. **Access the application:-**
     - go to ```http://localhost:5173```
  
# Architecture
```
┌───────────────┐
│    Frontend   │
│ React + XYFlow│
│ (Campaign UI) │
└───────┬───────┘
        │
┌───────▼─────────┐
│    Backend      │
│ Node.js (Express│
│ REST APIs, AI)  │
└───────┬─────────┘
        │
┌───────▼─────────┐
│   Database      │
│ MongoDB         │
└─────────────────┘
```
   


