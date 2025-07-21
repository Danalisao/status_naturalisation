# 🚀 Scripts de Build - Extension Statut Naturalisation

> Scripts pour empaqueter l'extension en fichier `.xpi` pour Mozilla Firefox

## 📋 Prérequis

### Windows
- **PowerShell** (inclus par défaut dans Windows 10/11)
- **7-Zip** (optionnel, si PowerShell n'est pas disponible)

### Linux/macOS
- **zip** ou **7-Zip**
- **Bash** (inclus par défaut)

## 🛠️ Utilisation

### Windows
```cmd
# Double-cliquez sur le fichier
build.bat

# Ou exécutez depuis le terminal
.\build.bat
```

### Linux/macOS
```bash
# Rendre le script exécutable (première fois)
chmod +x build.sh

# Exécuter le script
./build.sh
```

## 📁 Structure de Build

Le script crée automatiquement la structure suivante :

```
build/
├── temp/                    # Répertoire temporaire
│   ├── manifest.json
│   ├── content.js
│   ├── utils.js
│   ├── debug.js
│   ├── crypto-js.min.js
│   ├── forge.min.js
│   ├── styles.css
│   ├── icons-config.js
│   ├── inject.js
│   └── icons/              # Dossier des icônes
│       ├── icon16.png
│       ├── icon48.png
│       └── icon128.png
└── status_naturalisation.xpi  # Fichier final
```

## ✅ Vérifications Automatiques

Les scripts vérifient automatiquement :

1. **Présence du manifest.json** dans le répertoire
2. **Tous les fichiers requis** sont copiés
3. **Dossier icons** avec les icônes
4. **Outils de compression** disponibles
5. **Création réussie** du fichier .xpi

## 🔧 Outils de Compression Supportés

### Windows
1. **PowerShell** (priorité) - `Compress-Archive`
2. **7-Zip** (fallback) - `7z.exe`

### Linux/macOS
1. **zip** (priorité) - `zip -r`
2. **7-Zip** (fallback) - `7z a -tzip`

## 📦 Installation de l'Extension

Une fois le fichier `.xpi` créé :

1. **Ouvrez Firefox**
2. **Allez dans** `about:addons`
3. **Cliquez sur l'icône d'engrenage** ⚙️
4. **Sélectionnez** "Installer un module..."
5. **Choisissez** le fichier `build/status_naturalisation.xpi`

## 🚨 Résolution des Problèmes

### Erreur "manifest.json non trouvé"
```bash
# Assurez-vous d'être dans le bon répertoire
ls manifest.json
```

### Erreur "Aucun outil de compression trouvé"

#### Windows
```cmd
# Installer 7-Zip
# Téléchargez depuis: https://7-zip.org/
```

#### Linux
```bash
# Ubuntu/Debian
sudo apt-get install zip

# CentOS/RHEL
sudo yum install zip

# macOS
brew install zip
```

### Erreur "Fichiers manquants"
```bash
# Vérifiez que tous les fichiers sont présents
ls -la *.js *.css *.json
ls -la icons/
```

## 🔄 Workflow de Développement

```bash
# 1. Modifier les fichiers
# 2. Tester localement
# 3. Build l'extension
./build.sh  # ou build.bat sur Windows

# 4. Installer dans Firefox
# 5. Tester l'extension
# 6. Itérer si nécessaire
```

## 📊 Informations de Build

Le script affiche :
- **Progression** étape par étape
- **Vérification** des fichiers
- **Taille** du fichier final
- **Instructions** d'installation

## 🎯 Exemple de Sortie

```
========================================
  Build Extension Statut Naturalisation
========================================

[1/5] Nettoyage des anciens builds...
[2/5] Création du répertoire temporaire...
[3/5] Copie des fichiers...
[4/5] Vérification des fichiers...
  - Tous les fichiers sont présents ✓
[5/5] Création du fichier .xpi...
  Utilisation de zip pour la compression...

========================================
  BUILD TERMINÉ AVEC SUCCÈS !
========================================

Fichier créé: build/status_naturalisation.xpi
Taille: 123456 octets

Pour installer l'extension:
1. Ouvrez Firefox
2. Allez dans about:addons
3. Cliquez sur l'icône d'engrenage
4. Sélectionnez "Installer un module..."
5. Choisissez le fichier .xpi

Build terminé.
```

## 🔧 Personnalisation

### Ajouter de nouveaux fichiers
Modifiez les scripts pour inclure de nouveaux fichiers :

```bash
# Dans build.sh
cp nouveau_fichier.js "build/temp/"

# Dans build.bat
copy nouveau_fichier.js "build\temp\"
```

### Changer le nom du fichier de sortie
```bash
# Modifiez la ligne dans les scripts
zip -r "../mon_extension.xpi" . -q
```

## 📝 Notes Techniques

- **Format .xpi** : Archive ZIP avec structure spécifique
- **Manifest V3** : Compatible avec Firefox 109+
- **Compression** : Optimisée pour la taille
- **Validation** : Vérification automatique des fichiers requis

---

**🎉 Vos scripts de build sont prêts ! Utilisez `build.bat` sur Windows ou `build.sh` sur Linux/macOS.** 