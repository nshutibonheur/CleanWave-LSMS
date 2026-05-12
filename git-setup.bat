@echo off
REM ============================================================
REM  LSMS — Git Version Control Setup Script (Windows CMD)
REM  Run this ONCE from inside the C:\LMS-Prototype folder
REM ============================================================

echo [1] Checking Git installation...
git --version
IF %ERRORLEVEL% NEQ 0 (
    echo ERROR: Git is not installed. Download from https://git-scm.com
    pause
    exit /b 1
)

echo [2] Initializing Git repository...
git init

echo [3] Configuring Git identity...
git config user.name "CleanWave Dev"
git config user.email "dev@cleanwave.rw"

echo [4] Adding all project files...
git add .

echo [5] Creating first commit...
git commit -m "Phase 2: Initial LSMS prototype with MVC pattern, JWT auth, and input validation"

echo [6] Creating development branch...
git checkout -b development

echo [7] Creating feature branch for Docker...
git checkout -b feature/docker-phase3

echo.
echo ✅ Git repository initialized successfully!
echo.
echo Branches created:
echo   main        - stable releases
echo   development - ongoing development
echo   feature/docker-phase3 - current Docker work
echo.
echo Next steps:
echo   1. Create a repo on GitHub at https://github.com/new
echo   2. Run: git remote add origin https://github.com/YOUR_USERNAME/lsms.git
echo   3. Run: git push -u origin main
echo.
pause
