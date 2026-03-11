**Doctor License Verification & Application System**

**Candidate Information**

**Full Name:**  Kethidi Rajinikar Reddy

**Email ID:** rajinikarkethidi@gmail.com

**College Name:** Geethanjali College Of Engineering And Technology

**Selected Skill Track:** Java & API Development


****Project Overview****
The Doctor License Verification & Application System is a web application that allows the public to verify whether a doctor is legitimately licensed by a medical authority.

Doctors can also apply for verification, track their applications, and receive official login credentials after their documents are verified by the government authority.

**The platform provides:**

1. Public doctor verification

2. Doctor application submission

3. Government document verification

4. Application tracking

5. QR code verification

6. Emergency prescription support

7. Real-time API-based doctor search
   
8.QR scan activity logging

****Key Features****

**Doctor Search (Autocomplete)**
Users can search doctors by:

Doctor Name

License Number

Specialization

The system shows real-time search suggestions after typing two characters.

**Public Doctor Verification**
Users can verify doctors using:

1. Doctor name search

2. License number search

3. QR code scanning

The system displays:

1. Doctor Name

2. Specialization

3. License Number

4. Verification Status

5. License Expiry Date

**Doctor Application System**
Doctors can submit verification applications including:

1. Personal information

2. Specialization

3. License number

4. Medical documents

Each application receives a unique Application ID for tracking.

**Government Verification Process**

Government administrators verify doctor applications through the following process:

1. Doctor submits application

2. Documents are verified

3. Verification date is scheduled

4. Application is approved or rejected

Once approved:

1. Doctor profile is created

2. QR code is generated

3. Login credentials are issued

**QR Code Verification**

Each verified doctor receives a unique QR code.

Scanning the QR code redirects to:

/doctor/{licenseNumber}

The page displays doctor verification details instantly.

All scan activities are recorded in the database.

**Emergency Prescription System**

Verified doctors can issue emergency prescriptions including:

1. Patient Name

2. Symptoms

3. Medication

4. Dosage instructions

5. Emergency level

All prescriptions are stored securely.



****Technology Stack****

**Backend**

1. ava 17

2. Spring Boot

3. Spring Security

4. Spring Data JPA

5. Hibernate

**Database**

1. H2 Database (Development)

2. PostgreSQL compatible

**Frontend**

1. Thymeleaf

2. Bootstrap 5

3. JavaScript

**Security**

1. JWT Authentication

2. BCrypt Password Encryption

**Libraries**

1. Xing (QR Code generation)

**Testing**

1. JUnit 5

2. Mockito

3. Spring Boot Test

****API Endpoints****

**Public APIs**

Search doctors

GET /api/public/search?q=

Doctor details

GET /api/public/doctor/{licenseNumber}

QR code

GET /api/public/qr/{licenseNumber}

**Doctor APIs**

Submit application

POST /api/doctor/apply

Track application

GET /api/doctor/application/{applicationId}

Create emergency prescription

POST /api/doctor/prescription

**Admin APIs**

Admin login

POST /api/admin/auth/login

View applications

GET /api/admin/applications

Verify documents

POST /api/admin/verify-document

Approve application

POST /api/admin/approve

Reject application

POST /api/admin/reject

## Default Login Credentials

| Username        | Password    | Role           |
|-----------------|-------------|---------------|
| System Admin    | password123 | Administrator |
| Dr. John Smith  | password123 | Doctor        |
| Dr. Priya Sharma| password123 | Doctor        |
| Dr. Ahmed Khan  | password123 | Doctor        |

****Project Workflow****

Doctor submits application
↓
Government verifies documents
↓
Verification scheduled
↓
Application approved
↓
Doctor account created
↓
QR code generated
↓
Public verification enabled


