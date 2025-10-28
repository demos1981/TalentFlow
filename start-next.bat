@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo 🚀 Starting TalentFlow Next.js + Backend...
echo ==============================================

REM Check if we're in the Next.js project directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this script from the Next.js project root.
    pause
    exit /b 1
)

REM Check if Next.js is configured
findstr /c:"next" package.json >nul
if errorlevel 1 (
    echo ❌ Error: This doesn't appear to be a Next.js project.
    pause
    exit /b 1
)

echo ✅ Next.js project detected

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo ✅ Node.js is available

REM Check if npm is available
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ npm is available

REM Check and kill processes on ports 3000 and 3002
echo 🔍 Checking for processes on ports 3000 and 3002...

REM Kill process on port 3000 if it exists
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    echo ⚠️  Process on port 3000 found (PID: %%a), stopping...
    taskkill /PID %%a /F >nul 2>&1
)

REM Kill process on port 3002 if it exists
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3002') do (
    echo ⚠️  Process on port 3002 found (PID: %%a), stopping...
    taskkill /PID %%a /F >nul 2>&1
)

echo ✅ Ports cleared

REM Install frontend dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing Next.js dependencies...
    npm install
    if errorlevel 1 (
        echo ❌ Error: Failed to install Next.js dependencies
        pause
        exit /b 1
    )
    echo ✅ Next.js dependencies installed successfully
) else (
    echo ✅ Next.js dependencies already installed
)

REM Find and start backend
set BACKEND_STARTED=false

REM Check for backend in common locations
set BACKEND_PATHS=../backend ../api ../server backend api server ../TalentFlow-backend ../talentflow-backend

for %%p in (%BACKEND_PATHS%) do (
    if exist "%%p\package.json" (
        echo 🔧 Backend found in: %%p
        
        REM Check if backend has necessary scripts
        findstr /c:"\"dev\"" "%%p\package.json" >nul
        if not errorlevel 1 (
            echo ✅ Backend package.json with dev script found
            
            REM Install backend dependencies if needed
            if not exist "%%p\node_modules" (
                echo 📦 Installing backend dependencies...
                cd "%%p"
                npm install
                if errorlevel 1 (
                    echo ❌ Error: Failed to install backend dependencies
                    cd ..
                    goto :continue_backend
                )
                cd ..
                echo ✅ Backend dependencies installed
            ) else (
                echo ✅ Backend dependencies already installed
            )
            
            REM Start backend on port 3002
            echo 🚀 Starting backend server from %%p on port 3002...
            cd "%%p"
            set PORT=3002
            start "Backend Server (Port 3002)" cmd /c "set PORT=3002 && npm run dev"
            cd ..
            
            echo ✅ Backend started on port 3002
            set BACKEND_STARTED=true
            goto :backend_found
        ) else (
            findstr /c:"\"start\"" "%%p\package.json" >nul
            if not errorlevel 1 (
                echo ✅ Backend package.json with start script found
                
                REM Install backend dependencies if needed
                if not exist "%%p\node_modules" (
                    echo 📦 Installing backend dependencies...
                    cd "%%p"
                    npm install
                    if errorlevel 1 (
                        echo ❌ Error: Failed to install backend dependencies
                        cd ..
                        goto :continue_backend
                    )
                    cd ..
                    echo ✅ Backend dependencies installed
                ) else (
                    echo ✅ Backend dependencies already installed
                )
                
                REM Start backend on port 3002
                echo 🚀 Starting backend server from %%p on port 3002...
                cd "%%p"
                set PORT=3002
                start "Backend Server (Port 3002)" cmd /c "set PORT=3002 && npm start"
                cd ..
                
                echo ✅ Backend started on port 3002
                set BACKEND_STARTED=true
                goto :backend_found
            ) else (
                echo ⚠️  No dev or start script found in backend
            )
        )
    )
    :continue_backend
)

:backend_found

if "%BACKEND_STARTED%"=="false" (
    echo ⚠️  No suitable backend found, starting only Next.js frontend
)

REM Start Next.js frontend on port 3000
echo 🎨 Starting Next.js frontend on port 3000...
echo ✅ Frontend will be available at: http://localhost:3000

if "%BACKEND_STARTED%"=="true" (
    echo 📝 Running: npm run dev (port 3000)
) else (
    echo 📝 Running: npm run dev (port 3000, backend not found)
)

REM Start Next.js in development mode
start "Next.js Frontend (Port 3000)" cmd /c "npm run dev"

echo ✅ Next.js frontend started on port 3000

REM Display status
echo.
echo ==============================================
echo 🎉 Application Status:
echo ✅ Next.js Frontend: http://localhost:3000

if "%BACKEND_STARTED%"=="true" (
    echo ✅ Backend: Running on port 3002
    echo 🔗 Backend API: http://localhost:3002
    echo 🔗 Backend Health: http://localhost:3002/health
) else (
    echo ⚠️  Backend: Not found
)

echo ==============================================
echo 📝 Both processes are running in separate windows
echo 🎯 Frontend: http://localhost:3000
echo 🔧 Backend: http://localhost:3002
echo.
echo 🚀 TalentFlow is starting up!
echo.
pause

