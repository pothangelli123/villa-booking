# Luxury Villa Booking

A Next.js application for direct villa booking services.

## Prerequisites

- Node.js 16.x or higher
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/villa-booking.git
```

2. Navigate to the project directory:
```bash
cd villa-booking
```

3. Install dependencies:
```bash
npm install
```

## Running the Application

### Using PowerShell

PowerShell doesn't support the `&&` operator for command chaining like bash does. Use one of these methods instead:

#### Method 1: Navigate first, then run
```powershell
Set-Location -Path "D:\path\to\villa-booking"
npm run dev
```

#### Method 2: Use semicolons to chain commands
```powershell
Set-Location -Path "D:\path\to\villa-booking"; npm run dev
```

#### Method 3: Use the provided PowerShell script
```powershell
.\run-dev.ps1
```

### Using Command Prompt or Bash
```bash
cd villa-booking && npm run dev
```

## Using a Different Port

If port 3000 is already in use, you can specify a different port:

```powershell
npm run dev -- -p 3001
```

## Project Structure

- `pages/`: Contains all the pages of the application
  - `index.tsx`: Homepage
  - `booking.tsx`: Booking page
  - `_app.tsx`: Next.js custom App
  - `_document.tsx`: Next.js custom Document
  - `api/`: API routes
    - `bookings.ts`: Booking API
    - `payment.ts`: Payment API
- `styles/`: Contains CSS files
  - `globals.css`: Global styles
- `utils/`: Utility functions
  - `mockApi.js`: Mock API for development
- `public/`: Static assets
  - `images/`: Images for the application

## Available Scripts

- `npm run dev`: Run the development server
- `npm run build`: Build the application for production
- `npm run start`: Start the production server
- `npm run lint`: Lint the codebase

## Troubleshooting

If you encounter issues:

1. Check the `FIXED.md` file for common issues and their solutions
2. Make sure all dependencies are installed with `npm install`
3. Try running on a different port with `npm run dev -- -p 3001`
4. Clear the Next.js cache by deleting the `.next` folder and running `npm run dev` again

## License

This project is licensed under the MIT License. 