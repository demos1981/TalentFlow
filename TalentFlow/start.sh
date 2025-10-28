#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting TalentFlow Application...${NC}"

# Function to cleanup background processes on exit
cleanup() {
    echo -e "\n${YELLOW}🛑 Stopping all processes...${NC}"
    kill $FRONTEND_PID $BACKEND_PID 2>/dev/null
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Please run this script from the project root.${NC}"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Error: Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ Error: npm is not installed. Please install npm first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js and npm are available${NC}"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Error: Failed to install dependencies${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
fi

# Start backend (if backend directory exists)
if [ -d "../backend" ] || [ -d "backend" ]; then
    echo -e "${BLUE}🔧 Starting backend...${NC}"
    
    # Try to find backend directory
    if [ -d "../backend" ]; then
        BACKEND_DIR="../backend"
    elif [ -d "backend" ]; then
        BACKEND_DIR="backend"
    fi
    
    # Check if backend has package.json
    if [ -f "$BACKEND_DIR/package.json" ]; then
        echo -e "${GREEN}✅ Backend package.json found in $BACKEND_DIR${NC}"
        
        # Install backend dependencies if needed
        if [ ! -d "$BACKEND_DIR/node_modules" ]; then
            echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
            cd "$BACKEND_DIR"
            npm install
            cd - > /dev/null
        fi
        
        # Start backend
        echo -e "${BLUE}🚀 Starting backend server...${NC}"
        cd "$BACKEND_DIR"
        npm run dev &
        BACKEND_PID=$!
        cd - > /dev/null
        
        echo -e "${GREEN}✅ Backend started with PID: $BACKEND_PID${NC}"
    else
        echo -e "${YELLOW}⚠️  Backend directory found but no package.json detected${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  No backend directory found, starting only frontend${NC}"
fi

# Start frontend
echo -e "${BLUE}🎨 Starting frontend...${NC}"
echo -e "${GREEN}✅ Frontend will be available at: http://localhost:3000${NC}"

# Start frontend in development mode
npm run dev &
FRONTEND_PID=$!

echo -e "${GREEN}✅ Frontend started with PID: $FRONTEND_PID${NC}"
echo -e "${GREEN}✅ Application is starting up...${NC}"
echo -e "${YELLOW}📝 Press Ctrl+C to stop all processes${NC}"

# Wait for both processes
wait

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting TalentFlow Application...${NC}"

# Function to cleanup background processes on exit
cleanup() {
    echo -e "\n${YELLOW}🛑 Stopping all processes...${NC}"
    kill $FRONTEND_PID $BACKEND_PID 2>/dev/null
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Please run this script from the project root.${NC}"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Error: Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ Error: npm is not installed. Please install npm first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js and npm are available${NC}"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Error: Failed to install dependencies${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
fi

# Start backend (if backend directory exists)
if [ -d "../backend" ] || [ -d "backend" ]; then
    echo -e "${BLUE}🔧 Starting backend...${NC}"
    
    # Try to find backend directory
    if [ -d "../backend" ]; then
        BACKEND_DIR="../backend"
    elif [ -d "backend" ]; then
        BACKEND_DIR="backend"
    fi
    
    # Check if backend has package.json
    if [ -f "$BACKEND_DIR/package.json" ]; then
        echo -e "${GREEN}✅ Backend package.json found in $BACKEND_DIR${NC}"
        
        # Install backend dependencies if needed
        if [ ! -d "$BACKEND_DIR/node_modules" ]; then
            echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
            cd "$BACKEND_DIR"
            npm install
            cd - > /dev/null
        fi
        
        # Start backend
        echo -e "${BLUE}🚀 Starting backend server...${NC}"
        cd "$BACKEND_DIR"
        npm run dev &
        BACKEND_PID=$!
        cd - > /dev/null
        
        echo -e "${GREEN}✅ Backend started with PID: $BACKEND_PID${NC}"
    else
        echo -e "${YELLOW}⚠️  Backend directory found but no package.json detected${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  No backend directory found, starting only frontend${NC}"
fi

# Start frontend
echo -e "${BLUE}🎨 Starting frontend...${NC}"
echo -e "${GREEN}✅ Frontend will be available at: http://localhost:3000${NC}"

# Start frontend in development mode
npm run dev &
FRONTEND_PID=$!

echo -e "${GREEN}✅ Frontend started with PID: $FRONTEND_PID${NC}"
echo -e "${GREEN}✅ Application is starting up...${NC}"
echo -e "${YELLOW}📝 Press Ctrl+C to stop all processes${NC}"

# Wait for both processes
wait
