/**
 * Utils.js - Fonctions utilitaires pour l'extension Statut API du Dossier Naturalisation
 * Gère la compatibilité cross-browser, les fallbacks et les fonctionnalités partagées
 */

// Module principal
const NaturalisationUtils = (() => {
  // Configuration globale
  const CONFIG = {
    STORAGE_KEY: "naturalisation_status_data",
    HISTORY_KEY: "naturalisation_status_history",
    CACHE_KEY: "naturalisation_api_cache",
    PREFS_KEY: "naturalisation_preferences",
    HISTORY_MAX_ENTRIES: 30,
    NOTIFICATION_ID: "status_naturalisation_notification",
    CACHE_DURATION: 1000 * 60 * 30, // 30 minutes
    TOAST_DURATION: 5000, // 5 secondes
  };

  // Stockage en mémoire pour fallback
  const memoryStorage = {
    [CONFIG.STORAGE_KEY]: null,
    [CONFIG.HISTORY_KEY]: [],
    [CONFIG.CACHE_KEY]: {},
    [CONFIG.PREFS_KEY]: { darkMode: null }
  };

  // Détection du navigateur et API disponibles
  let browserInfo = {
    name: null,
    api: null,
    hasStorageAPI: false,
    hasNotificationsAPI: false,
    hasRuntimeAPI: false
  };

  /**
   * Détecte le navigateur utilisé et les APIs disponibles
   * @returns {Object} Informations sur le navigateur et les APIs disponibles
   */
  function detectBrowser() {
    let api = null;
    let name = "unknown";
    
    if (typeof browser !== "undefined") {
      api = browser;
      name = "firefox";
    } else if (typeof chrome !== "undefined") {
      api = chrome;
      if (navigator.userAgent.includes("Edg")) {
        name = "edge";
      } else {
        name = "chrome";
      }
    }

    const hasStorageAPI = Boolean(api && api.storage && api.storage.local);
    const hasNotificationsAPI = Boolean(api && api.notifications);
    const hasRuntimeAPI = Boolean(api && api.runtime);

    browserInfo = {
      name,
      api,
      hasStorageAPI,
      hasNotificationsAPI,
      hasRuntimeAPI
    };

    console.log(`Extension API Naturalisation: Navigateur détecté - ${name}`);
    console.log("Extension API Naturalisation: APIs disponibles:", {
      storage: hasStorageAPI ? "oui" : "non",
      notifications: hasNotificationsAPI ? "oui" : "non",
      runtime: hasRuntimeAPI ? "oui" : "non"
    });

    return browserInfo;
  }
  
  /**
   * Système de stockage avec fallbacks multiples
   * Extension Storage API → localStorage → sessionStorage → mémoire
   */
  const storage = {
    /**
     * Sauvegarde des données dans le stockage avec système de fallback
     * @param {string} key - Clé de stockage
     * @param {any} data - Données à stocker
     * @returns {Promise} Promise résolue après la sauvegarde
     */
    save: async function(key, data) {
      return new Promise((resolve) => {
        // Stratégie 1: Extension Storage API
        if (browserInfo.hasStorageAPI) {
          try {
            browserInfo.api.storage.local.set({ [key]: data }, () => {
              if (browserInfo.hasRuntimeAPI && browserInfo.api.runtime.lastError) {
                console.warn(`Erreur de sauvegarde (${key}): ${browserInfo.api.runtime.lastError.message}`);
                this._saveFallback(key, data);
              } else {
                console.log(`Données sauvegardées (${key}) via Extension API`);
              }
              resolve();
            });
            return; // Sortie anticipée si l'extension API est utilisée
          } catch (error) {
            console.warn(`Exception lors de la sauvegarde via Extension API (${key}):`, error);
            // Continuer avec les fallbacks
          }
        }
        
        // Exécution des fallbacks et résolution
        this._saveFallback(key, data);
        resolve();
      });
    },
    
    /**
     * Système de fallback pour la sauvegarde
     * @private
     */
    _saveFallback: function(key, data) {
      // Stratégie 2: localStorage
      try {
        if (window.localStorage) {
          localStorage.setItem(key, JSON.stringify(data));
          console.log(`Données sauvegardées (${key}) via localStorage`);
          return;
        }
      } catch (error) {
        console.warn(`Erreur localStorage (${key}):`, error);
      }
      
      // Stratégie 3: sessionStorage
      try {
        if (window.sessionStorage) {
          sessionStorage.setItem(key, JSON.stringify(data));
          console.log(`Données sauvegardées (${key}) via sessionStorage`);
          return;
        }
      } catch (error) {
        console.warn(`Erreur sessionStorage (${key}):`, error);
      }
      
      // Stratégie 4: mémoire
      memoryStorage[key] = data;
      console.log(`Données sauvegardées (${key}) en mémoire`);
    },
    
    /**
     * Récupération des données du stockage avec système de fallback
     * @param {string} key - Clé de stockage
     * @returns {Promise} Promise résolue avec les données
     */
    get: async function(key) {
      return new Promise((resolve) => {
        // Stratégie 1: Extension Storage API
        if (browserInfo.hasStorageAPI) {
          try {
            browserInfo.api.storage.local.get([key], (result) => {
              if (browserInfo.hasRuntimeAPI && browserInfo.api.runtime.lastError) {
                console.warn(`Erreur de lecture (${key}): ${browserInfo.api.runtime.lastError.message}`);
                resolve(this._getFallback(key));
              } else if (result && result[key] !== undefined) {
                console.log(`Données récupérées (${key}) via Extension API`);
                resolve(result[key]);
              } else {
                resolve(this._getFallback(key));
              }
            });
            return; // Sortie anticipée
          } catch (error) {
            console.warn(`Exception lors de la lecture via Extension API (${key}):`, error);
            // Continuer avec les fallbacks
          }
        }
        
        // Exécution des fallbacks et résolution
        resolve(this._getFallback(key));
      });
    },
    
    /**
     * Système de fallback pour la récupération
     * @private
     */
    _getFallback: function(key) {
      // Stratégie 2: localStorage
      try {
        if (window.localStorage) {
          const item = localStorage.getItem(key);
          if (item) {
            console.log(`Données récupérées (${key}) via localStorage`);
            return JSON.parse(item);
          }
        }
      } catch (error) {
        console.warn(`Erreur localStorage lecture (${key}):`, error);
      }
      
      // Stratégie 3: sessionStorage
      try {
        if (window.sessionStorage) {
          const item = sessionStorage.getItem(key);
          if (item) {
            console.log(`Données récupérées (${key}) via sessionStorage`);
            return JSON.parse(item);
          }
        }
      } catch (error) {
        console.warn(`Erreur sessionStorage lecture (${key}):`, error);
      }
      
      // Stratégie 4: mémoire
      console.log(`Données récupérées (${key}) depuis la mémoire`);      
      return memoryStorage[key];
    }
  };
  
  /**
   * Système de notifications avec fallbacks multiples
   * Extension API → Web Notifications → Toast personnalisé
   */
  const notifications = {
    /**
     * Affiche une notification avec système de fallback
     * @param {string} title - Titre de la notification
     * @param {string} message - Message de la notification
     * @param {string} type - Type de notification (info, success, warning, error)
     * @returns {Promise<boolean>} Promise résolue avec succès de l'opération
     */
    show: async function(title, message, type = 'info') {
      // Stratégie 1: Extension API Notifications
      if (browserInfo.hasNotificationsAPI) {
        try {
          // Vérifier les permissions si possible
          let permissionGranted = true;
          if (browserInfo.api.permissions && browserInfo.api.permissions.contains) {
            permissionGranted = await new Promise(resolve => {
              browserInfo.api.permissions.contains({ permissions: ['notifications'] }, (result) => {
                resolve(result);
              });
            });
          }
          
          if (permissionGranted) {
            let iconUrl = null;
            // Obtenir l'URL de l'icône
            if (browserInfo.hasRuntimeAPI && browserInfo.api.runtime.getURL) {
              iconUrl = browserInfo.api.runtime.getURL(`icons/icon48.png`);
            }
            
            // Créer la notification
            browserInfo.api.notifications.create(CONFIG.NOTIFICATION_ID, {
              type: 'basic',
              iconUrl: iconUrl || 'icons/icon48.png',
              title: title,
              message: message
            });
            console.log('Notification affichée via Extension API');
            return true;
          } else {
            console.log('Permissions de notification non accordées, fallback...');
          }
        } catch (error) {
          console.warn('Erreur lors de l\'affichage de la notification via Extension API:', error);
        }
      }
      
      // Stratégie 2: Web Notifications API
      if ('Notification' in window) {
        try {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            const notification = new Notification(title, {
              body: message,
              icon: 'icons/icon48.png'
            });
            console.log('Notification affichée via Web Notifications API');
            return true;
          }
        } catch (error) {
          console.warn('Erreur lors de l\'affichage de la notification Web:', error);
        }
      }
      
      // Stratégie 3: Toast personnalisé
      return this.showToast(title, message, type);
    },
    
    /**
     * Affiche un toast personnalisé dans l'interface
     * @param {string} title - Titre du toast
     * @param {string} message - Message du toast
     * @param {string} type - Type de toast (info, success, warning, error)
     * @returns {boolean} Succès de l'opération
     */
    showToast: function(title, message, type = 'info') {
      try {
        // Créer l'élément toast container s'il n'existe pas
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
          toastContainer = document.createElement('div');
          toastContainer.className = 'toast-container';
          document.body.appendChild(toastContainer);
        }
        
        // Générer une icône selon le type
        let icon = '🔔';
        if (type === 'success') icon = '✅';
        if (type === 'warning') icon = '⚠️';
        if (type === 'error') icon = '❌';
        if (type === 'info') icon = 'ℹ️';
        
        // Créer le toast de manière sécurisée
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        // Créer les éléments de manière sécurisée
        const toastIcon = document.createElement('div');
        toastIcon.className = 'toast-icon';
        toastIcon.textContent = icon;
        
        const toastContent = document.createElement('div');
        toastContent.className = 'toast-content';
        
        const toastHeader = document.createElement('div');
        toastHeader.className = 'toast-header';
        toastHeader.textContent = title;
        
        const toastBody = document.createElement('div');
        toastBody.className = 'toast-body';
        toastBody.textContent = message;
        
        const closeButton = document.createElement('button');
        closeButton.className = 'toast-close';
        closeButton.setAttribute('aria-label', 'Fermer');
        closeButton.textContent = '×';
        
        // Assembler la structure
        toastContent.appendChild(toastHeader);
        toastContent.appendChild(toastBody);
        toast.appendChild(toastIcon);
        toast.appendChild(toastContent);
        toast.appendChild(closeButton);
        
        // Ajouter au container
        toastContainer.appendChild(toast);
        
        // Gérer le bouton de fermeture
        if (closeButton) {
          closeButton.addEventListener('click', () => {
            toast.style.opacity = '0';
            setTimeout(() => toastContainer.removeChild(toast), 300);
          });
        }
        
        // Auto-dismiss après le délai configuré
        setTimeout(() => {
          if (toast.parentNode === toastContainer) {
            toast.style.opacity = '0';
            setTimeout(() => {
              if (toast.parentNode === toastContainer) {
                toastContainer.removeChild(toast);
              }
            }, 300);
          }
        }, CONFIG.TOAST_DURATION);
        
        console.log('Toast affiché dans l\'interface');
        return true;
      } catch (error) {
        console.error('Erreur lors de l\'affichage du toast:', error);
        return false;
      }
    }
  };
  
  /**
   * Système de cache intelligent pour les requêtes API
   * Optimise les performances et minimise les appels réseau
   */
  const cache = {
    /**
     * Sauvegarde une donnée en cache avec durée personnalisable
     * @param {string} key - Clé de cache
     * @param {any} data - Données à mettre en cache
     * @param {number} duration - Durée de validité en ms (optionnel)
     * @returns {Promise<void>}
     */
    set: async function(key, data, duration = CONFIG.CACHE_DURATION) {
      if (!key) return;
      
      const timestamp = Date.now();
      const cacheData = {
        timestamp,
        expiry: timestamp + duration,
        data
      };
      
      // Récupérer le cache existant
      const existingCache = await storage.get(CONFIG.CACHE_KEY) || {};
      
      // Ajouter la nouvelle entrée
      existingCache[key] = cacheData;
      
      // Nettoyer les entrées expirées pendant qu'on y est
      this._cleanExpired(existingCache);
      
      // Sauvegarder le cache mis à jour
      await storage.save(CONFIG.CACHE_KEY, existingCache);
      
      console.log(`Cache: entrée "${key}" mise en cache (expire dans ${duration/1000}s)`);
    },
    
    /**
     * Récupère une donnée du cache avec informations de hit/miss
     * @param {string} key - Clé de cache
     * @returns {Promise<{hit: boolean, data: any, age: number}>} Résultat avec état du hit
     */
    get: async function(key) {
      if (!key) return { hit: false, data: null, age: 0 };
      
      const existingCache = await storage.get(CONFIG.CACHE_KEY) || {};
      const cachedItem = existingCache[key];
      
      // Vérifier si l'entrée existe et n'est pas expirée
      if (cachedItem && cachedItem.expiry > Date.now()) {
        const ageMs = Date.now() - cachedItem.timestamp;
        console.log(`Cache: succès pour "${key}" (${this._getAgeText(cachedItem.timestamp)})`);
        return { hit: true, data: cachedItem.data, age: ageMs };
      }
      
      console.log(`Cache: échec pour "${key}"`);
      return { hit: false, data: null, age: 0 };
    },
    
    /**
     * Efface une entrée spécifique du cache ou tout le cache
     * @param {string} [key] - Clé à supprimer (si omis, supprime tout)
     * @returns {Promise<boolean>} Succès de l'opération
     */
    clear: async function(key) {
      if (key) {
        const existingCache = await storage.get(CONFIG.CACHE_KEY) || {};
        
        if (existingCache[key]) {
          delete existingCache[key];
          await storage.save(CONFIG.CACHE_KEY, existingCache);
          console.log(`Cache: entrée "${key}" supprimée`);
          return true;
        }
        return false;
      } else {
        await storage.save(CONFIG.CACHE_KEY, {});
        console.log('Cache: vidé intégralement');
        return true;
      }
    },
    
    /**
     * Met à jour intelligemment le cache avec stratégie stale-while-revalidate
     * @param {string} key - Clé de cache
     * @param {Function} fetchFn - Fonction asynchrone qui récupère les données fraîches
     * @param {Object} options - Options de cache
     * @param {number} options.duration - Durée de validité
     * @param {boolean} options.forceRefresh - Force le rafraîchissement
     * @param {boolean} options.returnStaleData - Retourne les données périmées pendant le rafraîchissement
     * @returns {Promise<any>} Données (du cache ou fraîches)
     */
    getOrFetch: async function(key, fetchFn, options = {}) {
      const duration = options.duration || CONFIG.CACHE_DURATION;
      const forceRefresh = options.forceRefresh || false;
      const returnStaleData = options.returnStaleData !== false;
      
      // Vérifier d'abord le cache
      const cachedResult = await this.get(key);
      
      // Si on a un hit et qu'on ne force pas le rafraîchissement, on retourne directement
      if (cachedResult.hit && !forceRefresh) {
        return cachedResult.data;
      }
      
      // Si on a des données périmées et qu'on accepte de les retourner pendant le rafraîchissement
      let staleData = null;
      let hasStaleData = false;
      
      if (returnStaleData && !cachedResult.hit) {
        // Essayer de récupérer des données potentiellement périmées
        const allCache = await storage.get(CONFIG.CACHE_KEY) || {};
        const expiredItem = allCache[key];
        if (expiredItem) {
          staleData = expiredItem.data;
          hasStaleData = true;
          console.log(`Cache: utilisation de données périmées pour "${key}" pendant rafraîchissement`);
        }
      }
      
      try {
        // Récupérer les données fraîches
        const freshData = await fetchFn();
        
        // Mettre en cache les nouvelles données
        await this.set(key, freshData, duration);
        
        return freshData;
      } catch (error) {
        console.error(`Erreur lors de la récupération des données fraîches pour "${key}":`, error);
        
        // En cas d'erreur, retourner les données périmées si disponibles
        if (hasStaleData) {
          console.log(`Utilisation des données périmées suite à l'échec de rafraîchissement`);
          return staleData;
        }
        
        // Si pas de données périmées, on essaie de récupérer depuis le cache sans vérifier l'expiration
        const allCache = await storage.get(CONFIG.CACHE_KEY) || {};
        const lastResortItem = allCache[key];
        if (lastResortItem) {
          console.log(`Cache: utilisation de données expirées en dernier recours pour "${key}"`);
          return lastResortItem.data;
        }
        
        throw error; // Propager l'erreur si rien n'est disponible
      }
    },
    
    /**
     * Analyse les performances du cache et génère des statistiques
     * @returns {Promise<Object>} Statistiques de cache
     */
    getStats: async function() {
      const allCache = await storage.get(CONFIG.CACHE_KEY) || {};
      const now = Date.now();
      const keys = Object.keys(allCache);
      
      const stats = {
        totalEntries: keys.length,
        activeEntries: 0,
        expiredEntries: 0,
        totalSize: 0,
        oldestEntry: null,
        newestEntry: null,
        averageAge: 0
      };
      
      if (keys.length === 0) return stats;
      
      let totalAgeMs = 0;
      let oldestTimestamp = Infinity;
      let newestTimestamp = 0;
      
      keys.forEach(key => {
        const item = allCache[key];
        const isExpired = item.expiry <= now;
        const itemSize = JSON.stringify(item).length;
        const ageMs = now - item.timestamp;
        
        stats.totalSize += itemSize;
        
        if (isExpired) {
          stats.expiredEntries++;
        } else {
          stats.activeEntries++;
        }
        
        totalAgeMs += ageMs;
        
        if (item.timestamp < oldestTimestamp) {
          oldestTimestamp = item.timestamp;
          stats.oldestEntry = key;
        }
        
        if (item.timestamp > newestTimestamp) {
          newestTimestamp = item.timestamp;
          stats.newestEntry = key;
        }
      });
      
      stats.averageAge = totalAgeMs / keys.length;
      
      return stats;
    },
    
    /**
     * Nettoie les entrées expirées du cache
     * @param {Object} cacheObj - Objet cache
     * @returns {number} Nombre d'entrées supprimées
     * @private
     */
    _cleanExpired: function(cacheObj) {
      const now = Date.now();
      let expiredCount = 0;
      
      Object.keys(cacheObj).forEach(key => {
        if (cacheObj[key].expiry <= now) {
          delete cacheObj[key];
          expiredCount++;
        }
      });
      
      if (expiredCount > 0) {
        console.log(`Cache: ${expiredCount} entrée(s) expirée(s) supprimée(s)`);
      }
      
      return expiredCount;
    },
    
    /**
     * Retourne un texte décrivant l'âge d'une entrée de cache
     * @param {number} timestamp - Timestamp de création
     * @returns {string} Texte descriptif
     * @private
     */
    _getAgeText: function(timestamp) {
      const ageMs = Date.now() - timestamp;
      const seconds = Math.floor(ageMs / 1000);
      
      if (seconds < 60) return `${seconds}s`;
      if (seconds < 3600) return `${Math.floor(seconds/60)}min`;
      if (seconds < 86400) return `${Math.floor(seconds/3600)}h`;
      return `${Math.floor(seconds/86400)}j`;
    }
  };
  
  /**
   * Utilitaires pour le formatage des dates et les calculs temporels
   */
  const dateUtils = {
    /**
     * Calcule une expression relative à partir d'une date (ex: "il y a 3 jours")
     * @param {string|Date} dateString - Date à comparer
     * @returns {string} Expression relative
     */
    timeAgo: function(dateString) {
      const inputDate = new Date(dateString);
      const currentDate = new Date();
      const diffInDays = Math.floor(
        (currentDate - inputDate) / (1000 * 60 * 60 * 24)
      );

      if (diffInDays === 0) return "Aujourd'hui";
      if (diffInDays === 1) return "il y a 1 jour";
      if (diffInDays <= 30) return `il y a ${diffInDays} jours`;

      const years = Math.floor(diffInDays / 365);
      const months = Math.floor((diffInDays % 365) / 30);
      const days = diffInDays % 30;

      if (years >= 1) {
        if (months === 0) {
          return `il y a ${years} ${years === 1 ? "an" : "ans"}`;
        }
        return `il y a ${years} ${years === 1 ? "an" : "ans"} et ${months} mois`;
      }

      if (months >= 1) {
        if (days === 0) {
          return `il y a ${months} ${months === 1 ? "mois" : "mois"}`;
        }
        return `il y a ${months} ${months === 1 ? "mois" : "mois"} et ${days} jours`;
      }

      return `il y a ${months} mois`;
    },
    
    /**
     * Formatte une date selon le format français
     * @param {string|Date} dateString - Date à formatter
     * @param {boolean} withTime - Inclure l'heure
     * @returns {string} Date formatée
     */
    formatDate: function(dateString, withTime = false) {
      const date = new Date(dateString);
      const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      };
      
      if (withTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
      }
      
      return date.toLocaleDateString('fr-FR', options);
    }
  };
  
  /**
   * Utilitaires pour les icônes et la visualisation selon le statut
   */
  const statusUtils = {
    // Mapping des icônes pour chaque étape du processus
    icons: {
      // Dépôt de la demande
      dossier_depose: '\ud83d\udcc1', // 📁 - 📁
      
      // Vérifications formelles
      verification_formelle_a_traiter: '\ud83d\udd0d', // 🔍 - 🔍
      verification_formelle_en_cours: '\ud83d\udd0d', // 🔍 - 🔍
      verification_formelle_mise_en_demeure: '\ud83d\udce7', // 📧 - 📧
      
      // Préfecture
      css_mise_en_demeure_a_affecter: '\ud83d\udce7', // 📧 - 📧
      css_mise_en_demeure_a_rediger: '\ud83d\udcdd', // 📝 - 📝
      instruction_a_affecter: '\ud83d\udcc2', // 📂 - 📂
      
      // Récépissé
      instruction_recepisse_completude_a_envoyer: '\ud83d\udcec', // 📬 - 📬
      instruction_recepisse_completude_a_envoyer_retour_complement_a_traiter: '\ud83d\udcec', // 📬 - 📬
      
      // Entretien
      instruction_date_ea_a_fixer: '\ud83d\udcc5', // 📅 - 📅
      ea_demande_report_ea: '\ud83d\udd04', // 🔄 - 🔄
      ea_en_attente_ea: '\ud83d\udcc5', // 📅 - 📅
      ea_crea_a_valider: '\ud83d\udcdd', // 📝 - 📝
      
      // Préfecture - Décision
      prop_decision_pref_a_effectuer: '\u2696\ufe0f', // ⚖️ - ⚖️
      prop_decision_pref_en_attente_retour_hierarchique: '\ud83d\udc64', // 👤 - 👤
      prop_decision_pref_en_attente_retour_hierarchiqu: '\ud83d\udc64', // 👤 - 👤
      prop_decision_pref_prop_a_editer: '\ud83d\udcdd', // 📝 - 📝
      prop_decision_pref_en_attente_retour_signataire: '\u270d\ufe0f', // ✍️ - ✍️
      
      // Ministère
      controle_a_affecter: '\ud83c\udfdb\ufe0f', // 🏛️ - 🏛️
      controle_a_effectuer: '\ud83d\udd0d', // 🔍 - 🔍
      controle_en_attente_pec: '\ud83d\udcc1', // 📁 - 📁
      controle_pec_a_faire: '\ud83d\udcc3', // 📃 - 📃
      controle_transmise_pour_decret: '\ud83c\udfdb\ufe0f', // 🏛️ - 🏛️
      controle_en_attente_retour_hierarchique: '\ud83d\udc64', // 👤 - 👤
      controle_decision_a_editer: '\ud83d\udcdd', // 📝 - 📝
      controle_en_attente_signature: '\u270d\ufe0f', // ✍️ - ✍️
      
      // Décret
      transmis_a_ac: '\ud83d\udce8', // 📨 - 📨
      a_verifier_avant_insertion_decret: '\ud83d\udd0d', // 🔍 - 🔍
      prete_pour_insertion_decret: '\ud83d\udcdc', // 📜 - 📜
      decret_envoye_prefecture: '\ud83d\udcec', // 📬 - 📬
      notification_envoyee: '\ud83d\udce9', // 📩 - 📩
      demande_traitee: '\u2705', // ✅ - ✅
      
      // Décision
      decret_naturalisation_publie: '\ud83c\uddeb\ud83c\uddf7', // 🇫🇷 - 🇫🇷
      decret_en_preparation: '\ud83d\udcdc', // 📜 - 📜
      decret_a_qualifier: '\ud83d\udcda', // 📚 - 📚
      decret_en_validation: '\u2705', // ✅ - ✅
      css_en_delais_recours: '\u23f3', // ⏳ - ⏳
      decision_negative_en_delais_recours: '\u23f3', // ⏳ - ⏳
      irrecevabilite_manifeste: '\u274c', // ❌ - ❌
      decision_notifiee: '\ud83d\udce8', // 📨 - 📨
      css_notifie: '\ud83d\udce8', // 📨 - 📨
      demande_en_cours_rapo: '\u23f3', // ⏳ - ⏳
      controle_demande_notifiee: '\ud83d\udce8', // 📨 - 📨
      decret_publie: '\ud83c\uddeb\ud83c\uddf7', // 🇫🇷 - 🇫🇷
      
      // Fallback
      code_non_reconnu: '\u2753', // ❓ - ❓
    },
    
    /**
     * Obtient l'icône associée au statut
     * @param {string} statusCode - Code de statut
     * @returns {string} Icône correspondante
     */
    getStatusIcon: function(statusCode) {
      return this.icons[statusCode.toLowerCase()] || this.icons.code_non_reconnu;
    },
    
    /**
     * Obtient la classe CSS correspondant au type de statut
     * @param {string} statusCode - Code de statut
     * @returns {string} Classe CSS
     */
    getStatusClass: function(statusCode) {
      // Groupés par étapes
      const statusCode_lower = statusCode.toLowerCase();
      
      if (statusCode_lower.includes('verification_formelle')) {
        return 'status-verification-formelle';
      }
      
      if (statusCode_lower.includes('instruction') || statusCode_lower.includes('css_mise_en_demeure')) {
        return 'status-instruction';
      }
      
      if (statusCode_lower.includes('ea_')) {
        return 'status-entretien';
      }
      
      if (statusCode_lower.includes('prop_decision')) {
        return 'status-decision';
      }
      
      if (statusCode_lower.includes('controle')) {
        return 'status-attente';
      }
      
      if (statusCode_lower.includes('decret') || statusCode_lower.includes('notification')) {
        return 'status-publication';
      }
      
      return 'status-neutral';
    }
  };
  
  // API publique du module
  return {
    CONFIG,
    detectBrowser,
    storage,
    notifications,
    cache,
    dateUtils,
    statusUtils,
    
    // Initialisation du module
    init: function() {
      detectBrowser();
      return this;
    }
  };
})();

// Auto-initialisation
NaturalisationUtils.init();

// Export pour utilisation dans d'autres scripts
if (typeof module !== 'undefined') {
  module.exports = NaturalisationUtils;
}
