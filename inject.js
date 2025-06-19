/**
 * inject.js - Module d'injection sécurisé pour l'extension Status Naturalisation
 * Détecte le navigateur, injecte les scripts nécessaires dans la page web de manière sécurisée
 * Support complet pour Chrome, Firefox, Edge et autres navigateurs basés sur Chromium
 */

// Configuration de l'injection
const INJECTION_CONFIG = {
  SCRIPTS: {
    UTILS: "utils.js",
    DEBUG: "debug.js",
    CRYPTO_JS: "crypto-js.min.js",
    FORGE: "forge.min.js",
    CONTENT: "content.js"
  },
  INJECTION_ORDER: ["debug.js", "utils.js", "crypto-js.min.js", "forge.min.js", "content.js"],
  INJECTION_MARKER: "status-naturalisation-injected",
  DEBUG_LEVEL: "info" // debug, info, warn, error, none
};

/**
 * Détection robuste du navigateur et récupération de l'API appropriée
 * @returns {Object} L'API du runtime du navigateur et des informations sur le navigateur détecté
 */
function detectBrowser() {
  // Informations de base sur le navigateur
  const browserInfo = {
    name: "",
    version: "",
    isChromium: false,
    isFirefox: false,
    isEdge: false,
    isOpera: false,
    isSafari: false,
    runtime: null
  };
  
  // Détection du navigateur basée sur l'user agent et les objets globaux disponibles
  const userAgent = navigator.userAgent.toLowerCase();
  
  // Détection Firefox
  if (typeof browser !== 'undefined' && typeof browser.runtime !== 'undefined') {
    browserInfo.isFirefox = true;
    browserInfo.name = "Firefox";
    browserInfo.runtime = browser.runtime;
  }
  // Détection Edge
  else if (userAgent.indexOf("edg") !== -1) {
    browserInfo.isEdge = true;
    browserInfo.isChromium = true;
    browserInfo.name = "Edge";
    browserInfo.runtime = chrome.runtime;
  }
  // Détection Opera
  else if (userAgent.indexOf("opr") !== -1 || userAgent.indexOf("opera") !== -1) {
    browserInfo.isOpera = true;
    browserInfo.isChromium = true;
    browserInfo.name = "Opera";
    browserInfo.runtime = chrome.runtime;
  }
  // Détection Safari
  else if (userAgent.indexOf("safari") !== -1 && userAgent.indexOf("chrome") === -1) {
    browserInfo.isSafari = true;
    browserInfo.name = "Safari";
    browserInfo.runtime = chrome.runtime; // Certaines versions de Safari supportent chrome.*
  }
  // Par défaut: Chrome ou autres navigateurs basés sur Chromium
  else {
    browserInfo.isChromium = true;
    browserInfo.name = "Chrome";
    browserInfo.runtime = chrome.runtime;
  }
  
  // Extraction de la version du navigateur
  const versionMatch = userAgent.match(/(firefox|chrome|safari|opr|opera|edg)\/(\d+\.\d+)/i);
  if (versionMatch && versionMatch[2]) {
    browserInfo.version = versionMatch[2];
  }
  
  // Vérification finale de secours
  if (!browserInfo.runtime && typeof chrome !== 'undefined' && typeof chrome.runtime !== 'undefined') {
    browserInfo.runtime = chrome.runtime;
    browserInfo.name = "Unknown (using Chrome APIs)";
  }
  
  consoleLog(`Navigateur détecté: ${browserInfo.name} ${browserInfo.version}`, "info");
  return browserInfo;
}

/**
 * Vérifie si l'extension a déjà été injectée
 * @returns {boolean} True si déjà injectée, false sinon
 */
function isAlreadyInjected() {
  return document.documentElement.hasAttribute(INJECTION_CONFIG.INJECTION_MARKER);
}

/**
 * Marque la page comme ayant été injectée par l'extension
 */
function markAsInjected() {
  document.documentElement.setAttribute(INJECTION_CONFIG.INJECTION_MARKER, "true");
}

/**
 * Fonction de journalisation compatible avec le niveau de débug configuré
 * @param {string} message Le message à logger
 * @param {string} level Le niveau de log (debug, info, warn, error)
 */
function consoleLog(message, level = "debug") {
  const levels = { debug: 0, info: 1, warn: 2, error: 3, none: 4 };
  const configLevel = levels[INJECTION_CONFIG.DEBUG_LEVEL] || 1;
  const messageLevel = levels[level] || 0;
  
  if (messageLevel >= configLevel) {
    const prefix = "✨ [Status Naturalisation - Inject] ";
    switch(level) {
      case "error": console.error(prefix + message); break;
      case "warn": console.warn(prefix + message); break;
      case "info": console.info(prefix + message); break;
      default: console.debug(prefix + message);
    }
  }
}

/**
 * Injecte un script dans la page avec gestion des erreurs et retourne une promesse
 * @param {string} filePath Chemin du fichier à injecter
 * @param {Object} browserInfo Informations sur le navigateur
 * @returns {Promise} Promesse résolue quand le script est chargé
 */
function injectScript(filePath, browserInfo) {
  return new Promise((resolve, reject) => {
    if (!browserInfo || !browserInfo.runtime) {
      reject(new Error(`API de runtime non disponible pour l'injection de ${filePath}`));
      return;
    }
    
    try {
      const node = document.getElementsByTagName("body")[0] || document.documentElement;
      const script = document.createElement("script");
      
      // Configuration du script
      script.setAttribute("type", "text/javascript");
      script.setAttribute("src", browserInfo.runtime.getURL(filePath));
      script.setAttribute("data-extension-script", "true");
      
      // Gestion des événements
      script.onload = () => {
        consoleLog(`Script injecté avec succès: ${filePath}`, "info");
        resolve(filePath);
      };
      
      script.onerror = (error) => {
        consoleLog(`Erreur lors de l'injection du script ${filePath}: ${error}`, "error");
        reject(error);
      };
      
      // Injection du script
      node.appendChild(script);
    } catch (error) {
      consoleLog(`Exception lors de l'injection du script ${filePath}: ${error.message}`, "error");
      reject(error);
    }
  });
}

/**
 * Séquence d'injection principale avec gestion d'erreurs
 */
async function injectSequence() {
  // Vérification si l'injection a déjà eu lieu
  if (isAlreadyInjected()) {
    consoleLog("Scripts déjà injectés, annulation de l'injection", "warn");
    return;
  }
  
  try {
    // Détection du navigateur
    const browserInfo = detectBrowser();
    if (!browserInfo.runtime) {
      throw new Error("Impossible de détecter le runtime du navigateur");
    }
    
    consoleLog(`Début de l'injection des scripts...`, "info");
    markAsInjected();
    
    // Injection séquentielle des scripts dans l'ordre défini
    for (const scriptName of INJECTION_CONFIG.INJECTION_ORDER) {
      await injectScript(scriptName, browserInfo);
    }
    
    consoleLog("Tous les scripts ont été injectés avec succès", "info");
  } catch (error) {
    consoleLog(`Erreur fatale lors de l'injection: ${error.message}`, "error");
  }
}

// Exécution de la séquence d'injection
injectSequence();
