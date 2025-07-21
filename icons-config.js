/**
 * Configuration des icônes et statuts pour l'extension Statut Naturalisation
 * Système d'icônes moderne avec support des emojis et SVG
 */

const IconsConfig = {
  // Icônes principales par statut
  statusIcons: {
    // Statuts de base
    verification_formelle: {
      emoji: '🔍',
      svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>',
      color: '#17a2b8',
      description: 'Vérification formelle des documents'
    },
    
    instruction: {
      emoji: '📋',
      svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>',
      color: '#3b82f6',
      description: 'Instruction du dossier en cours'
    },
    
    attente: {
      emoji: '⏳',
      svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',
      color: '#f59e0b',
      description: 'Dossier en attente de traitement'
    },
    
    entretien: {
      emoji: '💬',
      svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>',
      color: '#d946ef',
      description: 'Entretien d\'assimilation prévu'
    },
    
    decision: {
      emoji: '⚖️',
      svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
      color: '#ef4444',
      description: 'Décision en cours de finalisation'
    },
    
    publication: {
      emoji: '📢',
      svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',
      color: '#22c55e',
      description: 'Publication de la décision'
    },
    
    ceremonie: {
      emoji: '🎉',
      svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
      color: '#22c55e',
      description: 'Cérémonie de naturalisation'
    }
  },

  // Icônes spécifiques par étape
  stepIcons: {
    demande_envoyee: {
      emoji: '📤',
      svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>',
      color: '#22c55e',
      description: 'Demande envoyée avec succès'
    },
    
    examen_pieces: {
      emoji: '📄',
      svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>',
      color: '#17a2b8',
      description: 'Examen des pièces en cours'
    },
    
    demande_deposee: {
      emoji: '📁',
      svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"/></svg>',
      color: '#3b82f6',
      description: 'Demande déposée et enregistrée'
    },
    
    traitement_plateforme: {
      emoji: '⚙️',
      svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>',
      color: '#f59e0b',
      description: 'Traitement en cours sur la plateforme'
    },
    
    recepisse_completude: {
      emoji: '✅',
      svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>',
      color: '#22c55e',
      description: 'Récépissé de complétude reçu'
    },
    
    entretien_assimilation: {
      emoji: '👥',
      svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01 1l-1.99 2.5V18h-2v-8.5l-1.99-2.5A2.5 2.5 0 0 0 7 8H5.46c-.8 0-1.54.37-2.01 1L.96 16.37A1.5 1.5 0 0 0 2.5 18H5v6h2v-6h3v6h2v-6h3v6h2z"/></svg>',
      color: '#d946ef',
      description: 'Entretien d\'assimilation programmé'
    },
    
    traitement_sdanf: {
      emoji: '🏛️',
      svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10z"/></svg>',
      color: '#17a2b8',
      description: 'Traitement par le SDANF'
    },
    
    traitement_scec: {
      emoji: '🔐',
      svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10z"/></svg>',
      color: '#f59e0b',
      description: 'Traitement par le SCEC'
    },
    
    decision_prise: {
      emoji: '📬',
      svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>',
      color: '#ef4444',
      description: 'Décision prise et notifiée'
    },
    
    ceremonie_naturalisation: {
      emoji: '🎊',
      svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
      color: '#22c55e',
      description: 'Cérémonie de naturalisation organisée'
    }
  },

  // Icônes de préfecture
  prefectureIcons: {
    prefecture_decision_discussion: {
      emoji: '🏛️',
      svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10z"/></svg>',
      color: '#f59e0b',
      description: 'Décision en discussion hiérarchique'
    },
    
    prefecture_decision_effectuer: {
      emoji: '⚖️',
      svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
      color: '#17a2b8',
      description: 'Décision à effectuer'
    },
    
    prefecture_decision_prise: {
      emoji: '📋',
      svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>',
      color: '#22c55e',
      description: 'Décision prise par la préfecture'
    }
  },

  // Icônes utilitaires
  utilityIcons: {
    time: {
      emoji: '🕒',
      svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/><path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>',
      color: '#ef4444'
    },
    
    calendar: {
      emoji: '📅',
      svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>',
      color: '#6c757d'
    },
    
    history: {
      emoji: '📋',
      svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></svg>',
      color: '#3b82f6'
    },
    
    close: {
      emoji: '✕',
      svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',
      color: '#6c757d'
    },
    
    success: {
      emoji: '✅',
      svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>',
      color: '#22c55e'
    },
    
    warning: {
      emoji: '⚠️',
      svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>',
      color: '#f59e0b'
    },
    
    error: {
      emoji: '❌',
      svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',
      color: '#ef4444'
    },
    
    info: {
      emoji: 'ℹ️',
      svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>',
      color: '#17a2b8'
    }
  },

  // Méthodes utilitaires
  getIcon: (status, type = 'emoji') => {
    const allIcons = {
      ...IconsConfig.statusIcons,
      ...IconsConfig.stepIcons,
      ...IconsConfig.prefectureIcons,
      ...IconsConfig.utilityIcons
    };
    
    const icon = allIcons[status] || allIcons.default;
    return icon ? icon[type] : '📊';
  },

  getColor: (status) => {
    const allIcons = {
      ...IconsConfig.statusIcons,
      ...IconsConfig.stepIcons,
      ...IconsConfig.prefectureIcons,
      ...IconsConfig.utilityIcons
    };
    
    const icon = allIcons[status] || allIcons.default;
    return icon ? icon.color : '#6c757d';
  },

  getDescription: (status) => {
    const allIcons = {
      ...IconsConfig.statusIcons,
      ...IconsConfig.stepIcons,
      ...IconsConfig.prefectureIcons
    };
    
    const icon = allIcons[status];
    return icon ? icon.description : 'Statut non défini';
  },

  // Icône par défaut
  default: {
    emoji: '📊',
    svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>',
    color: '#6c757d',
    description: 'Statut non défini'
  }
};

// Export pour utilisation globale
if (typeof window !== 'undefined') {
  window.IconsConfig = IconsConfig;
}

// Export pour modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = IconsConfig;
} 