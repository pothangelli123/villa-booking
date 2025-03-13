# PowerShell script to run the Next.js development server
# This is needed because PowerShell doesn't support '&&' for command chaining

# Navigate to the project directory
Set-Location -Path $PSScriptRoot

# Run the development server
Write-Host "Starting Next.js development server..."
npm run dev

# If you need to use a different port, uncomment the line below
# npm run dev -- -p 3001 