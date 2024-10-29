# # this bash file is for mac and linux users
# # open the terminal and run the following command First time only: chmod +x file_name.sh
# # then run the file with this command: ./file_name.sh

# # to run this file on windows, you need to install git bash
# # then use the command: chmod +x file_name.sh
# # then use the command: ./file_name.sh


#!/bin/sh

# Detect operating system and handle accordingly
case "$(uname -s)" in
    CYGWIN*|MINGW*|MSYS*)
        echo "Windows detected, launching run_project.bat..."
        cmd //c run_project.bat
        exit $?
        ;;
    Darwin*)
        echo "macOS detected"
        ;;
    Linux*)
        echo "Linux detected"
        ;;
    *)
        echo "Unknown operating system"
        exit 1
        ;;
esac

# Function to check command status
check_status() {
    if [ $? -ne 0 ]; then
        echo "$1"
        exit 1
    fi
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

echo "Starting Easy-Booking MERN Application..."

# Check if npm is installed
if ! command_exists npm; then
    echo "Error: npm is not installed."
    exit 1
fi

# Check if directories exist
if [ ! -d "backend" ]; then
    echo "Error: backend directory does not exist."
    exit 1
fi

if [ ! -d "frontend" ]; then
    echo "Error: frontend directory does not exist."
    exit 1
fi

# Change to backend directory and install dependencies
echo "Installing backend dependencies..."
cd backend || { echo "Error: Could not change to backend directory"; exit 1; }
npm install
check_status "Failed to install backend dependencies"

# Start backend in background
echo "Starting backend server..."
npm run dev & BACKEND_PID=$!

# Verify backend started successfully
sleep 2
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "Error: Backend server failed to start."
    exit 1
fi

# Change back to root and then to frontend directory
cd .. || { kill $BACKEND_PID; echo "Error: Could not change to root directory"; exit 1; }
cd frontend || { kill $BACKEND_PID; echo "Error: Could not change to frontend directory"; exit 1; }

# Install frontend dependencies
echo "Installing frontend dependencies..."
npm install
check_status "Failed to install frontend dependencies"

# Start frontend
echo "Starting frontend..."
trap 'kill $BACKEND_PID; exit' INT TERM EXIT  # Ensure backend is killed when script exits
npm run dev & FRONTEND_PID=$!

# Wait for both servers
wait $BACKEND_PID
wait $FRONTEND_PID