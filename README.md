## Description

Invoice Management System - Nest.js/Node Hybrid Server (REST, GraphQL, RabbitMQ).


## Installation

```bash
$ npm install
```

## Running the server

To Run the server, provide a PostgreSQL database and set it's URL in the app.config.ts file - DATABASE_URL.

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## To run Tests

```bash
# unit tests
$ npm run test

```

## RabbitMQ Setup
Run RabbitMQ using Docker:
```bash
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:management
```
Access the RabbitMQ management UI at **`http://localhost:15672`**  
(Default credentials: `guest/guest`)


## Swagger Documentation

Visit https://localhost:3500/docs for Swagger Documentation



# Invoice Management System (IMS) - Documentation

## 📌 Overview
The **Invoice Management System (IMS)** is a full-stack application that enables:
- **Clients** to upload/search/edit invoices and receive real-time status updates.
- **Admins** to search/manage invoices, process them, and view reports/dashboard.

👉 **REST APIs** for CRUD operations  
👉 **GraphQL APIs** for analytics&reporting  
👉 **RabbitMQ for real-time notifications**  
👉 **WebSockets for instant invoice status updates to clients**  
👉 **PostgreSQL for data persistence**  
👉 **Next.js frontend for an interactive UI**  

---

## 📂 Application Architecture
The system follows the **Controller-Service-Repository** pattern for clean separation of concerns.

### **Backend (NestJS)**
- **Authentication Module**: Handles admin/client login via JWT.
- **User Module**: Manages admin/user role accounts.
- **Invoice Module**: CRUD operations for invoices (REST).
- **Reports Module**: Fetches invoice/user reports (GraphQL) with internal caching.
- **Notifications Module/Microservice**: Uses RabbitMQ for event-driven notifications.
- **Notification WebSocket Gateway**: Sends real-time updates via WebSockets.

### **Frontend (Next.js)**
- **Authentication** (Login page for both admin and non-admin users).
- **Dashboard** (Admin view for user and invoices reports).
- **Admin Invoices Page** (Admin view, searches invoices and updates invoice statuses).
- **Admin User Pages** (Admin views and creates users).
- **Client Invoices Pages** (Clients can search and manage invoices).
- **Client Add/Edit Invoice Pages** (Clients can add new invoices and edit old ones).
- **Notification Menu** (Real-time updates using WebSockets).

👉 **State management**: Zustand  
👉 **API calls**: `openapi-fetch`, `openapi-typescript`  
👉 **UI Framework**: TailwindCSS  

---

## 💪 Design Patterns Used
- **Controller-Service-Repository**: Separation of concerns for maintainability.
- **Dependency Injection**: Ensures flexibility and easier testing.
- **Pub/Sub Pattern**: Uses RabbitMQ for decoupled event handling.
- **GraphQL Query Separation**: REST for invoices & User management, GraphQL for reports.
- **WebSockets for Real-Time Updates**: Only updates relevant users.

---

## 🚀 Setup Instructions
### **1⃣ Clone Repository**
```bash
git clone https://github.com/Chudalu/invoice-management-api
cd invoice-management-api
```
```bash
git clone https://github.com/Chudalu/invoice-management-app
cd invoice-management-app
```

### **2⃣ Backend Setup (NestJS)**
```bash
cd invoice-managment-api
npm install
```

#### **Configure Environment Variables**
``` 
check out the app.config.ts file, update the DATABASE_URL field. The rest can be left the same.
if you change the CLIENT_ENCRYPTION_KEY, ensure to change it in the Next.js Frontend's app.config.ts
```

#### **Start Server**
```bash
npm run start:dev
```
- Database models are automatically synced and created on the DB. 

**Backend will be running on** `http://localhost:3500`

---

### **3⃣ RabbitMQ Setup**
Run RabbitMQ using Docker:
```bash
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:management
```
Access the RabbitMQ management UI at **`http://localhost:15672`**  
(Default credentials: `guest/guest`)

---

### **4⃣ Frontend Setup (Next.js)**
```bash
cd invoice-management-app
npm install
```

#### **Start Frontend**
```bash
npm run dev
```
**Frontend will be running on** `http://localhost:3000`

---

## 🛠️ RabbitMQ Setup Explanation
The application uses **RabbitMQ** for real-time **Pub/Sub** messaging.

1. **Admin updates invoice status** → Event `invoice.status.updated` is published.
3. **Notification Service listens for these events** → Sends WebSocket notifications via a Websocket gateway.

This ensures **decoupled communication** between microservices.

---

## 🛠️ Testing Approach
### **✅ Backend (NestJS)**
- **Unit Tests (Jest)**:  
  ```bash
  npm run test
  ```
---

## 📊 Scalability Considerations
### **Backend Scalability**
- **Horizontal Scaling**: Each service (Auth, Invoices, Notifications) can be containerized separately.
- **Database Optimization**: Indexing on frequently queried fields as seen on the invoice search filters (e.g., `title`, `invoiceStatus` etc.).
- **RabbitMQ Load Handling**: Durable queues to prevent message loss under high load.

### **For better Frontend Scalability**
- **Code-Splitting & Lazy Loading**: Faster load times for large datasets.
- **Optimized State Management**: `openapi-fetch` utilizing its caching capabilities.


## **🎯 Summary**
👉 **Well-structured, scalable Invoice Management System**  
👉 **Uses best practices (Pub/Sub, WebSockets, REST+GraphQL)**  
👉 **Optimized for real-time updates and performance**  
👉 **Fully tested**  


## Stay in touch

- Author - [Chudalu Ezenwafor](https://chudaluezenwafor.com)
- Twitter - [@chudalu](https://twitter.com/chudalu)