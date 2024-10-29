:: Quitting the terminal directly will not stop the servers, as they may continue running in the background.
:: To properly stop the servers, press Ctrl+C in the terminal where each server is running.
:: If you accidentally quit the terminal without stopping the servers, you’ll need to free the ports manually:
:: - Either restart the PC
:: - Or use Task Manager to find and kill the Node.js processes

:: Below are steps to manually free up a port without restarting:

:: 1. Identify the Process Using the Port
:: Run the following command (Admin powershell) to check which process is using the specific port (replace `7000` with your port):
:: -> netstat -ano | findstr :7000

:: This command will display the process ID (PID) associated with the port in the LISTENING or TIME_WAIT state.

:: 2. Note the Process ID (PID)
:: Look for the process ID of the program using the port.
:: Record the PID, as you’ll need it to manually terminate the process.

:: 3. Terminate the Process Using the Port
:: Use the taskkill command to stop the process, freeing up the port.
:: Replace `12345` with the actual PID from the previous command’s output:
:: -> taskkill /PID 12345 /F

:: - The /F flag forces the termination, which is helpful if the process is unresponsive.

:: 4. Confirm the Port is Free
:: Run the netstat command again to verify the port has been freed:
:: ->  netstat -ano | findstr :7000

:: If no output appears, the port is successfully freed and ready for new connections.

:: 5. Restart Your Application
:: You can now start your application on the previously occupied port without conflicts.



@echo off
echo Starting Easy-Booking Application...

:: Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: npm is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

:: Check if directories exist
if not exist "backend" (
    echo Error: backend directory not found!
    echo Please ensure you're running this script from the project root
    pause
    exit /b 1
)

if not exist "frontend" (
    echo Error: frontend directory not found!
    echo Please ensure you're running this script from the project root
    pause
    exit /b 1
)

:: Change to backend directory and install dependencies
echo Installing backend dependencies...
cd backend
call npm install
if %ERRORLEVEL% neq 0 (
    echo Error: Failed to install backend dependencies
    cd ..
    pause
    exit /b 1
)

:: Start backend in a new terminal window
echo Starting backend server...
start cmd /k "npm run dev"
if %ERRORLEVEL% neq 0 (
    echo Error: Failed to start backend server
    cd ..
    pause
    exit /b 1
)

:: Change back to root and then to frontend directory
cd ..
cd frontend

:: Install frontend dependencies
echo Installing frontend dependencies...
call npm install
if %ERRORLEVEL% neq 0 (
    echo Error: Failed to install frontend dependencies
    cd ..
    pause
    exit /b 1
)

:: Start frontend
echo Starting frontend...
call npm run dev
if %ERRORLEVEL% neq 0 (
    echo Error: Failed to start frontend server
    cd ..
    pause
    exit /b 1
)

echo Both frontend and backend are now running!