# BuildingOS - Server Startup Script
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "         Starting BuildingOS Server Stack" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

# Ensure Node is in PATH
if (Test-Path "C:\Users\ameya\node") {
    $env:PATH = "C:\Users\ameya\node;" + $env:PATH
}

Set-Location $PSScriptRoot

Write-Host "[1/3] Backend (Port 5001)" -ForegroundColor Yellow
Write-Host "[2/3] AI Intelligence Layer (Port 8000)" -ForegroundColor Yellow
Write-Host "[3/3] Frontend 3D Twin (Port 3000)" -ForegroundColor Yellow
Write-Host ""
Write-Host "Dashboard will be live at: http://localhost:3000" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop all servers." -ForegroundColor Gray
Write-Host ""

npm run dev
