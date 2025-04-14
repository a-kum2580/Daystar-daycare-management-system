# Daystar Daycare Management System - Project Structure

```
daystar-daycare-management-system/
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── favicon.ico
│   │   └── assets/
│   │       ├── images/
│   │       └── fonts/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   ├── children/
│   │   │   │   ├── ChildList.jsx
│   │   │   │   ├── ChildForm.jsx
│   │   │   │   └── ChildDetails.jsx
│   │   │   ├── parents/
│   │   │   │   ├── ParentList.jsx
│   │   │   │   ├── ParentForm.jsx
│   │   │   │   └── ParentDetails.jsx
│   │   │   ├── babysitters/
│   │   │   │   ├── BabysitterList.jsx
│   │   │   │   ├── BabysitterForm.jsx
│   │   │   │   └── BabysitterDetails.jsx
│   │   │   ├── attendance/
│   │   │   │   ├── AttendanceList.jsx
│   │   │   │   └── AttendanceForm.jsx
│   │   │   ├── financial/
│   │   │   │   ├── PaymentList.jsx
│   │   │   │   ├── PaymentForm.jsx
│   │   │   │   └── BudgetList.jsx
│   │   │   ├── incidents/
│   │   │   │   ├── IncidentList.jsx
│   │   │   │   └── IncidentForm.jsx
│   │   │   ├── notifications/
│   │   │   │   └── NotificationList.jsx
│   │   │   └── common/
│   │   │       ├── Header.jsx
│   │   │       ├── Footer.jsx
│   │   │       ├── Sidebar.jsx
│   │   │       └── LoadingSpinner.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Children.jsx
│   │   │   ├── Parents.jsx
│   │   │   ├── Babysitters.jsx
│   │   │   ├── Attendance.jsx
│   │   │   ├── Financial.jsx
│   │   │   ├── Incidents.jsx
│   │   │   └── Settings.jsx
│   │   ├── services/
│   │   │   ├── api.config.js
│   │   │   └── api.js
│   │   ├── utils/
│   │   │   ├── auth.js
│   │   │   ├── validation.js
│   │   │   └── helpers.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   └── useForm.js
│   │   ├── styles/
│   │   │   ├── App.css
│   │   │   └── components/
│   │   ├── App.jsx
│   │   └── index.js
│   ├── package.json
│   └── README.md
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── config.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Child.js
│   │   │   ├── Parent.js
│   │   │   ├── Babysitter.js
│   │   │   ├── Attendance.js
│   │   │   ├── Payment.js
│   │   │   ├── Budget.js
│   │   │   ├── Incident.js
│   │   │   └── Notification.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── childController.js
│   │   │   ├── parentController.js
│   │   │   ├── babysitterController.js
│   │   │   ├── attendanceController.js
│   │   │   ├── paymentController.js
│   │   │   ├── budgetController.js
│   │   │   ├── incidentController.js
│   │   │   └── notificationController.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── childRoutes.js
│   │   │   ├── parentRoutes.js
│   │   │   ├── babysitterRoutes.js
│   │   │   ├── attendanceRoutes.js
│   │   │   ├── paymentRoutes.js
│   │   │   ├── budgetRoutes.js
│   │   │   ├── incidentRoutes.js
│   │   │   └── notificationRoutes.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── error.js
│   │   │   └── validation.js
│   │   ├── utils/
│   │   │   ├── helpers.js
│   │   │   └── validators.js
│   │   └── server.js
│   ├── package.json
│   └── README.md
│
├── database/
│   └── migrations/
│       ├── 001_initial_schema.sql
│       └── 002_seed_data.sql
│
└── README.md
```

## Directory Structure Explanation

### Frontend

- **public/**: Static files and assets
- **src/components/**: Reusable React components organized by feature
- **src/pages/**: Main page components
- **src/services/**: API service configurations and methods
- **src/utils/**: Utility functions and helpers
- **src/context/**: React context providers
- **src/hooks/**: Custom React hooks
- **src/styles/**: CSS styles and component-specific styles

### Backend

- **src/config/**: Configuration files for database and application
- **src/models/**: Database models and schemas
- **src/controllers/**: Business logic and request handling
- **src/routes/**: API route definitions
- **src/middleware/**: Express middleware functions
- **src/utils/**: Utility functions and helpers

### Database

- **migrations/**: SQL migration files for database setup and updates

This structure follows best practices for a full-stack application, separating concerns and organizing code by feature. Each major feature (children, parents, babysitters, etc.) has its own set of components, controllers, and routes.
