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

