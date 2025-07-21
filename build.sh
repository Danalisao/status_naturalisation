#!/bin/bash

# Script de build pour l'extension Statut Naturalisation
# Crée un fichier .xpi pour Mozilla Firefox

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
print_header() {
    echo -e "${BLUE}"
    echo "========================================"
    echo "  Build Extension Statut Naturalisation"
    echo "========================================"
    echo -e "${NC}"
}

print_success() {
    echo -e "${GREEN}$1${NC}"
}

print_error() {
    echo -e "${RED}$1${NC}"
}

print_warning() {
    echo -e "${YELLOW}$1${NC}"
}

print_info() {
    echo -e "${BLUE}$1${NC}"
}

# Afficher l'en-tête
print_header

# Vérifier si on est dans le bon répertoire
if [ ! -f "manifest.json" ]; then
    print_error "ERREUR: manifest.json non trouvé !"
    echo "Assurez-vous d'être dans le répertoire de l'extension."
    exit 1
fi

# Créer le répertoire de build s'il n'existe pas
if [ ! -d "build" ]; then
    mkdir build
fi

# Nettoyer les anciens builds
print_info "[1/5] Nettoyage des anciens builds..."
if [ -f "build/status_naturalisation.xpi" ]; then
    rm "build/status_naturalisation.xpi"
fi
if [ -d "build/temp" ]; then
    rm -rf "build/temp"
fi

# Créer le répertoire temporaire
print_info "[2/5] Création du répertoire temporaire..."
mkdir -p "build/temp"

# Copier les fichiers nécessaires
print_info "[3/5] Copie des fichiers..."
cp manifest.json "build/temp/"
cp content.js "build/temp/"
cp utils.js "build/temp/"
cp debug.js "build/temp/"
cp crypto-js.min.js "build/temp/"
cp forge.min.js "build/temp/"
cp styles.css "build/temp/"
cp icons-config.js "build/temp/"
cp inject.js "build/temp/"

# Copier le dossier icons
if [ -d "icons" ]; then
    cp -r icons "build/temp/"
fi

# Vérifier que tous les fichiers sont présents
print_info "[4/5] Vérification des fichiers..."
missing_files=0

check_file() {
    if [ ! -f "build/temp/$1" ]; then
        print_error "  - ERREUR: $1 manquant"
        ((missing_files++))
    fi
}

check_directory() {
    if [ ! -d "build/temp/$1" ]; then
        print_error "  - ERREUR: dossier $1 manquant"
        ((missing_files++))
    fi
}

check_file "manifest.json"
check_file "content.js"
check_file "utils.js"
check_file "styles.css"
check_file "icons-config.js"
check_directory "icons"

if [ $missing_files -gt 0 ]; then
    echo
    print_error "ERREUR: $missing_files fichier(s) manquant(s) !"
    echo "Build annulé."
    exit 1
fi

print_success "  - Tous les fichiers sont présents ✓"

# Créer le fichier .xpi
print_info "[5/5] Création du fichier .xpi..."

# Aller dans le répertoire temporaire pour créer le zip
cd "build/temp"

# Vérifier les outils de compression disponibles
if command -v zip >/dev/null 2>&1; then
    print_info "  Utilisation de zip pour la compression..."
    zip -r "../status_naturalisation.xpi" . -q
elif command -v 7z >/dev/null 2>&1; then
    print_info "  Utilisation de 7-Zip pour la compression..."
    7z a -tzip "../status_naturalisation.xpi" . -r >/dev/null 2>&1
else
    print_error "  ERREUR: Aucun outil de compression trouvé !"
    echo "  Installez zip ou 7-Zip pour continuer."
    echo "  Ubuntu/Debian: sudo apt-get install zip"
    echo "  macOS: brew install zip"
    echo "  CentOS/RHEL: sudo yum install zip"
    exit 1
fi

# Retourner au répertoire parent
cd ../..

# Vérifier que le fichier .xpi a été créé
if [ -f "build/status_naturalisation.xpi" ]; then
    echo
    print_success "========================================"
    print_success "  BUILD TERMINÉ AVEC SUCCÈS !"
    print_success "========================================"
    echo
    print_info "Fichier créé: build/status_naturalisation.xpi"
    
    # Afficher la taille du fichier
    file_size=$(stat -f%z "build/status_naturalisation.xpi" 2>/dev/null || stat -c%s "build/status_naturalisation.xpi" 2>/dev/null || echo "Taille inconnue")
    print_info "Taille: $file_size octets"
    
    echo
    print_info "Pour installer l'extension:"
    echo "1. Ouvrez Firefox"
    echo "2. Allez dans about:addons"
    echo "3. Cliquez sur l'icône d'engrenage"
    echo "4. Sélectionnez \"Installer un module...\""
    echo "5. Choisissez le fichier .xpi"
    echo
else
    echo
    print_error "ERREUR: Le fichier .xpi n'a pas été créé !"
    echo
fi

# Nettoyer le répertoire temporaire
print_info "Nettoyage..."
rm -rf "build/temp"

echo
print_success "Build terminé." 