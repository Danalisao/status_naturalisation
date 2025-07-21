@echo off
REM Script de build pour l'extension Statut Naturalisation
REM Crée un fichier .xpi pour Mozilla Firefox

echo.
echo ========================================
echo   Build Extension Statut Naturalisation
echo ========================================
echo.

REM Vérifier si on est dans le bon répertoire
if not exist "manifest.json" (
    echo ERREUR: manifest.json non trouvé !
    echo Assurez-vous d'être dans le répertoire de l'extension.
    pause
    exit /b 1
)

REM Créer le répertoire de build s'il n'existe pas
if not exist "build" mkdir build

REM Nettoyer les anciens builds
echo [1/5] Nettoyage des anciens builds...
if exist "build\status_naturalisation.xpi" del "build\status_naturalisation.xpi"
if exist "build\temp" rmdir /s /q "build\temp"

REM Créer le répertoire temporaire
echo [2/5] Création du répertoire temporaire...
mkdir "build\temp"

REM Copier les fichiers nécessaires
echo [3/5] Copie des fichiers...
copy "manifest.json" "build\temp\"
copy "content.js" "build\temp\"
copy "utils.js" "build\temp\"
copy "debug.js" "build\temp\"
copy "crypto-js.min.js" "build\temp\"
copy "forge.min.js" "build\temp\"
copy "styles.css" "build\temp\"
copy "icons-config.js" "build\temp\"
copy "inject.js" "build\temp\"

REM Copier le dossier icons
if exist "icons" (
    xcopy "icons" "build\temp\icons\" /e /i /y
)

REM Vérifier que tous les fichiers sont présents
echo [4/5] Vérification des fichiers...
set missing_files=0

if not exist "build\temp\manifest.json" (
    echo   - ERREUR: manifest.json manquant
    set /a missing_files+=1
)
if not exist "build\temp\content.js" (
    echo   - ERREUR: content.js manquant
    set /a missing_files+=1
)
if not exist "build\temp\utils.js" (
    echo   - ERREUR: utils.js manquant
    set /a missing_files+=1
)
if not exist "build\temp\styles.css" (
    echo   - ERREUR: styles.css manquant
    set /a missing_files+=1
)
if not exist "build\temp\icons-config.js" (
    echo   - ERREUR: icons-config.js manquant
    set /a missing_files+=1
)
if not exist "build\temp\icons" (
    echo   - ERREUR: dossier icons manquant
    set /a missing_files+=1
)

if %missing_files% gtr 0 (
    echo.
    echo ERREUR: %missing_files% fichier(s) manquant(s) !
    echo Build annulé.
    pause
    exit /b 1
)

echo   - Tous les fichiers sont présents ✓

REM Créer le fichier .xpi
echo [5/5] Création du fichier .xpi...

REM Aller dans le répertoire temporaire pour créer le zip
cd build\temp

REM Vérifier si PowerShell est disponible
powershell -Command "Get-Command" >nul 2>&1
if %errorlevel% equ 0 (
    echo   Utilisation de PowerShell pour la compression...
    powershell -Command "Compress-Archive -Path '.' -DestinationPath '..\status_naturalisation.xpi' -Force"
) else (
    echo   PowerShell non disponible, tentative avec 7-Zip...
    if exist "C:\Program Files\7-Zip\7z.exe" (
        "C:\Program Files\7-Zip\7z.exe" a -tzip "..\status_naturalisation.xpi" "*" -r
    ) else (
        echo   ERREUR: Aucun outil de compression trouvé !
        echo   Installez PowerShell ou 7-Zip pour continuer.
        cd ..\..
        pause
        exit /b 1
    )
)

REM Retourner au répertoire parent
cd ..\..

REM Vérifier que le fichier .xpi a été créé
if exist "build\status_naturalisation.xpi" (
    echo.
    echo ========================================
    echo   BUILD TERMINÉ AVEC SUCCÈS !
    echo ========================================
    echo.
    echo Fichier créé: build\status_naturalisation.xpi
    
    REM Afficher la taille du fichier
    for %%A in ("build\status_naturalisation.xpi") do (
        echo Taille: %%~zA octets
    )
    
    echo.
    echo Pour installer l'extension:
    echo 1. Ouvrez Firefox
    echo 2. Allez dans about:addons
    echo 3. Cliquez sur l'icône d'engrenage
    echo 4. Sélectionnez "Installer un module..."
    echo 5. Choisissez le fichier .xpi
    echo.
) else (
    echo.
    echo ERREUR: Le fichier .xpi n'a pas été créé !
    echo.
)

REM Nettoyer le répertoire temporaire
echo Nettoyage...
rmdir /s /q "build\temp"

echo.
echo Build terminé.
pause 