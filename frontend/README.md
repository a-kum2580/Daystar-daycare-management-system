# Daystar Daycare Center Frontend

This is the frontend application for the Daystar Daycare Center management system. It's built with React, TypeScript, and Material-UI.

## Features

- User Authentication (Login/Register)
- Child Management
- Babysitter Management
- Financial Management
- Reports and Analytics
- Responsive Design

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── assets/         # Static assets (images, fonts, etc.)
├── components/     # Reusable UI components
├── context/        # React context providers
├── hooks/          # Custom React hooks
├── layouts/        # Layout components
├── pages/          # Page components
├── services/       # API services
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Dependencies

- React
- TypeScript
- Material-UI
- React Router
- React Query
- Formik
- Yup
- Axios
- Date-fns

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

This project is licensed under the MIT License.
