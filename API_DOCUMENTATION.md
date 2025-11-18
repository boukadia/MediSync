# MediSync API Documentation

## Overview
MediSync is a comprehensive medical management system API that handles appointments, consultations, prescriptions, laboratory orders, and pharmacy management.

**Base URL:** `http://localhost:3000/api`
**Swagger UI:** `http://localhost:3000/api-docs`

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## User Roles
- `admin`: Full system access
- `doctor`: Medical professionals
- `patient`: Patients
- `laboratoire`: Laboratory staff
- `pharmacy`: Pharmacy staff
- `secretaire`: Secretary/receptionist

## API Endpoints

### 🔐 Authentication (`/api/auth`)

#### Register User
```http
POST /api/auth/register
```
**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "patient",
  "phone": "0123456789",
  "specialite": "Cardiology", // for doctors
  "address": "123 Main St",
  "dateNaissance": "1990-01-01",
  "Sexe": "M"
}
```

#### Login
```http
POST /api/auth/login
```
**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Validate Token
```http
GET /api/auth/validate
```
**Headers:** `Authorization: Bearer <token>`

#### Logout
```http
GET /api/auth/logout
```

#### Update Profile
```http
PUT /api/auth/profile
```
**Headers:** `Authorization: Bearer <token>`

#### Toggle User Status (Admin only)
```http
PUT /api/auth/status/:id
```
**Headers:** `Authorization: Bearer <token>`

#### Delete User (Admin only)
```http
DELETE /api/auth/profile/delete/:id
```
**Headers:** `Authorization: Bearer <token>`

---

### 📅 Appointments (`/api/appointments`)

#### Get All Appointments (Admin only)
```http
GET /api/appointments
```
**Headers:** `Authorization: Bearer <token>`

#### Get My Appointments
```http
GET /api/appointments/my
```
**Headers:** `Authorization: Bearer <token>`
**Roles:** `patient`, `doctor`

#### Create Appointment
```http
POST /api/appointments
```
**Headers:** `Authorization: Bearer <token>`
**Roles:** `patient`, `secretaire`
**Body:**
```json
{
  "doctorId": "60d0fe4f5311236168a109cb",
  "creneauId": "60d0fe4f5311236168a109cc",
  "date": "2023-08-10",
  "motif": "Consultation de routine"
}
```

#### Update Appointment
```http
PUT /api/appointments/:id
```
**Headers:** `Authorization: Bearer <token>`
**Roles:** `patient`, `secretaire`, `admin`

#### Cancel Appointment
```http
PUT /api/appointments/:id/cancel
```
**Headers:** `Authorization: Bearer <token>`

#### Delete Appointment
```http
DELETE /api/appointments/:id
```
**Headers:** `Authorization: Bearer <token>`

---

### 🏥 Consultations (`/api/consultations`)

#### Get Form Data (Doctor only)
```http
GET /api/consultations/form
```
**Headers:** `Authorization: Bearer <token>`
**Roles:** `doctor`

#### Get All Consultations (Admin only)
```http
GET /api/consultations
```
**Headers:** `Authorization: Bearer <token>`
**Roles:** `admin`

#### Get My Consultations
```http
GET /api/consultations/my
```
**Headers:** `Authorization: Bearer <token>`
**Roles:** `patient`, `doctor`

#### Get Consultations by Patient
```http
GET /api/consultations/patient/:patientId
```
**Headers:** `Authorization: Bearer <token>`
**Roles:** `doctor`, `admin`

#### Get Consultations by Doctor (Admin only)
```http
GET /api/consultations/doctor/:doctorId
```
**Headers:** `Authorization: Bearer <token>`
**Roles:** `admin`

#### Get Consultation by ID
```http
GET /api/consultations/:id
```
**Headers:** `Authorization: Bearer <token>`

#### Create Consultation (Doctor only)
```http
POST /api/consultations
```
**Headers:** `Authorization: Bearer <token>`
**Roles:** `doctor`
**Body:**
```json
{
  "patientId": "60d0fe4f5311236168a109ca",
  "appointmentId": "60d0fe4f5311236168a109cd",
  "diagnostic": "Grippe saisonnière",
  "prescription": "Paracétamol 1000mg, 3x par jour pendant 5 jours",
  "notes": "Patient à revoir dans une semaine si les symptômes persistent"
}
```

#### Update Consultation (Doctor only)
```http
PUT /api/consultations/:id
```
**Headers:** `Authorization: Bearer <token>`
**Roles:** `doctor`

#### Delete Consultation
```http
DELETE /api/consultations/:id
```
**Headers:** `Authorization: Bearer <token>`

---

### 💊 Prescriptions (`/api/prescriptions`)

#### Get My Prescriptions
```http
GET /api/prescriptions
```
**Headers:** `Authorization: Bearer <token>`
**Roles:** `doctor`, `admin`, `patient`

#### Get Prescription by ID
```http
GET /api/prescriptions/:id
```
**Headers:** `Authorization: Bearer <token>`
**Roles:** `doctor`, `admin`

#### Create Prescription (Doctor only)
```http
POST /api/prescriptions
```
**Headers:** `Authorization: Bearer <token>`
**Roles:** `doctor`
**Body:**
```json
{
  "patientId": "507f1f77bcf86cd799439011",
  "ConsultationId": "507f1f77bcf86cd799439013",
  "notes": "À prendre après les repas",
  "medications": [
    {
      "name": "Paracétamol",
      "dosage": "500mg",
      "instructions": "2 comprimés toutes les 8h",
      "duration": "7 jours"
    }
  ],
  "status": "signed"
}
```

#### Update Prescription (Doctor only)
```http
PUT /api/prescriptions/:id
```
**Headers:** `Authorization: Bearer <token>`
**Roles:** `doctor`

#### Delete Prescription (Doctor only)
```http
DELETE /api/prescriptions/:id
```
**Headers:** `Authorization: Bearer <token>`
**Roles:** `doctor`

#### Mark Medications as Dispensed (Pharmacy only)
```http
PUT /api/prescriptions/:id/medications
```
**Headers:** `Authorization: Bearer <token>`
**Roles:** `pharmacy`
**Body:**
```json
{
  "medicationIds": ["med1", "med2"]
}
```

---

### 🕐 Disponibilités (`/api/disponibilites`)

#### Get Doctor Availability
```http
GET /api/disponibilites
```

#### Create Availability (Doctor only)
```http
POST /api/disponibilites
```
**Headers:** `Authorization: Bearer <token>`
**Roles:** `doctor`

#### Update Availability (Doctor only)
```http
PUT /api/disponibilites/:id
```
**Headers:** `Authorization: Bearer <token>`
**Roles:** `doctor`

#### Delete Availability (Doctor only)
```http
DELETE /api/disponibilites/:id
```
**Headers:** `Authorization: Bearer <token>`
**Roles:** `doctor`

---

### 📋 Dossiers Médicaux (`/api/dossierMedicals`)

#### Get Medical Records
```http
GET /api/dossierMedicals
```
**Headers:** `Authorization: Bearer <token>`

#### Create Medical Record
```http
POST /api/dossierMedicals
```
**Headers:** `Authorization: Bearer <token>`

#### Update Medical Record
```http
PUT /api/dossierMedicals/:id
```
**Headers:** `Authorization: Bearer <token>`

#### Delete Medical Record
```http
DELETE /api/dossierMedicals/:id
```
**Headers:** `Authorization: Bearer <token>`

---

### 🏪 Pharmacies (`/api/pharmacies`)

#### Get Pharmacies
```http
GET /api/pharmacies
```

#### Create Pharmacy
```http
POST /api/pharmacies
```
**Headers:** `Authorization: Bearer <token>`

#### Update Pharmacy
```http
PUT /api/pharmacies/:id
```
**Headers:** `Authorization: Bearer <token>`

#### Delete Pharmacy
```http
DELETE /api/pharmacies/:id
```
**Headers:** `Authorization: Bearer <token>`

---

### 🧪 Laboratory Orders (`/api/labOrders`)

#### Get Lab Orders
```http
GET /api/labOrders
```
**Headers:** `Authorization: Bearer <token>`

#### Create Lab Order
```http
POST /api/labOrders
```
**Headers:** `Authorization: Bearer <token>`

#### Update Lab Order
```http
PUT /api/labOrders/:id
```
**Headers:** `Authorization: Bearer <token>`

#### Delete Lab Order
```http
DELETE /api/labOrders/:id
```
**Headers:** `Authorization: Bearer <token>`

---

### 🔬 Laboratoires (`/api/laboratoires`)

#### Get Laboratories
```http
GET /api/laboratoires
```

#### Create Laboratory
```http
POST /api/laboratoires
```
**Headers:** `Authorization: Bearer <token>`

#### Update Laboratory
```http
PUT /api/laboratoires/:id
```
**Headers:** `Authorization: Bearer <token>`

#### Delete Laboratory
```http
DELETE /api/laboratoires/:id
```
**Headers:** `Authorization: Bearer <token>`

---

### 🧪 Lab Order Tests (`/api/labOrderTests`)

#### Get Lab Order Tests
```http
GET /api/labOrderTests
```
**Headers:** `Authorization: Bearer <token>`

#### Create Lab Order Test
```http
POST /api/labOrderTests
```
**Headers:** `Authorization: Bearer <token>`

#### Update Lab Order Test
```http
PUT /api/labOrderTests/:id
```
**Headers:** `Authorization: Bearer <token>`

#### Delete Lab Order Test
```http
DELETE /api/labOrderTests/:id
```
**Headers:** `Authorization: Bearer <token>`

---

### 📊 Lab Results (`/api/labResults`)

#### Get Lab Results
```http
GET /api/labResults
```
**Headers:** `Authorization: Bearer <token>`

#### Create Lab Result
```http
POST /api/labResults
```
**Headers:** `Authorization: Bearer <token>`

#### Update Lab Result
```http
PUT /api/labResults/:id
```
**Headers:** `Authorization: Bearer <token>`

#### Delete Lab Result
```http
DELETE /api/labResults/:id
```
**Headers:** `Authorization: Bearer <token>`

---

### 📄 Documents (`/api/documents`)

#### Get Documents
```http
GET /api/documents
```
**Headers:** `Authorization: Bearer <token>`

#### Create Document
```http
POST /api/documents
```
**Headers:** `Authorization: Bearer <token>`

#### Update Document
```http
PUT /api/documents/:id
```
**Headers:** `Authorization: Bearer <token>`

#### Delete Document
```http
DELETE /api/documents/:id
```
**Headers:** `Authorization: Bearer <token>`

---

## Data Models

### User Schema
```javascript
{
  email: String (required, unique),
  name: String,
  phone: String,
  specialite: String, // for doctors
  address: String,
  horaires: String,
  numLicence: String,
  anneExperience: Number,
  PharmacyName: String,
  laboratoireName: String,
  dateNaissance: Date,
  Sexe: String,
  ContactUrgence: String,
  password: String (required),
  status: String (enum: ['active', 'inactive']),
  refreshToken: String,
  tokenExpiry: Date,
  role: String (enum: ['admin', 'doctor', 'patient', 'laboratoire', 'pharmacy', 'secretaire'])
}
```

### Appointment Schema
```javascript
{
  patientId: ObjectId (required),
  doctorId: ObjectId (required),
  creneauId: ObjectId (required),
  date: Date (required),
  status: String (enum: ['pending', 'confirmed', 'cancelled', 'completed']),
  motif: String
}
```

### Consultation Schema
```javascript
{
  patientId: ObjectId (required),
  doctorId: ObjectId (required),
  appointmentId: ObjectId (required),
  date: Date,
  diagnostic: String (required),
  prescription: String,
  notes: String
}
```

### Prescription Schema
```javascript
{
  patientId: ObjectId (required),
  doctorId: ObjectId (required),
  ConsultationId: ObjectId (required),
  notes: String,
  medications: [{
    name: String (required),
    dosage: String (required),
    instructions: String (required),
    duration: String (required),
    pharmacyId: ObjectId,
    status: String (enum: ['prescribed', 'dispensed'])
  }],
  status: String (enum: ['draft', 'signed'])
}
```

## Error Responses

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

### Error Response Format
```json
{
  "error": "Error message",
  "details": "Additional error details"
}
```

## Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env` file with:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/medisync
   JWT_SECRET=your_jwt_secret
   ```

3. **Start Server:**
   ```bash
   npm run dev
   ```

4. **Access Swagger Documentation:**
   Visit `http://localhost:3000/api-docs`

## Notes
- All timestamps are automatically managed by MongoDB
- Passwords are automatically hashed before storage
- JWT tokens are used for authentication
- Role-based access control is implemented throughout the API
- Swagger UI provides interactive API testing interface