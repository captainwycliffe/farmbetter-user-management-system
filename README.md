# Simplified User Management System with WhatsApp-like Webhook Integration

## Project Overview
This project is a **User Management System** with a **Webhook Integration** using **NestJS**, **Firestore**, and **TypeScript**. The goal was to build a system that manages users efficiently while simulating WhatsApp-like webhook message processing.

## Features
### 1. **User Management Module**
- **User creation, retrieval, updating** with Firestore integration.
- **Efficient querying** (pagination, uniqueness checks, indexing).
- **Input validation** using NestJS Pipes and DTOs.
- **Error handling** with global exception filters.

### 2. **Webhook Module**
- **Receives webhook events** simulating WhatsApp messages.
- **Validates requests** using a static token.
- **Processes messages** and stores them in Firestore.
- **Automated reply** if message contains "help".
- **Real-time updates** using Firestore `onSnapshot()`.
- **Rate limiting** (5 requests/min per phone number).

---

## Project Setup and Firestore Integration
- Initialized a **NestJS project** with a modular structure.
- Configured **Firestore** integration using Firebase Admin SDK.
<img src="https://i.imghippo.com/files/ASdl7459nLQ.png" alt="" border="0">

---

## User Management API Endpoints
### **1. Create User** (`POST /users`)
Creates a new user while ensuring **email uniqueness**.

**Endpoint:**
```
POST https://localhost:3000/users
```
**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890"
}
```
**Validation:** Uses NestJS DTOs.
```typescript
import { IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phone: string;
}
```

<img src="https://i.imghippo.com/files/ySV6955Cpk.png" alt="" border="0">

---

### **2. Fetch Users with Pagination** (`GET /users`)
Retrieves users efficiently using **Firestore cursors**.

**Endpoint:**
```
GET https://localhost:3000/users?page=1&limit=10
```



---

### **3. Fetch Single User** (`GET /users/{id}`)
Retrieves a specific user by ID.

**Endpoint:**
```
GET https://localhost:3000/users/123
```
<img src="https://i.imghippo.com/files/vojR3288atQ.png" alt="" border="0">

---

### **4. Update User** (`PATCH /users/{id}`)
Updates user details **(email is immutable).**

**Endpoint:**
```
PATCH https://localhost:3000/users/123
```
**Request Body:**
```json
{
  "name": "John Updated",
  "phone": "+9876543210"
}
```
**Validation:**
```typescript
import { IsOptional, IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsPhoneNumber()
  phone?: string;
}
```
<img src="https://i.imghippo.com/files/KjB8581VVk.png" alt="" border="0">

---

## Webhook Module
### **Webhook Endpoint (`POST /webhook`)**
Simulates WhatsApp message processing.

**Endpoint:**
```
POST https://localhost:3000/webhook
```
**Request Body:**
```json
{
  "message": "Hello",
  "phone": "+1234567890"
}
```
**Validations:**
- Checks for **valid authorization token** (`Bearer SECRET_TOKEN`).
<img src="https://i.imghippo.com/files/kXBe5277tdM.png" alt="" border="0">

- Stores messages in **Firestore**.
<img src="https://i.imghippo.com/files/BMMd7814yAE.png" alt="" border="0">

- Sends **automated reply** if message contains "help".
<img src="https://i.imghippo.com/files/GF6889FIU.png" alt="" border="0">

- Implements **rate limiting** (5 requests/min per phone).
<img src="https://i.imghippo.com/files/Hhz6905hAk.png" alt="" border="0">

---

## Real-time Updates
- Uses **Firestore `onSnapshot()`** to listen for new messages.
- Updates frontend **in real-time** when new messages arrive.


---

## Security & Error Handling
- **Token validation** ensures secure webhook requests.
- **Exception filters** for Firestore and invalid payloads.

<img src="https://i.imghippo.com/files/nJB2189yg.png" alt="" border="0">

---

## Testing
### **Unit Tests**
- **Ensures user uniqueness** during creation.
- **Validates webhook token logic**.

### **End-to-End (E2E) Tests**
- **GET /users pagination** validation.
- **Webhook reply logic** (testing "help" response).

<img src="https://i.imghippo.com/files/Zpk7377wxQ.png" alt="" border="0">


## Installation Guide

### Prerequisites

Ensure your system meets the following requirements:

- **Node.js** (v16+ recommended)
- **npm** (v8+ recommended) or **yarn**
- **Postman** (for API testing)

### Step 1: Clone the Repository

```bash
git clone https://github.com/captainwycliffe/farmbetter-user-management-system.git
cd farmbetter-user-management-system
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Firebase

