@echo off
title BuildingOS - Starting Server
color 0B
echo ========================================================
echo          Starting BuildingOS Server Stack
echo ========================================================
echo.

:: Add portable node path if it exists
if exist "C:\Users\ameya\node" (
    set "PATH=C:\Users\ameya\node;%PATH%"
)

cd /d "%~dp0"

echo [1/3] Backend (Port 5001)
echo [2/3] AI Intelligence Layer (Port 8000)
echo [3/3] Frontend 3D Twin (Port 3000)
echo.
echo Launching all services via concurrently...
echo Open your browser at http://localhost:3000 once ready.
echo Press Ctrl+C in this window to stop all servers.
echo.

npm run dev

pause
