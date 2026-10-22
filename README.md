# SupportFlow AI — MERN-Based AI Support System

> **“We are building a MERN-based AI-powered support system that automates ticket classification, prioritization, and routing to improve efficiency and reduce manual workload.”**

---

## 🌟 Overview & Key Highlights

SupportFlow AI is a modern full-stack support ticket management platform built with the MERN architecture. It features a built-in NLP AI Engine that automatically analyzes support inquiries, categorizes them, calculates confidence metrics, determines urgency/priority, and routes tickets to the appropriate department.

- 🤖 **Real-Time AI Classification**: Predicts Category, Urgency Priority, and Assigned Department with confidence score meters as users type their tickets.
- 👨‍💼 **Admin Command Center**: Interactive metrics dashboard, category distributions, priority trackers, keyword signal filters, inline status updater, and ticket inspection modals.
- 👤 **Employee Portal**: Dedicated ticket submission form, preset scenario buttons, status tracking, and scoped ticket access.
- 🧪 **AI Classifier Lab / Testbed**: Interactive sandbox with sample benchmarks (Database 500 Outages, Billing disputes, MFA lockouts, Feature Requests) to inspect NLP decisions in real-time.
- 💎 **Modern Aesthetics**: Built with glassmorphism, responsive cards, micro-animations, Google Fonts (`Inter` & `Outfit`), and dark theme.

---

## 🏗️ Architecture & Technology Stack

| Component | Technology | Description |
|---|---|---|
| **Frontend** | React.js (Vite), Lucide Icons, Vanilla CSS | Fast, reactive SPA with glassmorphism UI and zero external UI bloat |
| **Backend** | Node.js, Express.js, JWT, bcryptjs | RESTful API layer with role-based auth and ticket workflows |
| **Database** | MongoDB / Mongoose + Zero-Config Persistent Fallback | Seamless connection to MongoDB Atlas / local `mongod`, plus auto-seeded persistent store |
| **AI Engine** | Tokenized TF-IDF & Heuristic NLP Classifier | Tokenization, weighted keyword matching, urgency signals & department routing |

---

## ⚡ Quick Demo Accounts

For evaluation, you can use the **1-Click Role Switcher** buttons in the navbar, or sign in manually:

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Admin** | `admin@supportflow.ai` | `admin123` | View all tickets, update statuses/priorities, view company analytics |
| **Employee** | `user@supportflow.ai` | `user123` | Submit tickets, view live AI preview, track own tickets |

---

## 🚀 Running the Project Locally

### 1. Prerequisites
- **Node.js** v18+ installed

### 2. Start the Backend Server
```powershell
cd "c:\FSD Project"
node server/server.js
```
The server will start on **`http://localhost:5000`**.

### 3. Start the Frontend Client
In a new terminal window:
```powershell
cd "c:\FSD Project\client"
npm.cmd run dev
```
The client will launch on **`http://localhost:3000`** with automatic API proxying.

---

## 📡 API Reference

### 🔐 Authentication
- `POST /api/auth/register` — Create a new account (`name`, `email`, `password`, `role`)
- `POST /api/auth/login` — Sign in and receive JWT token
- `GET /api/auth/me` — Retrieve current authenticated user profile

### 🎫 Support Tickets
- `POST /api/tickets` — Create a ticket (automatically runs AI classification & routing)
- `GET /api/tickets` — List tickets (filterable by `category`, `priority`, `status`, `search`)
- `GET /api/tickets/:id` — Retrieve single ticket details and discussion timeline
- `PUT /api/tickets/:id` — Update ticket status, priority, or assignee
- `POST /api/tickets/:id/comments` — Add a comment or internal note
- `DELETE /api/tickets/:id` — Delete a ticket (Admin only)

### 🤖 AI Engine
- `POST /api/classify` — Submit `{ title, description }` to receive:
  ```json
  {
    "category": "Technical",
    "priority": "High",
    "confidence": 0.94,
    "assignedTeam": "Engineering & DevOps",
    "matchedKeywords": ["database", "500", "error"],
    "reasoning": "Urgent keywords detected with high operational impact."
  }
  ```
- `GET /api/ai/categories` — List all category definitions and routing targets

### 📊 Analytics
- `GET /api/analytics/stats` — Real-time metrics: Total tickets, open/resolved count, resolution rate %, category breakdown, and average confidence.

---

## 📋 Categories & Routing Teams

1. **Technical** ➔ *Engineering & DevOps* (Errors, 500 timeouts, bugs, database, latency)
2. **Billing** ➔ *Finance & Accounts* (Invoices, duplicate charges, refunds, subscriptions)
3. **Account Access** ➔ *Identity & Security* (2FA reset, password lockout, SSO)
4. **Feature Request** ➔ *Product Management* (Enhancements, new features, dark mode)
5. **General Inquiry** ➔ *Customer Success* (Documentation, guides, how-to questions)

---

## 🔮 Future Enhancements
- 🔄 WebSockets for real-time ticket triage live updates
- 🤖 Auto-reply AI draft generation for agents
- 🌐 Multilingual NLP translation for global support
- ⏱️ SLA prediction & auto-escalation timer
