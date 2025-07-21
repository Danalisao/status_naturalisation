@echo off
echo Testing XPI file structure...

REM Check if XPI exists
if not exist "build\status_naturalisation.xpi" (
    echo ERROR: XPI file not found!
    pause
    exit /b 1
)

echo.
echo Current XPI file size:
for %%A in ("build\status_naturalisation.xpi") do (
    echo Size: %%~zA bytes
)

echo.
echo Testing XPI structure with PowerShell...
powershell -Command "try { Add-Type -AssemblyName System.IO.Compression.FileSystem; $zip = [System.IO.Compression.ZipFile]::OpenRead('build\status_naturalisation.xpi'); $entries = $zip.Entries; Write-Host 'Files in XPI:'; foreach($entry in $entries) { Write-Host $entry.FullName }; $zip.Dispose() } catch { Write-Host 'Error reading XPI:' $_.Exception.Message }"

echo.
echo Creating corrected XPI...
cd build\temp

REM Create new XPI with correct structure
powershell -Command "try { $files = Get-ChildItem -Path '.' -Recurse; $zipPath = '..\status_naturalisation_fixed.xpi'; if(Test-Path $zipPath) { Remove-Item $zipPath }; [System.IO.Compression.ZipFile]::CreateFromDirectory('.', $zipPath); Write-Host 'Fixed XPI created successfully' } catch { Write-Host 'Error creating XPI:' $_.Exception.Message }"

cd ..\..

REM Check if fixed XPI was created
if exist "build\status_naturalisation_fixed.xpi" (
    echo.
    echo ========================================
    echo   FIXED XPI CREATED!
    echo ========================================
    echo.
    echo Original: build\status_naturalisation.xpi
    echo Fixed:    build\status_naturalisation_fixed.xpi
    
    REM Show file size
    for %%A in ("build\status_naturalisation_fixed.xpi") do (
        echo Size: %%~zA bytes
    )
    
    echo.
    echo Test the fixed XPI file in Firefox!
    echo.
) else (
    echo.
    echo ERROR: Fixed XPI was not created!
    echo.
)

pause 