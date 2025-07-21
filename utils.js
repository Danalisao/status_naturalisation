/**
 * Utilitaires pour l'extension Statut Naturalisation
 * Système d'icônes moderne et utilitaires ergonomiques
 */

const NaturalisationUtils = {
  CONFIG: {
    STORAGE_KEY: "naturalisation_status_data",
    HISTORY_KEY: "naturalisation_status_history", 
    HISTORY_MAX_ENTRIES: 30,
    NOTIFICATION_ID: "status_naturalisation_notification"
  },

  // Détection du navigateur
  detectBrowser: () => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Firefox')) return 'firefox';
    if (userAgent.includes('Chrome')) return 'chrome';
    if (userAgent.includes('Safari')) return 'safari';
    if (userAgent.includes('Edge')) return 'edge';
    return 'unknown';
  },

  // Gestion du stockage
  storage: {
    save: async (key, data) => {
      try {
        if (typeof browser !== 'undefined' && browser.storage) {
          await browser.storage.local.set({ [key]: data });
        } else if (typeof chrome !== 'undefined' && chrome.storage) {
          await chrome.storage.local.set({ [key]: data });
        } else {
          localStorage.setItem(key, JSON.stringify(data));
        }
        return true;
      } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        return false;
      }
    },

    get: async (key) => {
      try {
        if (typeof browser !== 'undefined' && browser.storage) {
          const result = await browser.storage.local.get(key);
          return result[key];
        } else if (typeof chrome !== 'undefined' && chrome.storage) {
          const result = await chrome.storage.local.get(key);
          return result[key];
        } else {
          const item = localStorage.getItem(key);
          return item ? JSON.parse(item) : null;
        }
      } catch (error) {
        console.error('Erreur lors de la récupération:', error);
        return null;
      }
    }
  },

  // Notifications
  notifications: {
    show: async (title, message, type = 'info') => {
      try {
        if (typeof browser !== 'undefined' && browser.notifications) {
          await browser.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon48.png',
            title: title,
            message: message
          });
        } else if (typeof chrome !== 'undefined' && chrome.notifications) {
          await chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon48.png',
            title: title,
            message: message
          });
        } else {
          // Fallback pour les navigateurs sans API notifications
          console.log(`[${type.toUpperCase()}] ${title}: ${message}`);
        }
      } catch (error) {
        console.error('Erreur lors de l\'affichage de la notification:', error);
      }
    }
  },

  // Cache
  cache: {
    set: async (key, data, ttl = 30 * 60 * 1000) => {
      const item = {
        data,
        timestamp: Date.now(),
        ttl
      };
      await NaturalisationUtils.storage.save(`cache_${key}`, item);
    },

    get: async (key) => {
      const item = await NaturalisationUtils.storage.get(`cache_${key}`);
      if (!item) return null;
      
      const now = Date.now();
      if (now - item.timestamp > item.ttl) {
        await NaturalisationUtils.cache.clear(key);
        return null;
      }
      
      return item.data;
    },

    clear: async (key) => {
      if (typeof browser !== 'undefined' && browser.storage) {
        await browser.storage.local.remove(`cache_${key}`);
      } else if (typeof chrome !== 'undefined' && chrome.storage) {
        await chrome.storage.local.remove(`cache_${key}`);
      } else {
        localStorage.removeItem(`cache_${key}`);
      }
    }
  },

  // Utilitaires de date
  dateUtils: {
    timeAgo: (dateString) => {
      if (!dateString) return 'Date inconnue';
      
      const date = new Date(dateString);
      const now = new Date();
      const diffInMs = now - date;
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      
      if (diffInDays === 0) return 'Aujourd\'hui';
      if (diffInDays === 1) return 'Hier';
      if (diffInDays < 7) return `Il y a ${diffInDays} jours`;
      if (diffInDays < 30) return `Il y a ${Math.floor(diffInDays / 7)} semaines`;
      if (diffInDays < 365) return `Il y a ${Math.floor(diffInDays / 30)} mois`;
      return `Il y a ${Math.floor(diffInDays / 365)} ans`;
    },

    formatDate: (dateString) => {
      if (!dateString) return 'Date inconnue';
      
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    isToday: (dateString) => {
      if (!dateString) return false;
      
      const date = new Date(dateString);
      const today = new Date();
      return date.toDateString() === today.toDateString();
    },

    isRecent: (dateString, days = 7) => {
      if (!dateString) return false;
      
      const date = new Date(dateString);
      const now = new Date();
      const diffInMs = now - date;
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      
      return diffInDays <= days;
    }
  },

  // Utilitaires de statut avec icônes modernes
  statusUtils: {
    getStatusIcon: (status) => {
      const iconMap = {
        // Statuts principaux
        'verification_formelle': '🔍',
        'instruction': '📋',
        'attente': '⏳',
        'entretien': '💬',
        'decision': '⚖️',
        'publication': '📢',
        'ceremonie': '🎉',
        
        // Statuts spécifiques
        'demande_envoyee': '📤',
        'examen_pieces': '📄',
        'demande_deposee': '📁',
        'traitement_plateforme': '⚙️',
        'recepisse_completude': '✅',
        'entretien_assimilation': '👥',
        'traitement_sdanf': '🏛️',
        'traitement_scec': '🔐',
        'decision_prise': '📬',
        'ceremonie_naturalisation': '🎊',
        
        // Statuts de préfecture
        'prefecture_decision_discussion': '🏛️',
        'prefecture_decision_effectuer': '⚖️',
        'prefecture_decision_prise': '📋',
        
        // Statuts par défaut
        'default': '📊',
        'loading': '🔄',
        'error': '❌',
        'success': '✅',
        'warning': '⚠️',
        'info': 'ℹ️'
      };
      
      return iconMap[status] || iconMap.default;
    },

    getStatusClass: (status) => {
      const classMap = {
        'verification_formelle': 'status-verification-formelle',
        'instruction': 'status-instruction',
        'attente': 'status-attente',
        'entretien': 'status-entretien',
        'decision': 'status-decision',
        'publication': 'status-publication',
        'ceremonie': 'status-ceremonie',
        
        'demande_envoyee': 'status-success',
        'examen_pieces': 'status-info',
        'demande_deposee': 'status-primary',
        'traitement_plateforme': 'status-warning',
        'recepisse_completude': 'status-success',
        'entretien_assimilation': 'status-secondary',
        'traitement_sdanf': 'status-info',
        'traitement_scec': 'status-warning',
        'decision_prise': 'status-decision',
        'ceremonie_naturalisation': 'status-success',
        
        'prefecture_decision_discussion': 'status-warning',
        'prefecture_decision_effectuer': 'status-info',
        'prefecture_decision_prise': 'status-success'
      };
      
      return classMap[status] || 'status-default';
    },

    getStatusColor: (status) => {
      const colorMap = {
        'verification_formelle': '#17a2b8',
        'instruction': '#3b82f6',
        'attente': '#f59e0b',
        'entretien': '#d946ef',
        'decision': '#ef4444',
        'publication': '#22c55e',
        'ceremonie': '#22c55e',
        
        'demande_envoyee': '#22c55e',
        'examen_pieces': '#17a2b8',
        'demande_deposee': '#3b82f6',
        'traitement_plateforme': '#f59e0b',
        'recepisse_completude': '#22c55e',
        'entretien_assimilation': '#d946ef',
        'traitement_sdanf': '#17a2b8',
        'traitement_scec': '#f59e0b',
        'decision_prise': '#ef4444',
        'ceremonie_naturalisation': '#22c55e',
        
        'prefecture_decision_discussion': '#f59e0b',
        'prefecture_decision_effectuer': '#17a2b8',
        'prefecture_decision_prise': '#22c55e'
      };
      
      return colorMap[status] || '#6c757d';
    },

    getStatusDescription: (status) => {
      const descriptionMap = {
        'verification_formelle': 'Vérification formelle des documents',
        'instruction': 'Instruction du dossier en cours',
        'attente': 'Dossier en attente de traitement',
        'entretien': 'Entretien d\'assimilation prévu',
        'decision': 'Décision en cours de finalisation',
        'publication': 'Publication de la décision',
        'ceremonie': 'Cérémonie de naturalisation',
        
        'demande_envoyee': 'Demande envoyée avec succès',
        'examen_pieces': 'Examen des pièces en cours',
        'demande_deposee': 'Demande déposée et enregistrée',
        'traitement_plateforme': 'Traitement en cours sur la plateforme',
        'recepisse_completude': 'Récépissé de complétude reçu',
        'entretien_assimilation': 'Entretien d\'assimilation programmé',
        'traitement_sdanf': 'Traitement par le SDANF',
        'traitement_scec': 'Traitement par le SCEC',
        'decision_prise': 'Décision prise et notifiée',
        'ceremonie_naturalisation': 'Cérémonie de naturalisation organisée',
        
        'prefecture_decision_discussion': 'Décision en discussion hiérarchique',
        'prefecture_decision_effectuer': 'Décision à effectuer',
        'prefecture_decision_prise': 'Décision prise par la préfecture'
      };
      
      return descriptionMap[status] || 'Statut non défini';
    }
  },

  // Utilitaires DOM
  domUtils: {
    createElementWithUniqueId: (tag, id, className) => {
      const el = document.createElement(tag);
      if (id) el.id = id;
      if (className) el.className = className;
      return el;
    },

    generateUniqueId: (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,

    elementExists: (id) => !!document.getElementById(id),

    addAnimation: (element, animationClass, duration = 1000) => {
      element.classList.add(animationClass);
      setTimeout(() => {
        element.classList.remove(animationClass);
      }, duration);
    },

    createToast: (message, type = 'info', duration = 5000) => {
      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      toast.innerHTML = `
        <div class="toast-icon">${NaturalisationUtils.statusUtils.getStatusIcon(type)}</div>
        <div class="toast-content">
          <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">×</button>
      `;
      
      // Ajouter au container de toasts
      let container = document.querySelector('.toast-container');
      if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
      }
      
      container.appendChild(toast);
      
      // Auto-remove après la durée spécifiée
      setTimeout(() => {
        if (toast.parentElement) {
          toast.remove();
        }
      }, duration);
      
      return toast;
    },

    // Système de thème
    theme: {
      isDarkMode: () => {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      },

      toggleTheme: () => {
        const isDark = NaturalisationUtils.domUtils.theme.isDarkMode();
        document.documentElement.classList.toggle('naturalisation-dark-mode', isDark);
      },

      applyTheme: () => {
        const isDark = NaturalisationUtils.domUtils.theme.isDarkMode();
        document.documentElement.classList.toggle('naturalisation-dark-mode', isDark);
      }
    }
  },

  // Utilitaires de performance
  performance: {
    debounce: (func, wait) => {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },

    throttle: (func, limit) => {
      let inThrottle;
      return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    },

    measureTime: (name, fn) => {
      const start = performance.now();
      const result = fn();
      const end = performance.now();
      console.log(`${name} took ${end - start}ms`);
      return result;
    }
  },

  // Utilitaires de validation
  validation: {
    isValidDate: (dateString) => {
      const date = new Date(dateString);
      return date instanceof Date && !isNaN(date);
    },

    isValidEmail: (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },

    sanitizeHtml: (html) => {
      const div = document.createElement('div');
      div.textContent = html;
      return div.innerHTML;
    }
  },

  // Utilitaires d'accessibilité
  a11y: {
    announceToScreenReader: (message) => {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = message;
      
      document.body.appendChild(announcement);
      
      setTimeout(() => {
        if (announcement.parentElement) {
          announcement.remove();
        }
      }, 1000);
    },

    focusTrap: (element) => {
      const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      element.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement.focus();
              e.preventDefault();
            }
          }
        }
      });
    }
  }
};

// Export pour utilisation globale
if (typeof window !== 'undefined') {
  window.NaturalisationUtils = NaturalisationUtils;
}

// Export pour modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NaturalisationUtils;
}
