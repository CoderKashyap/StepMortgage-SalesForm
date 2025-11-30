# Mortgage Apply Form with Salesforce Integration

An interactive mortgage application form built with React (Vite) and Node.js/Express, featuring guided steps, smooth animations, and real-time Salesforce lead integration using jsforce.

## Features

- Step-by-step animated mortgage form
- Multiple-choice & input-based questions
- Progress tracking and smooth transitions
- Real-time lead submission to Salesforce (jsforce)
- Fully responsive UI (React + Vite)


## Tech Stack

- **Frontend:** React, Vite, JavaScript, CSS
- **Backend:** Node.js, Express.js
- **Integration:** jsforce (Salesforce API)


## Project Structure
```bash
root/
│── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│   └── server.js
│
└── frontend/
    ├── public/
    ├── src/
    ├── index.html
    └── package.json
```

## Setup Instructions

1. Install dependencies
```bash   
cd backend && npm install
cd ../frontend && npm install
```

3. Configure environment

```bash 
Create the following:

backend/config/config.env

SF_USERNAME=your_username
SF_PASSWORD=your_password+security_token
SF_LOGIN_URL=https://login.salesforce.com

frontend/.env

VITE_API_URL=http://localhost:5000
```


3. Start servers

### Backend
cd backend
npm start

### Frontend
cd frontend
npm run dev


 ## Salesforce Integration
All form submissions are automatically sent to Salesforce as Leads using the jsforce library.
