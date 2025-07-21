@echo off
echo Fixing XPI file structure...

REM Remove old XPI
if exist "build\status_naturalisation.xpi" del "build\status_naturalisation.xpi"

REM Go to temp directory
cd build\temp

REM Create XPI with correct structure using 7-Zip if available
if exist "C:\Program Files\7-Zip\7z.exe" (
    echo Using 7-Zip to create XPI...
    "C:\Program Files\7-Zip\7z.exe" a -tzip "..\status_naturalisation.xpi" "*" -r
) else (
    echo Using PowerShell to create XPI...
    powershell -Command "Compress-Archive -Path '*' -DestinationPath '..\status_naturalisation.xpi' -Force"
)

cd ..\..

REM Check if XPI was created
if exist "build\status_naturalisation.xpi" (
    echo.
    echo ========================================
    echo   XPI FIXED SUCCESSFULLY!
    echo ========================================
    echo.
    echo File: build\status_naturalisation.xpi
    
    REM Show file size
    for %%A in ("build\status_naturalisation.xpi") do (
        echo Size: %%~zA bytes
    )
    
    echo.
    echo Now test this XPI file in Firefox!
    echo.
) else (
    echo.
    echo ERROR: XPI file was not created!
    echo.
)

pause 