setlocal enabledelayedexpansion

echo 🚀 Starting TalentFlow Next.js + Backend...
echo ==============================================

REM Check if we're in the Next.js project directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this script from the Next.js project root.
    pause
    exit /b 1
)

REM Check if Next.js is configured
findstr /c:"next" package.json >nul
if errorlevel 1 (
    echo ❌ Error: This doesn't appear to be a Next.js project.
    pause
    exit /b 1
)

echo ✅ Next.js project detected

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo ✅ Node.js is available

REM Check if npm is available
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ npm is available

REM Check and kill processes on ports 3000 and 3002
echo 🔍 Checking for processes on ports 3000 and 3002...

REM Kill process on port 3000 if it exists
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    echo ⚠️  Process on port 3000 found (PID: %%a), stopping...
    taskkill /PID %%a /F >nul 2>&1
)

REM Kill process on port 3002 if it exists
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3002') do (
    echo ⚠️  Process on port 3002 found (PID: %%a), stopping...
    taskkill /PID %%a /F >nul 2>&1
)

echo ✅ Ports cleared

REM Install frontend dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing Next.js dependencies...
    npm install
    if errorlevel 1 (
        echo ❌ Error: Failed to install Next.js dependencies
        pause
        exit /b 1
    )
    echo ✅ Next.js dependencies installed successfully
) else (
    echo ✅ Next.js dependencies already installed
)

REM Find and start backend
set BACKEND_STARTED=false

REM Check for backend in common locations
set BACKEND_PATHS=../backend ../api ../server backend api server ../TalentFlow-backend ../talentflow-backend

for %%p in (%BACKEND_PATHS%) do (
    if exist "%%p\package.json" (
        echo 🔧 Backend found in: %%p
        
        REM Check if backend has necessary scripts
        findstr /c:"\"dev\"" "%%p\package.json" >nul
        if not errorlevel 1 (
            echo ✅ Backend package.json with dev script found
            
            REM Install backend dependencies if needed
            if not exist "%%p\node_modules" (
                echo 📦 Installing backend dependencies...
                cd "%%p"
                npm install
                if errorlevel 1 (
                    echo ❌ Error: Failed to install backend dependencies
                    cd ..
                    goto :continue_backend
                )
                cd ..
                echo ✅ Backend dependencies installed
            ) else (
                echo ✅ Backend dependencies already installed
            )
            
            REM Start backend on port 3002
            echo 🚀 Starting backend server from %%p on port 3002...
            cd "%%p"
            set PORT=3002
            start "Backend Server (Port 3002)" cmd /c "set PORT=3002 && npm run dev"
            cd ..
            
            echo ✅ Backend started on port 3002
            set BACKEND_STARTED=true
            goto :backend_found
        ) else (
            findstr /c:"\"start\"" "%%p\package.json" >nul
            if not errorlevel 1 (
                echo ✅ Backend package.json with start script found
                
                REM Install backend dependencies if needed
                if not exist "%%p\node_modules" (
                    echo 📦 Installing backend dependencies...
                    cd "%%p"
                    npm install
                    if errorlevel 1 (
                        echo ❌ Error: Failed to install backend dependencies
                        cd ..
                        goto :continue_backend
                    )
                    cd ..
                    echo ✅ Backend dependencies installed
                ) else (
                    echo ✅ Backend dependencies already installed
                )
                
                REM Start backend on port 3002
                echo 🚀 Starting backend server from %%p on port 3002...
                cd "%%p"
                set PORT=3002
                start "Backend Server (Port 3002)" cmd /c "set PORT=3002 && npm start"
                cd ..
                
                echo ✅ Backend started on port 3002
                set BACKEND_STARTED=true
                goto :backend_found
            ) else (
                echo ⚠️  No dev or start script found in backend
            )
        )
    )
    :continue_backend
)

:backend_found

if "%BACKEND_STARTED%"=="false" (
    echo ⚠️  No suitable backend found, starting only Next.js frontend
)

REM Start Next.js frontend on port 3000
echo 🎨 Starting Next.js frontend on port 3000...
echo ✅ Frontend will be available at: http://localhost:3000

if "%BACKEND_STARTED%"=="true" (
    echo 📝 Running: npm run dev (port 3000)
) else (
    echo 📝 Running: npm run dev (port 3000, backend not found)
)

REM Start Next.js in development mode
start "Next.js Frontend (Port 3000)" cmd /c "npm run dev"

echo ✅ Next.js frontend started on port 3000

REM Display status
echo.
echo ==============================================
echo 🎉 Application Status:
echo ✅ Next.js Frontend: http://localhost:3000

if "%BACKEND_STARTED%"=="true" (
    echo ✅ Backend: Running on port 3002
    echo 🔗 Backend API: http://localhost:3002
    echo 🔗 Backend Health: http://localhost:3002/health
) else (
    echo ⚠️  Backend: Not found
)

echo ==============================================
echo 📝 Both processes are running in separate windows
echo 🎯 Frontend: http://localhost:3000
echo 🔧 Backend: http://localhost:3002
echo.
echo 🚀 TalentFlow is starting up!
echo.
pause
