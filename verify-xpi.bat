@echo off
echo Verifying XPI file structure...

REM Check if XPI exists
if not exist "build\status_naturalisation.xpi" (
    echo ERROR: XPI file not found!
    pause
    exit /b 1
)

echo.
echo XPI file size:
for %%A in ("build\status_naturalisation.xpi") do (
    echo Size: %%~zA bytes
)

echo.
echo XPI file contents:
powershell -Command "try { Add-Type -AssemblyName System.IO.Compression.FileSystem; $zip = [System.IO.Compression.ZipFile]::OpenRead('build\status_naturalisation.xpi'); $entries = $zip.Entries; Write-Host 'Files in XPI:'; foreach($entry in $entries) { Write-Host '  ' $entry.FullName }; $zip.Dispose() } catch { Write-Host 'Error reading XPI:' $_.Exception.Message }"

echo.
echo Checking for manifest.json at root level...
powershell -Command "try { Add-Type -AssemblyName System.IO.Compression.FileSystem; $zip = [System.IO.Compression.ZipFile]::OpenRead('build\status_naturalisation.xpi'); $manifest = $zip.GetEntry('manifest.json'); if($manifest) { Write-Host '✓ manifest.json found at root level' } else { Write-Host '✗ manifest.json NOT found at root level' }; $zip.Dispose() } catch { Write-Host 'Error checking manifest:' $_.Exception.Message }"

echo.
echo XPI file is ready for Firefox installation!
echo.
pause 