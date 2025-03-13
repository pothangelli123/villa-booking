@echo off
echo Starting Villa Booking Website Development Server...
echo.
echo Please make sure you have set up your environment variables in .env.local
echo.

if not exist .env.local (
  echo ERROR: .env.local file not found.
  echo.
  echo Please create a .env.local file with the following variables:
  echo.
  type .env.example
  echo.
  echo Press any key to exit...
  pause > nul
  exit /b 1
)

echo Installing dependencies...
call npm install

echo.
echo Starting development server...
call npm run dev 