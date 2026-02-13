# AI Receptionist Web App

A frontend-driven AI receptionist website that integrates:
- VAPI AI Agent (web call / voice support)
- n8n-based automation (via webhooks)
- Firebase Authentication (frontend)
- Firebase Firestore (frontend, optional)
- Built with Vite + React + Tailwind CSS

---

## Tech Stack

- React (Vite)
- Tailwind CSS
- VAPI Web SDK (OpenAi ChatGPT 40-mini model)
- Firebase (Auth + Firestore)
- n8n (Webhook-based automation), Google Sheets, Google Calender, Google Gmail integrated.
- Deployed on Vercel

---

## Project Structure

```
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── src
│   ├── App.jsx
│   ├── index.css
│   ├── firebase.js
│   ├── vapi.js
│   ├── components
│   │   ├── main.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   └── Signup.jsx
└── README.md
```

---

## Prerequisites
```
- Node.js >= 18
- npm or pnpm
- Firebase project (Auth enabled)
- VAPI account & public key
- n8n instance with webhook enabled
```
---

## Project Setup

### 1. Create Vite + React App
```
npm create vite@latest ai-receptionist -- --template react
cd ai-receptionist
npm install
```
---

### 2. Install Dependencies
```
npm install
npm install -D tailwindcss postcss autoprefixer
npm install firebase
npm install @vapi-ai/web
npm install react-router-dom
```
---

### 3. Tailwind CSS Setup
```
npx tailwindcss init -p

tailwind.config.js

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {}
  },
  plugins: []
}

src/index.css

@tailwind base;
@tailwind components;
@tailwind utilities;
```
---

### 4. Firebase Configuration
```
src/firebase.js

import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
```
---

### 5. VAPI SDK Setup
```
src/vapi.js

import Vapi from "@vapi-ai/web"

const vapi = new Vapi(import.meta.env.VITE_VAPI_PUBLIC_KEY)

export default vapi
```
---

### 6. Environment Variables
```
Create .env file in root

VITE_FIREBASE_API_KEY=xxxx
VITE_FIREBASE_AUTH_DOMAIN=xxxx
VITE_FIREBASE_PROJECT_ID=xxxx
VITE_FIREBASE_STORAGE_BUCKET=xxxx
VITE_FIREBASE_MESSAGING_SENDER_ID=xxxx
VITE_FIREBASE_APP_ID=xxxx

VITE_VAPI_PUBLIC_KEY=xxxx
VITE_N8N_WEBHOOK_URL=https://your-n8n-domain/webhook/ai-receptionist
```
---

## n8n Automation Flow

- Trigger: Webhook node (POST)
- Input: Call metadata / user intent from frontend
- Processing: Business logic, CRM, notifications, logging
- Response: JSON output returned to frontend or VAPI tool

Example payload sent from frontend:
```
{
  "caller": "web",
  "intent": "appointment_booking",
  "timestamp": 1710000000
}
```
---

## Application Flow

1. User opens static website
2. User logs in or continues without login
3. User starts AI call using VAPI web SDK
4. VAPI agent invokes n8n webhook as a tool
5. n8n processes request and responds
6. AI receptionist continues conversation

---

## Development
```
npm run dev
```
---

## Build for Production
```
npm run build
```
Output will be generated in the dist/ folder

---

## Deployment

- Deploy dist/ to any static hosting provider
- Examples:
  - Vercel
  - Netlify
  - Firebase Hosting
  - Cloudflare Pages

---

## Security Notes

- Firebase Auth handled fully on frontend
- Firestore rules must restrict access by auth.uid
- VAPI public key exposed intentionally (browser SDK)
- n8n webhook should validate incoming requests

---

## CREDITS
- Built under NxtWave X OpenAi Acedemy buildathon
