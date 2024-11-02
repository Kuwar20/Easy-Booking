# this bash file is for mac and linux users
# open the terminal and run the following command First time only: chmod +x file_name.sh
# then run the file with this command: ./file_name.sh

# to run this file on windows, you need to install git bash
# then use the command: chmod +x file_name.sh
# then use the command: ./file_name.sh

#!/bin/bash

# Exit on error
set -e

# Store the ports in variables for easy modification
BACKEND_PORT=7000
FRONTEND_PORT=5173

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if a port is in use
port_in_use() {
    if command_exists lsof; then
        lsof -i ":$1" >/dev/null 2>&1
    else
        netstat -tuln | grep ":$1 " >/dev/null 2>&1
    fi
}

# Function to cleanup on script exit
cleanup() {
    echo "Cleaning up..."
    # Kill any remaining processes
    if [ -f "backend.pid" ]; then
        kill $(cat backend.pid) 2>/dev/null || true
        rm backend.pid
    fi
    if [ -f "frontend.pid" ]; then
        kill $(cat frontend.pid) 2>/dev/null || true
        rm frontend.pid
    fi
}

# Set up trap for cleanup
trap cleanup EXIT

echo "================================="
echo "  MERN Stack Application Startup"
echo "================================="

# Check if Node.js/npm is installed
if ! command_exists npm; then
    echo "Error: npm is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if directories exist
if [ ! -d "backend" ]; then
    echo "Error: backend directory not found!"
    echo "Please ensure you're running this script from the project root"
    exit 1
fi

if [ ! -d "frontend" ]; then
    echo "Error: frontend directory not found!"
    echo "Please ensure you're running this script from the project root"
    exit 1
fi

# Check if ports are already in use
if port_in_use $BACKEND_PORT; then
    echo "Warning: Port $BACKEND_PORT is already in use!"
    echo "You may need to free up the port before proceeding."
    echo
    echo "Options:"
    echo "1. Continue anyway"
    echo "2. Exit and free up ports"
    read -p "Choose an option (1 or 2): " choice
    if [ "$choice" = "2" ]; then
        echo
        echo "To free up ports, run:"
        echo "sudo lsof -i :$BACKEND_PORT"
        echo "kill -9 <PID>"
        exit 1
    fi
fi

if port_in_use $FRONTEND_PORT; then
    echo "Warning: Port $FRONTEND_PORT is already in use!"
    echo "You may need to free up the port before proceeding."
    echo
    echo "Options:"
    echo "1. Continue anyway"
    echo "2. Exit and free up ports"
    read -p "Choose an option (1 or 2): " choice
    if [ "$choice" = "2" ]; then
        echo
        echo "To free up ports, run:"
        echo "sudo lsof -i :$FRONTEND_PORT"
        echo "kill -9 <PID>"
        exit 1
    fi
fi

# Check for package.json files
if [ ! -f "backend/package.json" ]; then
    echo "Error: backend/package.json not found!"
    exit 1
fi

if [ ! -f "frontend/package.json" ]; then
    echo "Error: frontend/package.json not found!"
    exit 1
fi

# Install backend dependencies and start server
echo
echo "Installing backend dependencies..."
cd backend
npm install

echo "Starting backend server..."
npm run dev & echo $! > ../backend.pid
cd ..

# Install frontend dependencies and start server
echo
echo "Installing frontend dependencies..."
cd frontend
npm install

echo "Starting frontend..."
npm run dev & echo $! > ../frontend.pid
cd ..

echo
echo "================================="
echo "  Startup Complete!"
echo "  - Backend running on port $BACKEND_PORT"
echo "  - Frontend running on port $FRONTEND_PORT"
echo
echo "  To stop the servers:"
echo "  1. Press Ctrl+C"
echo "  2. Or run: kill \$(cat backend.pid) \$(cat frontend.pid)"
echo "================================="

# Wait for both processes
wait