1. Create a `.env` file and add the following environment variables:

```
FIREBASE_PROJECT_ID="farm-better-assesment"
FIREBASE_PRIVATE_KEY='firebase-private-key'
PORT=3000
WEBHOOK_SECRET_TOKEN='webhook-secret-key'

```

### Step 4: Run the Application

#### Development Mode (with auto-reload for changes)

```bash
npm run start:dev
```

#### Production Mode

```bash
npm start
```

### Step 5: Verify Running Application

Once the app is running, verify it by checking:

- **API is running on**: `http://localhost:3000`
- **Firestore database is accessible**

---

## Testing the APIs using Postman

### 1. User Management API

#### a) Create a User (POST /users)

- **URL**: `http://localhost:3000/users`
- **Method**: POST
- **Body (JSON format)**:
  ```json
  {
    "name": "John Doe",
    "email": "johndoe@example.com",
    "phone": "+1234567890"
  }
  ```
- **Expected Response (201 Created)**:
  ```json
  {
    "id": "generatedUserId",
    "name": "John Doe",
    "email": "johndoe@example.com",
    "phone": "+1234567890"
  }
  ```

#### b) Fetch All Users (GET /users)

- **URL**: `http://localhost:3000/users`
- **Method**: GET
- **Expected Response (200 OK)**:
  ```json
  [
    {
      "id": "generatedUserId",
      "name": "John Doe",
      "email": "johndoe@example.com",
      "phone": "+1234567890"
    }
  ]
  ```

#### c) Fetch a Single User (GET /users/{id})

- **URL**: `http://localhost:3000/users/generatedUserId`
- **Method**: GET
- **Expected Response (200 OK)**:
  ```json
  {
    "id": "generatedUserId",
    "name": "John Doe",
    "email": "johndoe@example.com",
    "phone": "+1234567890"
  }
  ```

#### d) Update User (PATCH /users/{id})

- **URL**: `http://localhost:3000/users/generatedUserId`
- **Method**: PATCH
- **Body (JSON format)**:
  ```json
  {
    "name": "John Updated"
  }
  ```
- **Expected Response (200 OK)**:
  ```json
  {
    "id": "generatedUserId",
    "name": "John Updated",
    "email": "johndoe@example.com",
    "phone": "+1234567890"
  }
  ```

---

### 2. Webhook API

#### a) Send a Webhook Message (POST /webhook)

- **URL**: `http://localhost:3000/webhook`
- **Method**: POST
- **Headers**:
  - `Authorization`: `Bearer SECRET_TOKEN`
- **Body (JSON format)**:
  ```json
  {
    "message": "Hello",
    "phone": "+1234567890"
  }
  ```
- **Expected Response (200 OK)**:
  ```json
  {
    "success": true
  }
  ```

#### b) Automated Reply for Help Requests

- **URL**: `http://localhost:3000/webhook`
- **Method**: POST
- **Headers**:
  - `Authorization`: `Bearer SECRET_TOKEN`
- **Body (JSON format)**:
  ```json
  {
    "message": "help",
    "phone": "+1234567890"
  }
  ```
- **Expected Response (200 OK)**:
  ```json
  {
    "reply": "Support contact: support@company.com"
  }
  ```

---

## Running Tests

Run unit tests to verify API behavior:

```bash
npm run test
```

Run end-to-end tests for full API workflow:

```bash
npm run test:e2e
```

---

## Troubleshooting

### Common Issues & Fixes

1. **Firebase Admin SDK Errors**

   - Ensure the Firebase credentials JSON file is correctly referenced in `.env`.
   - Restart the app after setting the correct path.

2. **Webhook Authorization Failures**

   - Use the correct **Bearer Token** in the `Authorization` header.
   - Ensure the token matches the one in the `.env` file.

3. **Postman Requests Not Working**

   - Check if the API is running on `localhost:3000`.
   - Use the correct HTTP methods (`GET`, `POST`, `PATCH`).

---

## Conclusion

This guide covers everything needed to install, run, and test the project locally. Let me know if you need additional modifications! 🚀



