# ToDo App

A responsive ToDo application built with React, TypeScript, and Vite. The app allows users to manage tasks and categories, organize tasks, and browse tasks using pagination, filtering, and sorting.

## Features

### Tasks
- Create, view, update, and delete tasks.
- View individual task details.
- Assign tasks to categories and remove them from categories.
- Filter tasks by title, description, completion status, and date range.
- Sort tasks.
- Browse tasks with pagination.

### Categories
- Create, view, update, and delete categories.
- View tasks belonging to a specific category.

### Other
- Responsive design for mobile and desktop screens.
- Backend API integration using Axios.
- Centralized state management with Redux Toolkit.
- TypeScript for type safety.

## Technologies Used

- React
- TypeScript
- Vite
- Redux Toolkit (RTK)
- Axios
- React Router
- Material UI (MUI)
- Tailwind CSS

## Requirements

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- npm (included with Node.js)

## Installation

1. Clone the repository:

   ```bash
   git clone YOUR_GITHUB_REPOSITORY_URL
   ```

2. Navigate to the project directory:

   ```bash
   cd "Todo assignment"
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

## Running the Project

Start the development server:

```bash
npm run dev
```

Open the local URL shown in your terminal, usually `http://localhost:5173`.

## Production Build

To check TypeScript and create a production build, run:

```bash
npm run build
```

To run the TypeScript check separately:

```bash
npx tsc -b
```

## API Configuration

The application communicates with the ToDo backend API:

`https://todoapp.ideallteam.com`

The API base URL is configured directly in the Axios configuration rather than in an environment variable. If the API address changes, update it in the Axios configuration file.

API documentation: https://todoapp.ideallteam.com/docs/

## Project Structure

```text
src/
├── api/          # API requests and Axios configuration
├── features/     # Redux Toolkit slices
├── pages/        # Application pages
├── App.tsx       # Application routes and initial data loading
├── hooks.ts      # Typed Redux hooks
└── main.tsx      # Application entry point
```

## Notes

- No authentication is required.
- Task and category data are managed through the backend API.
- The application is designed to work on desktop and mobile devices.
