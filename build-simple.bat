@echo off
echo Building Extension...

REM Check if manifest.json exists
if not exist "manifest.json" (
    echo ERROR: manifest.json not found!
    pause
    exit /b 1
)

REM Create build directory
if not exist "build" mkdir build

REM Clean previous builds
if exist "build\status_naturalisation.xpi" del "build\status_naturalisation.xpi"
if exist "build\temp" rmdir /s /q "build\temp"

REM Create temp directory
mkdir "build\temp"

REM Copy files
echo Copying files...
copy "manifest.json" "build\temp\"
copy "content.js" "build\temp\"
copy "utils.js" "build\temp\"
copy "debug.js" "build\temp\"
copy "crypto-js.min.js" "build\temp\"
copy "forge.min.js" "build\temp\"
copy "styles.css" "build\temp\"
copy "icons-config.js" "build\temp\"
copy "inject.js" "build\temp\"

REM Copy icons folder
if exist "icons" (
    xcopy "icons" "build\temp\icons\" /e /i /y
)

REM Create XPI file
echo Creating XPI file...
cd build\temp

REM Try PowerShell first - compress contents directly, not the folder
powershell -Command "Compress-Archive -Path '*' -DestinationPath '..\status_naturalisation.xpi' -Force" 2>nul
if %errorlevel% equ 0 (
    echo PowerShell compression successful
) else (
    echo PowerShell failed, trying 7-Zip...
    if exist "C:\Program Files\7-Zip\7z.exe" (
        "C:\Program Files\7-Zip\7z.exe" a -tzip "..\status_naturalisation.xpi" "*" -r
    ) else (
        echo ERROR: No compression tool found!
        echo Install PowerShell or 7-Zip
        cd ..\..
        pause
        exit /b 1
    )
)

cd ..\..

REM Check if XPI was created
if exist "build\status_naturalisation.xpi" (
    echo.
    echo ========================================
    echo   BUILD SUCCESSFUL!
    echo ========================================
    echo.
    echo File created: build\status_naturalisation.xpi
    
    REM Show file size
    for %%A in ("build\status_naturalisation.xpi") do (
        echo Size: %%~zA bytes
    )
    
    echo.
    echo To install the extension:
    echo 1. Open Firefox
    echo 2. Go to about:addons
    echo 3. Click the gear icon
    echo 4. Select "Install Add-on From File..."
    echo 5. Choose the .xpi file
    echo.
) else (
    echo.
    echo ERROR: XPI file was not created!
    echo.
)

REM Clean temp directory
rmdir /s /q "build\temp"

echo Build completed.
pause 