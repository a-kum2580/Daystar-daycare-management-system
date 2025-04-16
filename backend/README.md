# Daystar Daycare Center Backend API

This is the backend API for the Daystar Daycare Center management system.

## Setup Instructions

1. Clone the repository
2. Install dependencies:
```
cd backend
npm install
```
3. Create a `.env` file in the backend directory using the `.env.example` as a template
   - **Important:** If your MySQL installation has no password, leave the DB_PASSWORD field empty:
   ```
   DB_PASSWORD=
   ```
4. Set up the database (MySQL):
```
# Create database (you must create this manually)
CREATE DATABASE daystar_daycare;

CREATE USER 'daystar_user'@'localhost' IDENTIFIED BY 'daystar123';

GRANT ALL PRIVILEGES ON daystar_daycare.* TO 'daystar_user'@'localhost';

FLUSH PRIVILEGES;
```
5. Run the development server:
```
npm run dev
```

> **Note:** The database must be created manually before running the application. Once created, the application will automatically set up the tables and initial data. Make sure MySQL is installed and running, and update your `.env` file with the correct database credentials.

## Database Migrations

The application uses Sequelize migrations to manage database schema changes. The following migrations are available:

### Users Table
- Primary key: `id` (auto-incrementing integer)
- Fields: email, password, firstName, lastName, role, phoneNumber, address
- Indexes: email (unique), role, createdAt

### Babysitters Table
- Primary key: `id` (UUID)
- Foreign key: `userId` references Users(id)
- Fields: nin, dateOfBirth, nextOfKinName, nextOfKinPhone, nextOfKinRelationship, status, paymentRate, childrenAssigned, lastPaymentDate
- Indexes: userId, nin (unique), status, dateOfBirth

### Children Table
- Primary key: `id` (UUID)
- Foreign keys: `parentId` references Users(id), `babysitterId` references Babysitters(id)
- Fields: firstName, lastName, dateOfBirth, gender, sessionType, emergencyContactName, emergencyContactPhone, emergencyContactRelationship, medicalNotes, allergies, specialNeeds, medications, dietaryRestrictions, enrollmentDate, status
- Indexes: parentId, babysitterId, status, enrollmentDate, dateOfBirth

### Attendances Table
- Primary key: `id` (UUID)
- Foreign key: `recordedById` references Users(id)
- Fields: date, personId, personType, checkInTime, checkOutTime, status, notes
- Indexes: date, personId, personType, status, recordedById
- Unique constraint: (date, personId, personType)

### Incidents Table
- Primary key: `id` (UUID)
- Foreign keys: `childId` references Children(id), `reportedById` references Users(id), `notifiedById` references Users(id)
- Fields: incidentType, date, time, description, actionTaken, severity, followUpRequired, followUpNotes, parentNotified, notificationTime, status
- Indexes: childId, date, incidentType, severity, status, reportedById, notifiedById

### Running Migrations

To run migrations:
```
npx sequelize-cli db:migrate
```

To undo migrations:
```
npx sequelize-cli db:migrate:undo
```

To undo all migrations:
```
npx sequelize-cli db:migrate:undo:all
```

## Troubleshooting

### Common Errors

1. **MODULE_NOT_FOUND Error**
   - This may occur if you're trying to use routes that haven't been implemented yet.
   - Currently, only the auth and test routes are fully implemented.
   - Other route files will be added in future updates.

2. **Database Connection Error**
   - Make sure MySQL is running on your machine
   - Verify your database credentials in the `.env` file
   - For MySQL with no password, leave the DB_PASSWORD field completely empty in your `.env` file
   - Ensure the database has been created manually before starting the app
   - Try connecting to MySQL manually to verify your credentials: `mysql -u root` (if no password)

3. **JWT Token Issues**
   - If authentication isn't working, check that JWT_SECRET is properly set in your `.env` file
   - Token expiration is set to 24h by default, which can be changed in the `.env` file

## Authentication

The system implements JWT-based authentication with two user roles:

- **Admin**: Has full access to all features and can manage users
- **Babysitter**: Has limited access to features based on their role

Upon first run, the system creates default admin and babysitter accounts:

- **Admin User**:
  - Email: admin@daystar.com
  - Password: admin123

- **Test Babysitter**:
  - Email: babysitter@daystar.com
  - Password: babysitter123

### Authentication Endpoints

- `POST /api/auth/login`: Authenticate user and get token
- `GET /api/auth/me`: Get current user details (requires auth)
- `PUT /api/auth/change-password`: Change user's password (requires auth)

### Admin-Only Endpoints

- `POST /api/auth/register`: Create a new user (admin only)
- `PUT /api/auth/reset-password`: Reset another user's password (admin only)
- `GET /api/auth/users`: Get all users (admin only)
- `PUT /api/auth/toggle-user-status/:id`: Activate/deactivate a user (admin only)

## Testing

### Test Endpoints

To test the API functionality, use the following test endpoints:

- `GET /api/test/public`: Public endpoint (no auth required)
- `GET /api/test/protected`: Protected endpoint (requires authentication)
- `GET /api/test/admin`: Admin-only endpoint (requires admin role)
- `GET /api/test/error`: Error simulation endpoint

### Health Check

- `GET /api/health`: API health check endpoint

## Authorization

The API uses middleware to protect routes:

- `verifyToken`: Ensures a valid authentication token is provided
- `isAdmin`: Checks if the authenticated user has admin role
- `isBabysitter`: Checks if the authenticated user has babysitter role

## API Response Format

Responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ] // Optional validation errors
}
```

