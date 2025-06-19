/**
 * debug.js - Module de diagnostic et de journalisation pour l'extension de statut de naturalisation
 * Ce module facilite le débogage et le diagnostic des problèmes sur différents navigateurs.
 */

const NaturalisationDebug = (function() {
  'use strict';

  // Récupération du module d'utilitaires s'il existe déjà
  const utils = typeof NaturalisationUtils !== 'undefined' ? 
    NaturalisationUtils : { CONFIG: { DEBUG_MODE: false } };

  // Configuration
  const CONFIG = {
    DEBUG_MODE: utils.CONFIG?.DEBUG_MODE || false,
    LOG_LEVEL: {
      ERROR: 0,
      WARN: 1,
      INFO: 2,
      DEBUG: 3,
      TRACE: 4
    },
    CURRENT_LEVEL: 2, // Par défaut: INFO
    LOG_PREFIX: '🔍 [Naturalisation] ',
    PERFORMANCE_LOG: true,
    ERROR_REPORT_URL: null // URL vers laquelle envoyer les rapports d'erreur (optionnel)
  };

  /**
   * Mise en forme des logs avec préfixe, heure et couleurs
   * @private
   */
  const _formatLog = function(level, message, data) {
    const timestamp = new Date().toISOString().substring(11, 19);
    let prefix = CONFIG.LOG_PREFIX;
    let color = '';
    let levelText = '';
    
    switch(level) {
      case CONFIG.LOG_LEVEL.ERROR:
        prefix += '🔴 ';
        color = 'color: #FF5252; font-weight: bold';
        levelText = 'ERROR';
        break;
      case CONFIG.LOG_LEVEL.WARN:
        prefix += '🟠 ';
        color = 'color: #FFC107; font-weight: bold';
        levelText = 'WARN';
        break;
      case CONFIG.LOG_LEVEL.INFO:
        prefix += '🟢 ';
        color = 'color: #4CAF50';
        levelText = 'INFO';
        break;
      case CONFIG.LOG_LEVEL.DEBUG:
        prefix += '🔵 ';
        color = 'color: #2196F3';
        levelText = 'DEBUG';
        break;
      case CONFIG.LOG_LEVEL.TRACE:
        prefix += '⚪ ';
        color = 'color: #9E9E9E';
        levelText = 'TRACE';
        break;
    }

    return {
      prefix: `${prefix}[${timestamp}][${levelText}] `,
      color,
      message,
      data
    };
  };

  /**
   * Journalisation de base avec niveau
   * @private
   */
  const _log = function(level, message, data) {
    if (!CONFIG.DEBUG_MODE && level > CONFIG.LOG_LEVEL.ERROR) return;
    if (level > CONFIG.CURRENT_LEVEL) return;
    
    const logInfo = _formatLog(level, message, data);
    
    if (typeof console !== 'undefined') {
      if (data !== undefined) {
        console.log(`%c${logInfo.prefix}${logInfo.message}`, logInfo.color, logInfo.data);
      } else {
        console.log(`%c${logInfo.prefix}${logInfo.message}`, logInfo.color);
      }
    }
  };

  /**
   * Objet pour suivre les performances
   * @private
   */
  const _perfMarks = {};

  /**
   * API publique du module de débogage
   */
  return {
    /**
     * Active ou désactive le mode débogage
     * @param {boolean} enable - Activer/désactiver le débogage
     */
    setDebugMode: function(enable) {
      CONFIG.DEBUG_MODE = !!enable;
      this.info(`Mode débogage ${CONFIG.DEBUG_MODE ? 'activé' : 'désactivé'}`);
      return this;
    },

    /**
     * Définit le niveau de journalisation
     * @param {number} level - Niveau de journalisation
     */
    setLogLevel: function(level) {
      if (level >= CONFIG.LOG_LEVEL.ERROR && level <= CONFIG.LOG_LEVEL.TRACE) {
        CONFIG.CURRENT_LEVEL = level;
      }
      return this;
    },

    /**
     * Vérifie si le mode débogage est activé
     * @returns {boolean} État du mode débogage
     */
    isDebugEnabled: function() {
      return CONFIG.DEBUG_MODE;
    },

    /**
     * Journal d'erreurs
     * @param {string} message - Message d'erreur
     * @param {any} [data] - Données supplémentaires
     */
    error: function(message, data) {
      _log(CONFIG.LOG_LEVEL.ERROR, message, data);
      return this;
    },

    /**
     * Journal d'avertissements
     * @param {string} message - Message d'avertissement
     * @param {any} [data] - Données supplémentaires
     */
    warn: function(message, data) {
      _log(CONFIG.LOG_LEVEL.WARN, message, data);
      return this;
    },

    /**
     * Journal d'informations
     * @param {string} message - Message d'information
     * @param {any} [data] - Données supplémentaires
     */
    info: function(message, data) {
      _log(CONFIG.LOG_LEVEL.INFO, message, data);
      return this;
    },

    /**
     * Journal de débogage
     * @param {string} message - Message de débogage
     * @param {any} [data] - Données supplémentaires
     */
    debug: function(message, data) {
      _log(CONFIG.LOG_LEVEL.DEBUG, message, data);
      return this;
    },

    /**
     * Journal de trace
     * @param {string} message - Message de trace
     * @param {any} [data] - Données supplémentaires
     */
    trace: function(message, data) {
      _log(CONFIG.LOG_LEVEL.TRACE, message, data);
      return this;
    },

    /**
     * Démarrer un chronomètre de performance
     * @param {string} label - Nom du chronomètre
     */
    startTimer: function(label) {
      if (!CONFIG.PERFORMANCE_LOG) return this;
      
      if (!label) {
        label = `timer_${Date.now()}`;
      }
      
      _perfMarks[label] = performance.now();
      this.debug(`Performance: démarrage du chronomètre "${label}"`);
      return this;
    },

    /**
     * Terminer un chronomètre et journaliser le temps écoulé
     * @param {string} label - Nom du chronomètre
     * @returns {number} Temps écoulé en ms
     */
    endTimer: function(label) {
      if (!CONFIG.PERFORMANCE_LOG) return 0;
      if (!label || !_perfMarks[label]) return 0;
      
      const endTime = performance.now();
      const startTime = _perfMarks[label];
      const duration = endTime - startTime;
      
      delete _perfMarks[label];
      
      this.debug(`Performance: "${label}" a pris ${duration.toFixed(2)}ms`);
      return duration;
    },

    /**
     * Journalise les détails du navigateur et de l'environnement
     */
    logEnvironment: function() {
      if (typeof navigator === 'undefined') return this;
      
      const browserInfo = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        vendor: navigator.vendor,
        cookiesEnabled: navigator.cookieEnabled
      };
      
      this.info('Informations sur l\'environnement:', browserInfo);
      return this;
    },

    /**
     * Journalise les modules disponibles
     * @param {Object} modules - Object contenant les modules à vérifier
     */
    logModulesStatus: function(modules = {}) {
      const status = {};
      
      // Vérifier l'objet utils
      status.utils = typeof NaturalisationUtils !== 'undefined';
      
      // Vérifier les bibliothèques crypto
      status.forge = typeof forge !== 'undefined';
      status.CryptoJS = typeof CryptoJS !== 'undefined';
      
      // Vérifier les modules spécifiés
      Object.keys(modules).forEach(key => {
        status[key] = !!modules[key];
      });
      
      this.info('État des modules:', status);
      return this;
    },

    /**
     * Capture et journalise une erreur
     * @param {Error} error - Objet d'erreur à journaliser
     */
    captureError: function(error) {
      this.error('Exception capturée:', {
        message: error.message,
        name: error.name,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      
      // Si une URL de rapport est configurée, envoyer l'erreur
      if (CONFIG.ERROR_REPORT_URL && typeof fetch !== 'undefined') {
        try {
          fetch(CONFIG.ERROR_REPORT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: error.message,
              name: error.name,
              stack: error.stack,
              userAgent: navigator.userAgent,
              timestamp: new Date().toISOString()
            })
          }).catch(e => {
            this.error('Échec de l\'envoi du rapport d\'erreur:', e);
          });
        } catch (e) {
          this.error('Échec de la préparation du rapport d\'erreur:', e);
        }
      }
      
      return this;
    },

    /**
     * Inspecte un élément DOM et affiche ses caractéristiques
     * @param {Element|string} element - Élément DOM ou sélecteur CSS
     */
    inspectElement: function(element) {
      try {
        const el = typeof element === 'string' 
          ? document.querySelector(element) 
          : element;
          
        if (!el) {
          this.warn(`Élément non trouvé: ${element}`);
          return this;
        }
        
        const styles = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        
        this.debug('Inspection de l\'élément:', {
          element: el,
          tagName: el.tagName,
          id: el.id,
          classes: Array.from(el.classList),
          attributes: Array.from(el.attributes).map(attr => ({
            name: attr.name,
            value: attr.value
          })),
          dimensions: {
            width: rect.width,
            height: rect.height,
            top: rect.top,
            left: rect.left
          },
          styles: {
            display: styles.display,
            position: styles.position,
            visibility: styles.visibility,
            opacity: styles.opacity,
            zIndex: styles.zIndex
          },
          content: el.textContent.substring(0, 100) + (el.textContent.length > 100 ? '...' : '')
        });
      } catch (e) {
        this.error('Erreur lors de l\'inspection de l\'élément:', e);
      }
      
      return this;
    },

    /**
     * Initialisation du module de débogage
     */
    init: function(options = {}) {
      // Fusionner les options avec la configuration par défaut
      if (options.DEBUG_MODE !== undefined) CONFIG.DEBUG_MODE = !!options.DEBUG_MODE;
      if (options.CURRENT_LEVEL !== undefined) CONFIG.CURRENT_LEVEL = options.CURRENT_LEVEL;
      if (options.LOG_PREFIX !== undefined) CONFIG.LOG_PREFIX = options.LOG_PREFIX;
      if (options.PERFORMANCE_LOG !== undefined) CONFIG.PERFORMANCE_LOG = !!options.PERFORMANCE_LOG;
      if (options.ERROR_REPORT_URL !== undefined) CONFIG.ERROR_REPORT_URL = options.ERROR_REPORT_URL;
      
      this.info('Module de débogage initialisé');
      
      // Installation d'un gestionnaire d'erreurs global si en mode débogage
      if (CONFIG.DEBUG_MODE && typeof window !== 'undefined') {
        window.addEventListener('error', (event) => {
          this.captureError(event.error || new Error(event.message));
          return false;
        });
        
        window.addEventListener('unhandledrejection', (event) => {
          this.error('Promesse rejetée non gérée:', event.reason);
          return false;
        });
        
        this.info('Gestionnaires d\'erreurs globaux installés');
      }
      
      return this;
    }
  };
})();

// Auto-initialisation avec configuration par défaut
NaturalisationDebug.init();

// Export pour utilisation dans d'autres scripts
if (typeof module !== 'undefined') {
  module.exports = NaturalisationDebug;
}
