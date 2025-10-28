#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${PURPLE}🚀 Starting TalentFlow Next.js + Backend...${NC}"
echo -e "${CYAN}==============================================${NC}"

# Function to cleanup background processes on exit
cleanup() {
    echo -e "\n${YELLOW}🛑 Stopping all processes...${NC}"
    
    if [ ! -z "$FRONTEND_PID" ]; then
        echo -e "${BLUE}🔄 Stopping Next.js frontend (PID: $FRONTEND_PID)...${NC}"
        kill $FRONTEND_PID 2>/dev/null
    fi
    
    if [ ! -z "$BACKEND_PID" ]; then
        echo -e "${BLUE}🔄 Stopping backend (PID: $BACKEND_PID)...${NC}"
        kill $BACKEND_PID 2>/dev/null
    fi
    
    echo -e "${GREEN}✅ All processes stopped${NC}"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Check if talentflow-next directory exists
TALENTFLOW_NEXT_PATH="../talentflow-next"
if [ ! -d "$TALENTFLOW_NEXT_PATH" ]; then
    echo -e "${RED}❌ Error: talentflow-next directory not found at $TALENTFLOW_NEXT_PATH${NC}"
    exit 1
fi

# Check if we have Next.js project in talentflow-next
if [ ! -f "$TALENTFLOW_NEXT_PATH/package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found in talentflow-next directory.${NC}"
    exit 1
fi
    
# Check if Next.js is configured
if ! grep -q "next" "$TALENTFLOW_NEXT_PATH/package.json"; then
    echo -e "${RED}❌ Error: This doesn't appear to be a Next.js project in talentflow-next.${NC}"
    exit 1
fi
    
echo -e "${GREEN}✅ Next.js project detected${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Error: Node.js is not installed. Please install Node.js first.${NC}"
        exit 1
    fi
    
# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Error: Node.js version 18+ is required. Current version: $(node -v)${NC}"
        exit 1
    fi
    
echo -e "${GREEN}✅ Node.js $(node -v) is available${NC}"

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ Error: npm is not installed. Please install npm first.${NC}"
        exit 1
    fi
    
echo -e "${GREEN}✅ npm is available${NC}"

# Check and kill processes on ports 3000 and 3002
echo -e "${YELLOW}🔍 Checking for processes on ports 3000 and 3002...${NC}"

# Kill process on port 3000 if it exists
PORT_3000_PID=$(lsof -ti:3000 2>/dev/null)
if [ ! -z "$PORT_3000_PID" ]; then
    echo -e "${YELLOW}⚠️  Process on port 3000 found (PID: $PORT_3000_PID), stopping...${NC}"
    kill $PORT_3000_PID 2>/dev/null
    sleep 2
fi

# Kill process on port 3002 if it exists
PORT_3002_PID=$(lsof -ti:3002 2>/dev/null)
if [ ! -z "$PORT_3002_PID" ]; then
    echo -e "${YELLOW}⚠️  Process on port 3002 found (PID: $PORT_3002_PID), stopping...${NC}"
    kill $PORT_3002_PID 2>/dev/null
    sleep 2
fi

echo -e "${GREEN}✅ Ports cleared${NC}"

# Install frontend dependencies if node_modules doesn't exist
if [ ! -d "$TALENTFLOW_NEXT_PATH/node_modules" ]; then
    echo -e "${YELLOW}📦 Installing Next.js dependencies...${NC}"
    cd "$TALENTFLOW_NEXT_PATH"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Error: Failed to install Next.js dependencies${NC}"
        exit 1
    fi
    cd - > /dev/null
    echo -e "${GREEN}✅ Next.js dependencies installed successfully${NC}"
else
    echo -e "${GREEN}✅ Next.js dependencies already installed${NC}"
fi

# Find and start backend
BACKEND_STARTED=false

# Check for backend in common locations
BACKEND_PATHS=(
    "backend"
    "../backend"
    "../api"
    "../server"
    "api"
    "server"
    "../TalentFlow-backend"
    "../talentflow-backend"
)

for BACKEND_PATH in "${BACKEND_PATHS[@]}"; do
    if [ -d "$BACKEND_PATH" ] && [ -f "$BACKEND_PATH/package.json" ]; then
        echo -e "${BLUE}🔧 Backend found in: $BACKEND_PATH${NC}"
        
        # Check if backend has necessary scripts
        if grep -q "\"dev\"" "$BACKEND_PATH/package.json" || grep -q "\"start\"" "$BACKEND_PATH/package.json"; then
            echo -e "${GREEN}✅ Backend package.json with scripts found${NC}"
            
            # Install backend dependencies if needed
            if [ ! -d "$BACKEND_PATH/node_modules" ]; then
                echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
                cd "$BACKEND_PATH"
        npm install
                if [ $? -ne 0 ]; then
                    echo -e "${RED}❌ Error: Failed to install backend dependencies${NC}"
                    cd - > /dev/null
                    continue
                fi
                cd - > /dev/null
                echo -e "${GREEN}✅ Backend dependencies installed${NC}"
            else
                echo -e "${GREEN}✅ Backend dependencies already installed${NC}"
            fi
            
            # Start backend with PORT=3002
            echo -e "${BLUE}🚀 Starting backend server from $BACKEND_PATH on port 3002...${NC}"
            cd "$BACKEND_PATH"
            
            # Set environment variable for port
            export PORT=3002
            
            # Try to run dev script first, then start
            if grep -q "\"dev\"" package.json; then
                echo -e "${CYAN}📝 Running: PORT=3002 npm run dev${NC}"
                PORT=3002 npm run dev &
            elif grep -q "\"start\"" package.json; then
                echo -e "${CYAN}📝 Running: PORT=3002 npm start${NC}"
                PORT=3002 npm start &
            else
                echo -e "${YELLOW}⚠️  No dev or start script found in backend${NC}"
                cd - > /dev/null
                continue
            fi
            
            BACKEND_PID=$!
            cd - > /dev/null
            
            echo -e "${GREEN}✅ Backend started with PID: $BACKEND_PID on port 3002${NC}"
            BACKEND_STARTED=true
            break
        else
            echo -e "${YELLOW}⚠️  Backend found but no dev/start scripts detected${NC}"
        fi
    fi
done

if [ "$BACKEND_STARTED" = false ]; then
    echo -e "${YELLOW}⚠️  No suitable backend found, starting only Next.js frontend${NC}"
fi

# Start Next.js frontend on port 3000
echo -e "${BLUE}🎨 Starting Next.js frontend on port 3000...${NC}"
echo -e "${GREEN}✅ Frontend will be available at: http://localhost:3000${NC}"

if [ "$BACKEND_STARTED" = true ]; then
    echo -e "${CYAN}📝 Running: cd $TALENTFLOW_NEXT_PATH && PORT=3000 npm run dev${NC}"
else
    echo -e "${CYAN}📝 Running: cd $TALENTFLOW_NEXT_PATH && PORT=3000 npm run dev (backend not found)${NC}"
fi

# Start Next.js in development mode with explicit port
cd "$TALENTFLOW_NEXT_PATH"
PORT=3000 npm run dev &
FRONTEND_PID=$!
cd - > /dev/null

echo -e "${GREEN}✅ Next.js frontend started with PID: $FRONTEND_PID on port 3000${NC}"

# Display status
echo -e "\n${CYAN}==============================================${NC}"
echo -e "${GREEN}🎉 Application Status:${NC}"
echo -e "${GREEN}✅ Next.js Frontend: http://localhost:3000 (PID: $FRONTEND_PID)${NC}"

if [ "$BACKEND_STARTED" = true ]; then
    echo -e "${GREEN}✅ Backend: Running on port 3002 (PID: $BACKEND_PID)${NC}"
    echo -e "${CYAN}🔗 Backend API: http://localhost:3002${NC}"
    echo -e "${CYAN}🔗 Backend Health: http://localhost:3002/health${NC}"
else
    echo -e "${YELLOW}⚠️  Backend: Not found${NC}"
fi

echo -e "${CYAN}==============================================${NC}"
echo -e "${YELLOW}📝 Press Ctrl+C to stop all processes${NC}"
echo -e "${BLUE}🔄 Monitoring processes...${NC}"

# Wait for both processes and monitor them
while true; do
    # Check if frontend is still running
    if ! kill -0 $FRONTEND_PID 2>/dev/null; then
        echo -e "${RED}❌ Next.js frontend process stopped unexpectedly${NC}"
        break
    fi
    
    # Check if backend is still running (if it was started)
    if [ "$BACKEND_STARTED" = true ] && ! kill -0 $BACKEND_PID 2>/dev/null; then
        echo -e "${RED}❌ Backend process stopped unexpectedly${NC}"
        break
    fi
    
    sleep 2
done

echo -e "${YELLOW}🔄 One or more processes stopped, cleaning up...${NC}"
cleanup
