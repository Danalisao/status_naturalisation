/**
 * content.js - Script principal de l'extension Statut Naturalisation
 * Implémente l'interface utilisateur moderne avec design glassmorphism, timeline interactive,
 * et utilise les modules utilitaires pour la gestion du stockage et des notifications.
 */
(async function () {
  // Protection contre les exécutions multiples
  if (window.naturalisationExtensionLoaded) {
    console.log('Extension API Naturalisation : Déjà chargée, abandon de la nouvelle exécution');
    return;
  }
  window.naturalisationExtensionLoaded = true;
  // Utiliser les modules d'utilitaires si disponibles, sinon créer des objets de remplacement
  const utils = typeof NaturalisationUtils !== 'undefined' ? 
    NaturalisationUtils : {
      CONFIG: {
        STORAGE_KEY: "naturalisation_status_data_fallback",
        HISTORY_KEY: "naturalisation_status_history_fallback", 
        HISTORY_MAX_ENTRIES: 30,
        NOTIFICATION_ID: "status_naturalisation_notification_fallback"
      },
      detectBrowser: () => null,
      storage: {
        save: async () => null,
        get: async () => null
      },
      notifications: {
        show: async () => null
      },
      cache: {
        set: async () => null,
        get: async () => null,
        clear: async () => null
      },
      dateUtils: {
        timeAgo: () => '',
        formatDate: () => ''
      },
      statusUtils: {
        getStatusIcon: () => '❓',
        getStatusClass: () => ''
      },
      domUtils: {
        createElementWithUniqueId: (tag, id, className) => {
          const el = document.createElement(tag);
          if (id) el.id = id;
          if (className) el.className = className;
          return el;
        },
        generateUniqueId: (prefix) => `${prefix}-${Date.now()}`,
        elementExists: (id) => !!document.getElementById(id)
      }
    };
  
  const debug = typeof NaturalisationDebug !== 'undefined' ? 
    NaturalisationDebug : {
      isDebugEnabled: () => false,
      setDebugMode: () => null,
      error: console.error,
      warn: console.warn,
      info: console.info,
      debug: console.debug,
      trace: console.trace,
      startTimer: () => null,
      endTimer: () => 0,
      logEnvironment: () => null,
      logModulesStatus: () => null,
      captureError: (e) => console.error(e)
    };

  // Initialiser le module de debug
  debug.setDebugMode(true);
  debug.logEnvironment();
  debug.logModulesStatus({
    utils: typeof NaturalisationUtils !== 'undefined',
    debug: typeof NaturalisationDebug !== 'undefined'
  });

  // Configuration de l'extension
  const CONFIG = {
    URL_PATTERN: "administration-etrangers-en-france",
    TAB_NAME: "Demande d'accès à la Nationalité Française",
    API_ENDPOINT:
      "https://administration-etrangers-en-france.interieur.gouv.fr/api/anf/dossier-stepper",
    WAIT_TIME: 100,
    STORAGE_KEY: utils.CONFIG.STORAGE_KEY || "naturalisation_status_data_fallback",
    HISTORY_KEY: utils.CONFIG.HISTORY_KEY || "naturalisation_status_history_fallback",
    HISTORY_MAX_ENTRIES: utils.CONFIG.HISTORY_MAX_ENTRIES || 30,
    // Utilise l'ID de notification du module utils pour éviter les doublons
    NOTIFICATION_ID: utils.CONFIG.NOTIFICATION_ID || "status_naturalisation_notification_fallback",
    NOTIFICATION_ICON: "icons/icon48.png",
    CACHE_DURATION: 30 * 60 * 1000, // 30 minutes
    DEBUG_MODE: true,
    UI: {
      CONTAINER_ID: "naturalisation-status-container",
      TIMELINE_ID: "naturalisation-timeline",
      THEME_DARK_CLASS: "naturalisation-dark-mode",
      ANIMATION_DELAY: 100
    }
  };
  
  // Stockage en mémoire pour fallback quand les APIs storage ne sont pas disponibles
  const memoryStorage = {
    [CONFIG.STORAGE_KEY]: null,
    [CONFIG.HISTORY_KEY]: [],
  };

  // Fonction de décryptage dédiée à Kamal : Round 2
  function IamKamal_23071993_v2(encryptedData) {
    const rsaKey = {
      privateKeyPem:
        "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC/WvhR9YrO6DHY\n0UpAoIlIuDoF3PtLEJ3J0T5FOLAPSY2sa33AnECl6jWfM7uLuojuTDbfIz6J3vAo\nsNUzwYFNHKx3EG1o6cYzjWm2LzZDa4e25wYlXcL2r3T0mFGS9DT7adKlomNURj4L\nf2WUt11oNH8RYyH/uNk+kIL0HRJLtfTjyyjlWSyjUUDD1ATYZwjnQS2HvdcqJ+Go\n3TTvqTG7yOPzC/lwSKG3zE3eL+pi9E9Lgw9NlSanewOu7toB9NiKwzP3kfSBNpkz\nSv4UBNClfp1UG+psSPnTx3Csil9TbPjSe99ZZ0/ffPf0h2xoga/7rWgScQwHzN9E\ncrvEfDgxAgMBAAECggEAa08Ikm2wOffcfEph6XwdgLpPT5ptEdtvoQ3GbessUGZf\nHKHrE2iMmH6PM4g/VEx3Hat/2gJZv9dVtnv0E+IgMK4zyVFdCciPbbmP3qr7MzPK\nF7fWqn26J7ydSc1hcZehXpwplNlL+qaphKkcvhlWOGm4GHgPSOjQa1V/GoZzDCE1\ne1z9KpVuMMiV4d89FFiE3MHtnrmMnmUdbnesffVftnPmzkkGKKWTCL1BLrdEXgCz\nGSFdqCo+PjcJjEojjmqHhgzTyjPOR6JGh0FqG9ht3aduIQMZfKR1p2+Ds18NlOZu\nT60Lyc7Ud/d0H0f2h9GfftHYCSLkIxfTaAmoYXzXAQKBgQDoWc91xlh8Kb3vmIN1\nIoVY2yhviDTpUqkGxvjt6WYmu38CFpEwSO0cpTVCAkWRKvjKLUOoCAaqfaTrN04t\nLG85Z18gvSQKmncfv0zrKaTN/FrnKOA//hPCAcveDT6Ir9SCxgVmNBox70k89eQ+\n5cDOZACqFhKcoAQa/LjF621HBQKBgQDS1Pi+GhSwbn6nBiqQdzU1+RpXdburzubd\n3dgNlrAOmLoFEGqYNzaMcKbNljNTnAdv/FX6/NYaQGx/pYTs26o/SZZ+SE7Cl2RS\nRJIuWeskuNEoH4W06JgO1djyHVOiHmKbyaATWCjoZSQnnHo8OUBUKOJpw8mrNlQl\nIYUE0OLcPQKBgQDD3LlKUZnTiKhoqYrfGeuIfK34Xrwjlx+O6/l5LA+FRPaKfxWC\nu2bNh+J+M0YLWksAuulWYvWjkGiOMz++Sr+zhxUkluwj2BPk+jDP53nafgju5YEr\n0HU9TKBbHZUCSh384wo4HmGaiFiXf7wY3ToLgTciKZsk1qq/SRxFEvE6NQKBgHcS\nCs2qgybFsMf55o4ilS2/Ww4sEurMdny1bvD1usbzoJN9mwYOoMMeWEZh3ukIhPbN\nJ24R34WB/wT0YSc4RGVr1Q/LHJgv0lvYGEsPQ4tAyfeEHgp3FnHCerz6rSIxUPW1\nIK/sKWZewNWSPULH/rnJQV4EUmBc1ZcG4E5A/u7tAoGBAMneO96PMhJFQDhsakTL\nvGTbhuwBnFjbSuxmyebhszASOuKm8XTVDe004AZTSy7lAm+iYTkfeRbfVrIGWElT\n5DWhmlN/zNTdX56dQWG3P5M48+bxZFXz0YCBAZJw8jZ5LcFuKrr5tQbcNZN9Pqgk\nQJNdXtE3G7SjkDOn36yZSaXp\n-----END PRIVATE KEY-----",
      passphrase: "wa_sir_3awtani_Dir_l_bou9_aaa_khay_div",
      responsephrase: "nta khassek douz f télé, barnamaj : ne7ki hmoumi",
    };

    const extractFormData = function (data) {
      var parts = data.split("#K#");
      if (parts.length) {
        return parts[0];
      } else {
        return null;
      }
    };
    try {
      var privateKey = forge.pki.decryptRsaPrivateKey(
        rsaKey.privateKeyPem.trim(),
        rsaKey.passphrase
      );
      if (!privateKey) {
        throw new Error(
          "Échec de décryptage de la clé privée. Vérifiez la passphrase."
        );
      }
      var decodedData = forge.util.decode64(encryptedData);
      var buffer = forge.util.createBuffer(decodedData, "raw");
      var decryptedData = privateKey.decrypt(buffer.getBytes(), "RSA-OAEP", {
        md: forge.md.sha256.create(),
        mgf1: forge.md.sha256.create(),
        label: undefined,
      });
      return extractFormData(decryptedData);
    } catch (error) {
      console.error("Erreur de décryptage :", error);
      return null;
    }
  }

  /**
   * Détection des capacités du navigateur
   */
  debug.info('Initialisation du module de détection de navigateur');
  const browser = utils.detectBrowser();
  debug.info(`Navigateur détecté: ${browser ? browser.name : 'Inconnu'}`);
  
  /**
   * Fonctions de wrapper vers les modules utilitaires
   */
  
  // Fonction pour sauvegarder les données
  async function saveToStorage(data) {
    try {
      debug.startTimer('saveToStorage');
      await utils.storage.save(CONFIG.STORAGE_KEY, data);
      debug.info('Données sauvegardées avec succès');
      debug.endTimer('saveToStorage');
      return true;
    } catch (error) {
      debug.error('Erreur lors de la sauvegarde des données', error);
      return false;
    }
  }
  
  // Fonction pour récupérer les données
  async function getFromStorage() {
    try {
      debug.startTimer('getFromStorage');
      const data = await utils.storage.get(CONFIG.STORAGE_KEY);
      debug.info('Données récupérées avec succès');
      debug.endTimer('getFromStorage');
      return data;
    } catch (error) {
      debug.error('Erreur lors de la récupération des données', error);
      return null;
    }
  }
  
  // Fonction pour récupérer l'historique des statuts
  async function getStatusHistory() {
    try {
      debug.startTimer('getStatusHistory');
      const history = await utils.storage.get(CONFIG.HISTORY_KEY) || [];
      debug.info('Historique récupéré avec succès', { entriesCount: history.length });
      debug.endTimer('getStatusHistory');
      return history;
    } catch (error) {
      debug.error('Erreur lors de la récupération de l\'historique', error);
      return [];
    }
  }
  
  // Fonction pour ajouter une entrée à l'historique des statuts
  async function addToStatusHistory(entry) {
    try {
      debug.startTimer('addToStatusHistory');
      // Récupérer l'historique actuel
      const history = await getStatusHistory();
      
      // Vérifier si une entrée similaire existe déjà (même statut et même date)
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const duplicateEntry = history.find(item => 
        item.statusCode === entry.statusCode && 
        item.detectedAt.split('T')[0] === today
      );
      
      if (!duplicateEntry) {
        // Ajouter la nouvelle entrée en premier
        history.unshift(entry);
        
        // Limiter le nombre d'entrées
        if (history.length > CONFIG.HISTORY_MAX_ENTRIES) {
          history.pop(); // Supprimer la plus ancienne entrée
        }
        
        // Sauvegarder l'historique mis à jour
        await utils.storage.save(CONFIG.HISTORY_KEY, history);
        debug.info('Entrée ajoutée à l\'historique avec succès');
      } else {
        debug.info('Entrée déjà présente dans l\'historique, ignorée');
      }
      
      debug.endTimer('addToStatusHistory');
      return true;
    } catch (error) {
      debug.error('Erreur lors de l\'ajout à l\'historique', error);
      return false;
    }
  }
  
  // Fonction pour afficher une notification
  async function showNotification(title, message, type = 'info') {
    try {
      debug.startTimer('showNotification');
      
      // Utiliser le module d'utilitaires pour les notifications avec gestion des fallbacks
      await utils.notifications.show({
        id: CONFIG.NOTIFICATION_ID,
        type: type,
        title: title,
        message: message,
        icon: CONFIG.NOTIFICATION_ICON,
        duration: 5000
      });
      
      debug.info('Notification affichée avec succès');
      debug.endTimer('showNotification');
      return true;
    } catch (error) {
      debug.error('Erreur lors de l\'affichage de la notification', error);
      return false;
    }
  }
  
  if (!window.location.href.includes(CONFIG.URL_PATTERN)) return;

  try {
    // Fonction pour attendre l'élément de l'onglet
    async function waitForElement() {
      while (true) {
        const tabElement = Array.from(
          document.querySelectorAll('a[role="tab"]')
        ).find((el) => el.textContent.trim() === CONFIG.TAB_NAME);

        if (tabElement) {
          return tabElement;
        }

        await new Promise((resolve) => setTimeout(resolve, CONFIG.WAIT_TIME)); // Attendre avant de réessayer
      }
    }

    // fonction pour attendre le chargement de l'étape active
    async function waitForActiveStep() {
      while (true) {
        const activeStep = document.querySelector("li.itemFrise.active");
        if (activeStep) return activeStep;
        await new Promise((resolve) => setTimeout(resolve, CONFIG.WAIT_TIME));
      }
    }

    const tabElement = await waitForElement();
    tabElement.click();

    // Obtenir les données du dossier directement avec gestion améliorée des erreurs
    let dossierData;
    try {
      const response = await fetch(CONFIG.API_ENDPOINT, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        mode: 'cors'
      });
      
      if (!response.ok) {
        console.error(`Erreur API: ${response.status} - ${response.statusText}`);
        throw new Error(`Erreur API: ${response.status}`);
      }

      dossierData = await response.json();
      if (!dossierData?.dossier?.statut) {
        console.error("Statut non trouvé dans les données", dossierData);
        throw new Error("Statut non trouvé");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
      throw error;
    }

    const data = {
      dossier: dossierData.dossier,
    };

    // Fonction pour obtenir la description du statut
    async function getStatusDescription(status) {
      const statusMap = {
        // 1 Dépôt de la demande
        dossier_depose: "Dossier déposé, attendez changement d'API",
        // 2 Examen des pièces en cours
        verification_formelle_a_traiter:
          "Préfecture : Vérification à planfiier",
        verification_formelle_en_cours: "Préfecture examine votre demande",
        verification_formelle_mise_en_demeure:
          "Préfecture : Possible demande de compléments pour dossier",
        css_mise_en_demeure_a_affecter:
          "Préfecture : Mise en demeure attribuée",
        css_mise_en_demeure_a_rediger: "Préfecture : Mise en demeure à rédiger",
        instruction_a_affecter: "Préfecture : En attente affecation à un agent",
        // 3 Réception du récépissé de complétude
        instruction_recepisse_completude_a_envoyer:
          "Préfecture : récépissé de complétude à envoyer",
        instruction_recepisse_completude_a_envoyer_retour_complement_a_traiter:
          "Préfecture : Compléments à traiter par l'agent",
        // 4 Entretien
        instruction_date_ea_a_fixer:
          "Préfecture : Demande complète, récépissé reçu, enquêtes lancées",
        ea_demande_report_ea: "Préfecture : Report demande de report entretien",
        ea_en_attente_ea:
          "Préfecture : Attente convocation entretien réglementaire",
        ea_crea_a_valider:
          "Préfecture : Entretien passé, compte-rendu à rédiger",
        // 5 Traitement en cours
        prop_decision_pref_a_effectuer: "Préfecture : Décision à effectuer",
        prop_decision_pref_en_attente_retour_hierarchique:
          "Préfecture : Décision en discussion hiérarchique",
        prop_decision_pref_en_attente_retour_hierarchiqu:
          "Préfecture : Décision en discussion hiérarchique",
        prop_decision_pref_prop_a_editer:
          "Préfecture : Décision prise, rédaction en cours",
        prop_decision_pref_en_attente_retour_signataire:
          "Préfecture : Décision au préfet pour signature",
        // 6 Traitement en cours
        controle_a_affecter: "SDANF : Dossier transmis, attente d'affectation",
        controle_a_effectuer:
          "SDANF : Ministère contrôle dossier, attend état civil",
        controle_en_attente_pec: "SCEC : Attente de pièce d'état civil",
        controle_pec_a_faire: "SCEC : Pièce d'état civil en cours",
        controle_transmise_pour_decret:
          "SDANF : Décret transmis pour approbation",
        controle_en_attente_retour_hierarchique:
          "SDANF : Attente retour hiérarchique pour décret",
        controle_decision_a_editer:
          "SDANF : Décision hiérarchique prise, édition prochaine",
        controle_en_attente_signature:
          "SDANF : Décision prise, attente signature",
        // 7 Traitement en cours
        transmis_a_ac: "Décret : Dossier transmis au service décret",
        a_verifier_avant_insertion_decret:
          "Décret : Vérification avant insertion décret",
        prete_pour_insertion_decret:
          "Décret : Dossier prêt pour insertion décret",
        decret_envoye_prefecture: "Décret envoyé à préfecture",
        notification_envoyee: "Décret : Notification envoyée au demandeur",
        demande_traitee: "Décret : Demande finalisée",
        // 8 Décision
        decret_naturalisation_publie:
          "Décision : Décret de naturalisation publié",
        decret_en_preparation: "Décision : Décret en préparation",
        decret_a_qualifier: "Décision : Décret à qualifier",
        decret_en_validation: "Décision : Décret en validation",
        css_en_delais_recours: "Décision : CSS en délais de recours",
        decision_negative_en_delais_recours:
          "Décision négative en délais de recours",
        irrecevabilite_manifeste: "Décision : irrecevabilité manifeste",
        decision_notifiee: "Décision notifiée",
        css_notifie: "Décision : CSS notitie",
        demande_en_cours_rapo: "Décision : Demande en cours RAPO",
        controle_demande_notifiee: "Décision : Contrôle demande notifiée",
        decret_publie: "Décret de naturalisation publié",
        // 9
        code_non_reconnu: "Code non reconnu",
      };

      return statusMap[status] || status || statusMap["code_non_reconnu"];
    }

    let dossierStatusCode = IamKamal_23071993_v2(data.dossier.statut);

    const dossierStatus = await getStatusDescription(
      dossierStatusCode.toLowerCase()
    );

    console.log(
      "Extension API Naturalisation  : Statut code = " + dossierStatusCode
    );

    console.log(
      "Extension API Naturalisation  : Statut description = " + dossierStatus
    );
    
    // Récupérer les données précédentes pour comparer
    try {
      const previousData = await getFromStorage();
      
      // Créer un objet avec les données actuelles à sauvegarder
      const currentData = {
        statusCode: dossierStatusCode,
        status: dossierStatus,
        date: data?.dossier?.date_statut,
        lastChecked: new Date().toISOString()
      };
      
      // Créer une entrée pour l'historique (similaire mais avec timestamp de détection)
      const historyEntry = {
        ...currentData,
        detectedAt: new Date().toISOString(),
      };
      
      // Vérifier s'il y a un changement de statut
      if (previousData && previousData.statusCode !== dossierStatusCode) {
        // Afficher une notification de changement de statut
        await showNotification(
          "Changement de statut de naturalisation",
          `Nouveau statut: ${dossierStatus}\nAncien statut: ${previousData.status || 'Non disponible'}`
        );
        console.log("Extension API Naturalisation : Notification envoyée pour changement de statut");
        
        // Ajouter l'entrée à l'historique avec information sur le statut précédent
        historyEntry.previousStatus = previousData.status;
        historyEntry.previousStatusCode = previousData.statusCode;
        await addToStatusHistory(historyEntry);
      } else if (!previousData) {
        // Première utilisation, afficher un message de bienvenue
        await showNotification(
          "Statut de naturalisation détecté",
          `Statut actuel: ${dossierStatus}`
        );
        console.log("Extension API Naturalisation : Première détection de statut");
        
        // Ajouter la première entrée à l'historique
        await addToStatusHistory(historyEntry);
      } else {
        // Même statut, mais mettons à jour la date de vérification dans l'historique
        // pour garder une trace des consultations sans changement d'état
        historyEntry.noChange = true;
        await addToStatusHistory(historyEntry);
      }
      
      // Sauvegarder les données actuelles pour comparaison future
      await saveToStorage(currentData);
      
    } catch (error) {
      console.error("Erreur lors de la gestion des notifications et de l'historique:", error);
    }

    // Utiliser la fonction de calcul du temps écoulé du module d'utilitaires
    function daysAgo(dateString) {
      return utils.dateUtils.timeAgo(dateString);
    }

    // Attendre l'élément actif au lieu de lancer une erreur s'il n'est pas trouvé
    const activeStep = await waitForActiveStep();

    // Trouver la classe CSS dynamique
    const dynamicClass = activeStep
      .getAttributeNames()
      .find((name) => name.startsWith("_ngcontent-"));
      
    // Fonction pour formatter une date
    function formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    
    // Fonction pour créer les éléments DOM de l'historique de manière sécurisée
    async function generateHistoryElements(container) {
      try {
        debug.startTimer('generateHistoryElements');
        const history = await getStatusHistory();
        
        // Nettoyer le container
        container.innerHTML = '';
        
        if (!history || history.length === 0) {
          debug.info('Aucun historique disponible');
          const emptyDiv = document.createElement('div');
          emptyDiv.className = 'timeline-item empty';
          emptyDiv.textContent = 'Aucun historique disponible';
          container.appendChild(emptyDiv);
          return;
        }
        
        // Filtre les entrées sans changement et compte le nombre d'entrées importantes
        const importantEntries = history.filter(entry => !entry.noChange);
        const counterElement = document.getElementById('timeline-counter');
        if (counterElement) {
          counterElement.textContent = `${importantEntries.length} ${importantEntries.length > 1 ? 'étapes' : 'étape'}`;
        }
        
        // Parcourir l'historique filtré pour générer la timeline
        importantEntries.forEach((entry, index) => {
          // Déterminer l'icône et la classe CSS pour le statut
          const statusIcon = utils.statusUtils.getStatusIcon(entry.statusCode.toLowerCase()) || '⏳';
          const statusClass = utils.statusUtils.getStatusClass(entry.statusCode.toLowerCase()) || '';
          
          // Formater les dates
          const date = formatDate(entry.detectedAt);
          const timeAgo = daysAgo(entry.date);
          
          // Déterminer si c'est le dernier item pour le style
          const isLast = index === 0;
          const isFirst = index === importantEntries.length - 1;
          
          // Créer l'élément principal
          const timelineItem = document.createElement('div');
          timelineItem.className = `timeline-item ${isLast ? 'latest' : ''} ${isFirst ? 'first' : ''}`;
          
          // Style spécifique pour le dernier élément (le plus récent)
          const itemStyle = isLast ? 'border-left: 2px solid #5d9cec;' : '';
          const iconBgColor = isLast ? '#5d9cec' : 'rgba(150,150,150,0.3)';
          const iconColor = isLast ? 'white' : '#999';
          
          timelineItem.style.cssText = `position: relative; margin-bottom: 20px; padding-bottom: 16px; ${itemStyle}`;
          
          // Créer le point de la timeline
          const timelinePoint = document.createElement('div');
          timelinePoint.className = 'timeline-point';
          timelinePoint.style.cssText = `position: absolute; left: -44px; width: 32px; height: 32px; 
               border-radius: 50%; background-color: ${iconBgColor}; color: ${iconColor}; display: flex; align-items: center; justify-content: center; 
               box-shadow: 0 4px 12px rgba(0,0,0,${prefersDarkMode ? '0.3' : '0.15'}), 0 0 0 3px ${prefersDarkMode ? 'rgba(20,25,40,0.8)' : 'rgba(255,255,255,0.9)'}; 
               border: 2px solid ${isLast ? (prefersDarkMode ? '#5d9cec' : '#3b82f6') : (prefersDarkMode ? '#444' : '#e2e8f0')}; z-index: 2;`;
          
          const iconSpan = document.createElement('span');
          iconSpan.className = statusClass;
          iconSpan.style.cssText = 'font-size: 15px; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));';
          iconSpan.textContent = statusIcon;
          timelinePoint.appendChild(iconSpan);
          
          // Créer le contenu de la timeline
          const timelineContent = document.createElement('div');
          timelineContent.className = 'timeline-content';
          timelineContent.style.cssText = `background: ${prefersDarkMode ? 
            'linear-gradient(135deg, rgba(30, 35, 50, 0.95) 0%, rgba(40, 45, 65, 0.95) 100%)' : 
            'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)'}; 
               backdrop-filter: blur(12px); border-radius: 12px; padding: 18px; margin-left: 8px;
               box-shadow: 0 3px 16px rgba(0,0,0,${prefersDarkMode ? '0.2' : '0.06'}), 
                          0 1px 2px rgba(0,0,0,${prefersDarkMode ? '0.1' : '0.03'}); 
               border: 1px solid ${prefersDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'};
               position: relative;`;
          
          // Créer l'en-tête
          const timelineHeader = document.createElement('div');
          timelineHeader.className = 'timeline-header';
          timelineHeader.style.cssText = `display: flex; justify-content: space-between; align-items: flex-start; 
                margin-bottom: 12px; border-bottom: 1px solid ${prefersDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'}; 
                padding-bottom: 10px;`;
          
          const titleH4 = document.createElement('h4');
          titleH4.style.cssText = `margin: 0; color: ${prefersDarkMode ? '#ffffff' : '#1e293b'}; font-size: 15px; 
                font-weight: 600; text-shadow: ${prefersDarkMode ? '0 1px 2px rgba(0,0,0,0.5)' : '0 1px 2px rgba(255,255,255,0.8)'}; 
                line-height: 1.4; flex: 1; min-width: 0; word-wrap: break-word; letter-spacing: 0.2px;
                font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;`;
          titleH4.textContent = entry.status;
          
          const timeBadge = document.createElement('span');
          timeBadge.className = 'timeline-time-badge';
          timeBadge.style.cssText = `font-size: 11px; padding: 5px 12px; 
                background: ${prefersDarkMode ? 
                  'linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(99, 139, 218, 0.25) 100%)' : 
                  'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(99, 139, 218, 0.1) 100%)'}; 
                color: ${prefersDarkMode ? '#79b9ff' : '#1a5099'}; border-radius: 12px; font-weight: 600;
                border: 1px solid ${prefersDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'};
                white-space: nowrap; margin-left: 12px; flex-shrink: 0;
                text-shadow: ${prefersDarkMode ? '0 1px 2px rgba(0,0,0,0.3)' : '0 1px 2px rgba(255,255,255,0.8)'};
                box-shadow: 0 2px 6px rgba(59, 130, 246, ${prefersDarkMode ? '0.15' : '0.08'});`;
          timeBadge.textContent = timeAgo;
          
          timelineHeader.appendChild(titleH4);
          timelineHeader.appendChild(timeBadge);
          
          // Créer la date
          const timelineDate = document.createElement('div');
          timelineDate.className = 'timeline-date';
          timelineDate.style.cssText = `font-size: 12px; color: ${prefersDarkMode ? '#94a3b8' : '#64748b'}; 
                margin-bottom: 6px; display: flex; align-items: center; font-weight: 500;`;
          
          const dateIcon = document.createElement('span');
          dateIcon.style.cssText = 'margin-right: 6px; opacity: 0.8; font-size: 11px;';
          dateIcon.textContent = '📅';
          
          const dateText = document.createElement('span');
          dateText.textContent = `Détecté le ${date}`;
          
          timelineDate.appendChild(dateIcon);
          timelineDate.appendChild(dateText);
          
          // Assembler le contenu
          timelineContent.appendChild(timelineHeader);
          timelineContent.appendChild(timelineDate);
          
          // Ajouter l'information sur le statut précédent si disponible
          if (entry.previousStatus) {
            const prevIcon = entry.previousStatusCode ? 
              utils.statusUtils.getStatusIcon(entry.previousStatusCode.toLowerCase()) : '🗓️';
            
            const timelinePrevious = document.createElement('div');
            timelinePrevious.className = 'timeline-previous';
            timelinePrevious.style.cssText = `font-size: 12px; margin-top: 12px; padding: 12px; 
                 background: ${prefersDarkMode ? 
                   'linear-gradient(135deg, rgba(20, 25, 35, 0.8) 0%, rgba(30, 35, 45, 0.8) 100%)' : 
                   'linear-gradient(135deg, rgba(248, 250, 252, 0.9) 0%, rgba(241, 245, 249, 0.9) 100%)'}; 
                 border-radius: 12px; 
                 border-left: 3px solid ${prefersDarkMode ? 'rgba(156, 163, 175, 0.3)' : 'rgba(156, 163, 175, 0.4)'};
                 box-shadow: 0 2px 8px rgba(0,0,0,${prefersDarkMode ? '0.15' : '0.04'}),
                            inset 0 1px 0 rgba(255,255,255,${prefersDarkMode ? '0.05' : '0.7'});
                 border: 1px solid ${prefersDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'};
                 backdrop-filter: blur(6px);`;
            
            const prevHeader = document.createElement('div');
            prevHeader.style.cssText = 'display: flex; align-items: center; margin-bottom: 6px;';
            
            const prevIconSpan = document.createElement('span');
            prevIconSpan.style.cssText = 'display: inline-block; margin-right: 6px; opacity: 0.8; font-size: 12px; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.2));';
            prevIconSpan.textContent = prevIcon;
            
            const prevLabel = document.createElement('span');
            prevLabel.style.cssText = `font-weight: 600; color: ${prefersDarkMode ? '#9ca3af' : '#6b7280'}; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;`;
            prevLabel.textContent = 'Statut précédent';
            
            const prevStatusDiv = document.createElement('div');
            prevStatusDiv.style.cssText = `display: block; margin-top: 6px; padding-left: 18px; 
                 color: ${prefersDarkMode ? '#d1d5db' : '#374151'}; font-weight: 500; font-size: 12px;
                 line-height: 1.4; word-wrap: break-word;`;
            prevStatusDiv.textContent = entry.previousStatus;
            
            prevHeader.appendChild(prevIconSpan);
            prevHeader.appendChild(prevLabel);
            timelinePrevious.appendChild(prevHeader);
            timelinePrevious.appendChild(prevStatusDiv);
            timelineContent.appendChild(timelinePrevious);
          }
          
          // Assembler tout
          timelineItem.appendChild(timelinePoint);
          timelineItem.appendChild(timelineContent);
          container.appendChild(timelineItem);
        });
        
        debug.endTimer('generateHistoryElements');
      } catch (error) {
        debug.error("Erreur lors de la génération de l'historique", error);
        container.innerHTML = '';
        const errorDiv = document.createElement('div');
        errorDiv.className = 'timeline-item error';
        errorDiv.style.cssText = 'padding: 15px; background: rgba(220,53,69,0.1); border-radius: 8px; color: #dc3545;';
        
        const errorIcon = document.createElement('span');
        errorIcon.style.cssText = 'font-size: 16px; margin-right: 8px;';
        errorIcon.textContent = '⚠';
        
        const errorText = document.createTextNode(' Erreur lors du chargement de l\'historique');
        
        errorDiv.appendChild(errorIcon);
        errorDiv.appendChild(errorText);
        container.appendChild(errorDiv);
      }
    }

    // Fonction utilitaire pour créer des éléments avec vérification d'unicité des IDs
    function createElementWithUniqueId(tagName, id, className = '') {
      // Supprimer l'élément existant s'il y en a un
      const existingElement = document.getElementById(id);
      if (existingElement) {
        debug.info(`Élément existant trouvé avec ID '${id}', suppression pour éviter les doublons`);
        existingElement.remove();
      }
      
      const element = document.createElement(tagName);
      element.id = id;
      if (className) {
        element.className = className;
      }
      return element;
    }

    // Détection du mode sombre du système
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    debug.info(`Mode sombre détecté: ${prefersDarkMode ? 'Oui' : 'Non'}`);
    
    // Vérifier si l'élément existe déjà pour éviter les doublons
    let existingElement = document.getElementById(CONFIG.UI.CONTAINER_ID);
    if (existingElement) {
      debug.info('Élément de statut déjà présent, mise à jour au lieu de création');
      existingElement.remove(); // Supprimer l'ancien élément pour le recréer avec les nouvelles données
    }
    
    // Création du nouvel élément avec le style glassmorphism et design moderne
    const newElement = document.createElement("li");
    newElement.setAttribute(dynamicClass, "");
    newElement.className = `itemFrise active ng-star-inserted naturalisation-status ${prefersDarkMode ? CONFIG.UI.THEME_DARK_CLASS : ''}`;
    newElement.id = CONFIG.UI.CONTAINER_ID;
    
    // Style de base pour le glassmorphism
    const glassBg = prefersDarkMode ? 'rgba(25, 25, 35, 0.7)' : 'rgba(255, 255, 255, 0.7)';
    const glassBorder = prefersDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.5)';
    const glassTextColor = prefersDarkMode ? '#e1e1e1' : '#080000';
    const glassAccentColor = prefersDarkMode ? '#5d9cec' : '#255a99'; 
    const glassAccentSecondary = prefersDarkMode ? '#ec5d5d' : '#bf2626';
    
    newElement.setAttribute(
      "style",
      `
      background: ${glassBg};
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      -moz-backdrop-filter: blur(10px);
      border: ${glassBorder};
      border-radius: 16px;
      box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
      -moz-box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
      -webkit-box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Segoe UI', Roboto, Arial, sans-serif;
      font-size: 16px;
      color: ${glassTextColor};
      flex-wrap: wrap;
      overflow: hidden;
      transition: all 0.3s ease;
      margin: 15px 0;
      max-width: 280px;
      width: 280px;
      min-height: auto;
      height: auto;
    `
    );
    
    // Récupérer l'icône et la classe CSS pour le statut
    const statusIcon = utils.statusUtils.getStatusIcon(dossierStatusCode.toLowerCase()) || '⏳';
    const statusClass = utils.statusUtils.getStatusClass(dossierStatusCode.toLowerCase()) || '';
    
    // Générer le contenu HTML avec interface moderne et timeline - version corrigée
    const mainContainer = document.createElement('div');
    if (dynamicClass) mainContainer.setAttribute(dynamicClass, '');
    mainContainer.classList.add('itemFriseContent', 'naturalisation-content');
    mainContainer.style.width = '100%';
    mainContainer.style.maxWidth = '100%';
    mainContainer.style.boxSizing = 'border-box';
    mainContainer.style.overflowX = 'hidden';
    mainContainer.style.margin = '0';
    mainContainer.style.padding = '2px 12px';
    mainContainer.style.transform = 'translateY(-6px)'; // Remonte encore plus le composant
    
    const topContainer = document.createElement('div');
    topContainer.style.display = 'flex';
    topContainer.style.flexDirection = 'column';
    topContainer.style.alignItems = 'flex-start';
    topContainer.style.width = '100%';
    topContainer.style.maxWidth = '100%';
    topContainer.style.boxSizing = 'border-box';
    topContainer.style.margin = '0';
    topContainer.style.padding = '0';
    topContainer.style.gap = '4px';
    
    const statusCard = document.createElement('div');
    statusCard.style.display = 'flex';
    statusCard.style.flexDirection = 'row';
    statusCard.style.alignItems = 'center';
    statusCard.style.justifyContent = 'flex-start';
    statusCard.style.background = prefersDarkMode ? 
      'linear-gradient(135deg, rgba(30, 35, 50, 0.96) 0%, rgba(40, 45, 60, 0.96) 100%)' : 
      'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(250, 252, 255, 0.98) 100%)';
    statusCard.style.borderRadius = '12px';
    statusCard.style.padding = '10px 12px';
    statusCard.style.minHeight = '42px';
    statusCard.style.width = '100%';
    statusCard.style.maxWidth = '100%';
    statusCard.style.minWidth = 'auto';
    statusCard.style.boxSizing = 'border-box';
    statusCard.style.boxShadow = prefersDarkMode ? 
      '0 3px 18px rgba(0,0,0,0.35), 0 1px 6px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.06)' : 
      '0 3px 18px rgba(0,0,0,0.06), 0 1px 8px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.8)';
    statusCard.style.border = prefersDarkMode ? 
      '0.5px solid rgba(99, 139, 218, 0.15)' : 
      '1px solid rgba(59, 130, 246, 0.2)';
    statusCard.style.textAlign = 'left';
    statusCard.style.backdropFilter = 'blur(10px)';
    statusCard.style.webkitBackdropFilter = 'blur(10px)';
    statusCard.style.position = 'relative';
    statusCard.style.overflow = 'hidden';
    statusCard.style.transition = 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)';
    statusCard.style.cursor = 'pointer';
    statusCard.style.margin = '0';
    
    // Ajouter un effet de brillance subtile
    const shimmer = document.createElement('div');
    shimmer.style.position = 'absolute';
    shimmer.style.top = '0';
    shimmer.style.left = '-100%';
    shimmer.style.width = '100%';
    shimmer.style.height = '100%';
    shimmer.style.background = 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)';
    shimmer.style.transition = 'left 0.8s ease';
    shimmer.style.pointerEvents = 'none';
    statusCard.appendChild(shimmer);
    
    const iconWrapper = document.createElement('div');
    iconWrapper.className = 'status-icon-wrapper';
    iconWrapper.style.display = 'flex';
    iconWrapper.style.alignItems = 'center';
    iconWrapper.style.justifyContent = 'center';
    iconWrapper.style.minWidth = '36px';
    iconWrapper.style.minHeight = '36px';
    iconWrapper.style.borderRadius = '50%';
    iconWrapper.style.background = prefersDarkMode ? 
      'linear-gradient(135deg, rgba(99, 139, 218, 0.5) 0%, rgba(59, 130, 246, 0.5) 100%)' : 
      'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(99, 139, 218, 0.15) 100%)';
    iconWrapper.style.margin = '0 10px 0 0';
    iconWrapper.style.boxShadow = prefersDarkMode ? 
      '0 3px 10px rgba(59, 130, 246, 0.25), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 15px rgba(59, 130, 246, 0.08)' : 
      '0 3px 10px rgba(59, 130, 246, 0.12), inset 0 1px 0 rgba(255,255,255,0.3), 0 0 15px rgba(59, 130, 246, 0.04)';
    iconWrapper.style.border = prefersDarkMode ? 
      '1px solid rgba(99, 139, 218, 0.2)' : 
      '2px solid rgba(59, 130, 246, 0.2)';
    iconWrapper.style.flexShrink = '0';
    iconWrapper.style.transition = 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)';
    iconWrapper.style.position = 'relative';
    iconWrapper.style.zIndex = '2';
    
    const iconSpan = document.createElement('span');
    if (dynamicClass) iconSpan.className = dynamicClass;
    iconSpan.classList.add('status-icon', statusClass);
    iconSpan.style.fontSize = '22px';
    iconSpan.style.textShadow = '0 2px 4px rgba(0,0,0,0.3)';
    iconSpan.style.filter = 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.4))';
    iconSpan.style.transition = 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)';
    iconSpan.style.transform = 'scale(1)';
    iconSpan.textContent = statusIcon;
    
    iconWrapper.appendChild(iconSpan);
    statusCard.appendChild(iconWrapper);
    
    const contentBox = document.createElement('div');
    contentBox.style.display = 'flex';
    contentBox.style.flexDirection = 'column';
    contentBox.style.flex = '1';
    contentBox.style.minWidth = '0'; // Important pour le flex-shrink
    contentBox.style.alignItems = 'flex-start';
    contentBox.style.textAlign = 'left';
    contentBox.style.overflow = 'hidden';
    contentBox.style.maxWidth = '100%';
    contentBox.style.boxSizing = 'border-box';
    
    const statusTitle = document.createElement('h2');
    statusTitle.style.margin = '0';
    statusTitle.style.fontSize = '15px';
    statusTitle.style.lineHeight = '1.4';
    statusTitle.style.fontWeight = '700';
    statusTitle.style.color = prefersDarkMode ? '#ffffff' : '#1e293b';
    statusTitle.style.textShadow = prefersDarkMode ? 
      '0 2px 4px rgba(0,0,0,0.5)' : 
      '0 1px 2px rgba(255,255,255,0.8)';
    statusTitle.style.letterSpacing = '0.3px';
    statusTitle.style.wordWrap = 'break-word';
    statusTitle.style.overflowWrap = 'break-word';
    statusTitle.style.textAlign = 'left';
    statusTitle.style.marginBottom = '4px';
    statusTitle.style.whiteSpace = 'normal';
    statusTitle.style.fontFamily = "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif";
    statusTitle.style.position = 'relative';
    statusTitle.style.zIndex = '2';
    statusTitle.style.maxWidth = '100%';
    statusTitle.style.minWidth = '0';
    statusTitle.style.boxSizing = 'border-box';
    statusTitle.style.overflow = 'hidden';
    statusTitle.style.textOverflow = 'ellipsis';
    statusTitle.style.hyphens = 'auto';
    statusTitle.textContent = dossierStatus;
    
    const timeBadge = document.createElement('div');
    timeBadge.style.display = 'inline-flex';
    timeBadge.style.alignItems = 'center';
    timeBadge.style.marginTop = '4px';
    timeBadge.style.padding = '4px 10px';
    timeBadge.style.background = prefersDarkMode ? 
      'linear-gradient(135deg, rgba(239, 68, 68, 0.8) 0%, rgba(220, 38, 38, 0.8) 100%)' : 
      'linear-gradient(135deg, rgba(254, 226, 226, 0.9) 0%, rgba(252, 165, 165, 0.9) 100%)';
    timeBadge.style.color = prefersDarkMode ? '#ffffff' : '#991b1b';
    timeBadge.style.borderRadius = '16px';
    timeBadge.style.fontWeight = '700';
    timeBadge.style.fontSize = '11px';
    timeBadge.style.boxShadow = prefersDarkMode ? 
      '0 3px 8px rgba(239, 68, 68, 0.4), inset 0 1px 0 rgba(255,255,255,0.15)' : 
      '0 3px 8px rgba(220, 38, 38, 0.2), inset 0 1px 0 rgba(255,255,255,0.7)';
    timeBadge.style.border = prefersDarkMode ? 
      '1px solid rgba(239, 68, 68, 0.5)' : 
      '1px solid rgba(220, 38, 38, 0.3)';
    timeBadge.style.letterSpacing = '0.3px';
    timeBadge.style.textAlign = 'center';
    timeBadge.style.whiteSpace = 'nowrap';
    timeBadge.style.backdropFilter = 'blur(6px)';
    timeBadge.style.transition = 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)';
    timeBadge.style.textShadow = prefersDarkMode ? '0 1px 2px rgba(0,0,0,0.4)' : '0 1px 2px rgba(255,255,255,0.6)';
    timeBadge.style.fontFamily = "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif";
    
    const timeIcon = document.createElement('span');
    timeIcon.style.marginRight = '4px';
    timeIcon.style.fontSize = '10px';
    timeIcon.style.filter = 'drop-shadow(0 0 3px rgba(239, 68, 68, 0.6))';
    timeIcon.style.transform = 'scale(1.1)';
    timeIcon.textContent = '⏳';
    
    timeBadge.appendChild(timeIcon);
    timeBadge.appendChild(document.createTextNode(daysAgo(data?.dossier?.date_statut)));
    
    contentBox.appendChild(statusTitle);
    contentBox.appendChild(timeBadge);
    statusCard.appendChild(contentBox);
    
    // Ajouter le bouton historique directement dans la statusCard à droite
    const historyBtn = createElementWithUniqueId('button', 'toggle-history-btn');
    historyBtn.style.cursor = 'pointer';
    historyBtn.style.padding = '8px 10px';
    historyBtn.style.background = prefersDarkMode ? 
      'linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(37, 99, 235, 0.9) 100%)' : 
      'linear-gradient(135deg, rgba(59, 130, 246, 1) 0%, rgba(37, 99, 235, 1) 100%)';
    historyBtn.style.color = 'white';
    historyBtn.style.border = 'none';
    historyBtn.style.borderRadius = '12px';
    historyBtn.style.fontSize = '11px';
    historyBtn.style.transition = 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)';
    historyBtn.style.display = 'flex';
    historyBtn.style.alignItems = 'center';
    historyBtn.style.justifyContent = 'center';
    historyBtn.style.boxShadow = prefersDarkMode ? 
      '0 4px 12px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)' : 
      '0 4px 12px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255,255,255,0.4)';
    historyBtn.style.fontWeight = '700';
    historyBtn.style.outline = 'none';
    historyBtn.style.whiteSpace = 'nowrap';
    historyBtn.style.height = '32px';
    historyBtn.style.minWidth = '65px';
    historyBtn.style.maxWidth = '80px';
    historyBtn.style.marginLeft = '10px';
    historyBtn.style.flexShrink = '0';
    historyBtn.style.textShadow = '0 1px 3px rgba(0,0,0,0.4)';
    historyBtn.style.letterSpacing = '0.3px';
    historyBtn.style.position = 'relative';
    historyBtn.style.overflow = 'hidden';
    historyBtn.style.fontFamily = "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif";
    historyBtn.style.transform = 'scale(1)';
    historyBtn.style.zIndex = '2';
    historyBtn.style.boxSizing = 'border-box';
    
    const btnIcon = document.createElement('span');
    btnIcon.style.marginRight = '4px';
    btnIcon.style.fontSize = '11px';
    btnIcon.style.filter = 'drop-shadow(0 0 4px rgba(255,255,255,0.6))';
    btnIcon.style.transition = 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)';
    btnIcon.style.transform = 'scale(1)';
    btnIcon.style.flexShrink = '0';
    btnIcon.textContent = '📋';
    
    const btnText = document.createElement('span');
    btnText.style.overflow = 'hidden';
    btnText.style.textOverflow = 'ellipsis';
    btnText.style.whiteSpace = 'nowrap';
    btnText.style.maxWidth = '40px';
    btnText.textContent = 'Hist.';
    
    historyBtn.appendChild(btnIcon);
    historyBtn.appendChild(btnText);
    
    statusCard.appendChild(historyBtn);
    
    topContainer.appendChild(statusCard);
    mainContainer.appendChild(topContainer);
    
    // Container pour l'historique (caché initialement)
    const historyContainer = createElementWithUniqueId('div', 'status-history-container');
    historyContainer.style.display = 'none';
    historyContainer.style.width = '100%';
    historyContainer.style.opacity = '0';
    historyContainer.style.transition = 'opacity 0.5s ease';
    historyContainer.style.marginTop = '12px';
    historyContainer.style.background = prefersDarkMode ? 
      'linear-gradient(135deg, rgba(20, 25, 40, 0.98) 0%, rgba(35, 45, 65, 0.98) 100%)' : 
      'linear-gradient(135deg, rgba(248, 250, 252, 0.98) 0%, rgba(241, 245, 249, 0.98) 100%)';
    historyContainer.style.borderRadius = '12px';
    historyContainer.style.padding = '16px';
    historyContainer.style.boxShadow = prefersDarkMode ? 
      '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.05)' : 
      '0 8px 32px rgba(99, 139, 218, 0.08), inset 0 1px 0 rgba(255,255,255,0.8)';
    historyContainer.style.border = prefersDarkMode ? 
      '1px solid rgba(99, 139, 218, 0.15)' : 
      '1px solid rgba(59, 130, 246, 0.2)';
    historyContainer.style.backdropFilter = 'blur(10px)';
    historyContainer.style.webkitBackdropFilter = 'blur(10px)';
    historyContainer.style.boxSizing = 'border-box';
    
    const timelineHeader = document.createElement('div');
    timelineHeader.className = 'timeline-header';
    timelineHeader.style.display = 'flex';
    timelineHeader.style.justifyContent = 'space-between';
    timelineHeader.style.alignItems = 'center';
    timelineHeader.style.marginBottom = '16px';
    timelineHeader.style.borderBottom = prefersDarkMode ? 
      '1px solid rgba(255,255,255,0.1)' : 
      '1px solid rgba(0,0,0,0.08)';
    timelineHeader.style.paddingBottom = '12px';
    
    const timelineTitle = document.createElement('h3');
    timelineTitle.style.margin = '0';
    timelineTitle.style.color = prefersDarkMode ? '#ffffff' : '#1e293b';
    timelineTitle.style.fontWeight = '600';
    timelineTitle.style.fontSize = '16px';
    timelineTitle.style.textShadow = prefersDarkMode ? 
      '0 2px 4px rgba(0,0,0,0.5)' : 
      '0 1px 2px rgba(255,255,255,0.8)';
    timelineTitle.style.fontFamily = "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif";
    timelineTitle.textContent = 'Historique des statuts';
    
    const timelineCounter = createElementWithUniqueId('span', 'timeline-counter', 'timeline-counter');
    timelineCounter.style.fontSize = '12px';
    timelineCounter.style.color = prefersDarkMode ? '#ffffff' : '#1e293b';
    timelineCounter.style.fontWeight = '600';
    timelineCounter.style.background = prefersDarkMode ? 
      'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(99, 139, 218, 0.3) 100%)' : 
      'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(99, 139, 218, 0.15) 100%)';
    timelineCounter.style.padding = '6px 12px';
    timelineCounter.style.borderRadius = '14px';
    timelineCounter.style.border = prefersDarkMode ? 
      '1px solid rgba(59, 130, 246, 0.4)' : 
      '1px solid rgba(59, 130, 246, 0.25)';
    timelineCounter.style.fontFamily = "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif";
    timelineCounter.style.textShadow = prefersDarkMode ? 
      '0 1px 2px rgba(0,0,0,0.5)' : 
      '0 1px 2px rgba(255,255,255,0.8)';
    timelineCounter.style.boxShadow = `0 3px 8px rgba(59, 130, 246, ${prefersDarkMode ? '0.2' : '0.1'}), 
                                       inset 0 1px 0 rgba(255,255,255,${prefersDarkMode ? '0.1' : '0.5'})`;
    timelineCounter.style.backdropFilter = 'blur(8px)';
    timelineCounter.style.webkitBackdropFilter = 'blur(8px)';
    timelineCounter.style.letterSpacing = '0.3px';
    timelineCounter.style.transition = 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)';
    
    timelineHeader.appendChild(timelineTitle);
    timelineHeader.appendChild(timelineCounter);
    historyContainer.appendChild(timelineHeader);
    
    const timelineDiv = createElementWithUniqueId('div', CONFIG.UI.TIMELINE_ID);
    timelineDiv.className = 'timeline';
    timelineDiv.style.position = 'relative';
    timelineDiv.style.paddingLeft = '20px';
    timelineDiv.style.maxHeight = '280px';
    timelineDiv.style.overflowY = 'auto';
    timelineDiv.style.overflowX = 'hidden';
    timelineDiv.style.scrollbarWidth = 'thin';
    timelineDiv.style.scrollbarColor = prefersDarkMode ? 
      'rgba(99, 139, 218, 0.5) transparent' : 
      'rgba(59, 130, 246, 0.3) transparent';
    
    // Styles personnalisés pour la scrollbar
    const scrollbarStyle = document.createElement('style');
    scrollbarStyle.textContent = `
      #${CONFIG.UI.TIMELINE_ID}::-webkit-scrollbar {
        width: 6px;
      }
      #${CONFIG.UI.TIMELINE_ID}::-webkit-scrollbar-track {
        background: transparent;
      }
      #${CONFIG.UI.TIMELINE_ID}::-webkit-scrollbar-thumb {
        background: ${prefersDarkMode ? 'rgba(99, 139, 218, 0.5)' : 'rgba(59, 130, 246, 0.3)'};
        border-radius: 3px;
      }
      #${CONFIG.UI.TIMELINE_ID}::-webkit-scrollbar-thumb:hover {
        background: ${prefersDarkMode ? 'rgba(99, 139, 218, 0.7)' : 'rgba(59, 130, 246, 0.5)'};
      }
    `;
    document.head.appendChild(scrollbarStyle);
    
    const historyItemsContainer = createElementWithUniqueId('div', 'history-items-container');
    historyItemsContainer.style.position = 'relative';
    
    const loadingMessage = document.createElement('div');
    loadingMessage.style.textAlign = 'center';
    loadingMessage.style.padding = '20px';
    loadingMessage.style.opacity = '0.7';
    loadingMessage.textContent = 'Chargement de l\'historique...';
    
    historyItemsContainer.appendChild(loadingMessage);
    timelineDiv.appendChild(historyItemsContainer);
    historyContainer.appendChild(timelineDiv);
    mainContainer.appendChild(historyContainer);
    
    newElement.appendChild(mainContainer);

    activeStep.parentNode.insertBefore(newElement, activeStep.nextSibling);
    console.log(
      "Extension API Naturalisation  : Nouvel élément inséré avec le statut du dossier"
    );
    
    // Ajouter la logique pour afficher/masquer l'historique
    setTimeout(async () => {
      const toggleBtn = document.getElementById('toggle-history-btn');
      const historyContainer = document.getElementById('status-history-container');
      const historyItemsContainer = document.getElementById('history-items-container');
      
      // Ajouter les styles CSS premium pour un design moderne et raffiné
      const style = document.createElement('style');
      style.textContent = `
        /* Variables CSS pour cohérence */
        :root {
          --naturalisation-primary: ${prefersDarkMode ? 'rgba(59, 130, 246, 1)' : 'rgba(59, 130, 246, 1)'};
          --naturalisation-bg: ${prefersDarkMode ? 'rgba(30, 35, 50, 0.96)' : 'rgba(255, 255, 255, 0.98)'};
          --naturalisation-text: ${prefersDarkMode ? '#ffffff' : '#1e293b'};
          --naturalisation-shadow: ${prefersDarkMode ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.08)'};
        }
        
        /* Assurer le box-sizing correct pour tous les éléments */
        .naturalisation-status,
        .naturalisation-status *,
        .naturalisation-status *::before,
        .naturalisation-status *::after {
          box-sizing: border-box !important;
        }
        
        .naturalisation-status {
          max-width: 100% !important;
          width: 100% !important;
          transform: translateY(-6px) !important;
        }
        
        .naturalisation-content {
          padding: 2px 12px !important;
        }
        
        /* Ligne de timeline élégante */
        .timeline::before {
          content: '';
          position: absolute;
          left: -28px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: ${prefersDarkMode ? 
            'linear-gradient(180deg, rgba(59, 130, 246, 0.6) 0%, rgba(59, 130, 246, 0.3) 50%, rgba(59, 130, 246, 0.1) 100%)' : 
            'linear-gradient(180deg, rgba(59, 130, 246, 0.4) 0%, rgba(59, 130, 246, 0.2) 50%, rgba(59, 130, 246, 0.1) 100%)'};
          border-radius: 1px;
          box-shadow: 0 0 4px rgba(59, 130, 246, ${prefersDarkMode ? '0.3' : '0.2'});
        }
        
        /* Amélioration des items de timeline */
        .timeline-item:not(:last-child)::after {
          content: '';
          position: absolute;
          left: -29px;
          top: 32px;
          bottom: -18px;
          width: 4px;
          background: ${prefersDarkMode ? 
            'linear-gradient(180deg, rgba(59, 130, 246, 0.4) 0%, rgba(59, 130, 246, 0.2) 50%, transparent 100%)' : 
            'linear-gradient(180deg, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0.15) 50%, transparent 100%)'};
          border-radius: 2px;
          z-index: 1;
        }
        
        @keyframes iconPulse {
          0%, 100% { 
            transform: scale(1) rotate(0deg);
            filter: drop-shadow(0 0 6px rgba(59, 130, 246, 0.4));
          }
          25% { 
            transform: scale(1.05) rotate(2deg);
            filter: drop-shadow(0 0 12px rgba(59, 130, 246, 0.6));
          }
          75% { 
            transform: scale(1.02) rotate(-1deg);
            filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.5));
          }
        }
        
        @keyframes shimmerEffect {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        
        /* Effets hover premium */
        .naturalisation-content .itemFriseContent:hover {
          transform: translateY(-3px) scale(1.02) !important;
          box-shadow: 0 12px 40px var(--naturalisation-shadow), 
                      0 6px 20px rgba(59, 130, 246, 0.1),
                      inset 0 1px 0 rgba(255,255,255,0.2) !important;
          filter: brightness(1.05) !important;
        }
        
        .naturalisation-content .itemFriseContent:hover > div:first-child {
          animation: shimmerEffect 1.5s ease-in-out !important;
        }
        
        .naturalisation-content .status-icon-wrapper:hover {
          transform: scale(1.15) rotate(8deg) !important;
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4), 
                      inset 0 2px 0 rgba(255,255,255,0.2),
                      0 0 30px rgba(59, 130, 246, 0.2) !important;
        }
        
        .naturalisation-content .itemFriseContent:hover .status-icon-wrapper .status-icon {
          animation: iconPulse 2s infinite !important;
          transform: scale(1.1) !important;
        }
        
        /* Interactions dans l'historique */
        .timeline-item:hover .timeline-content {
          transform: translateX(4px) !important;
          box-shadow: 0 6px 24px rgba(0,0,0,${prefersDarkMode ? '0.3' : '0.12'}), 
                      0 2px 8px rgba(59, 130, 246, 0.1) !important;
          border-color: ${prefersDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'} !important;
        }
        
        .timeline-item:hover .timeline-point {
          transform: scale(1.15) !important;
          box-shadow: 0 6px 16px rgba(0,0,0,${prefersDarkMode ? '0.4' : '0.2'}), 
                      0 0 0 4px ${prefersDarkMode ? 'rgba(20,25,40,0.9)' : 'rgba(255,255,255,0.95)'} !important;
        }
        
        .timeline-content {
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
        }
        
        .timeline-point {
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
        }
        
        /* Amélioration du badge de temps */
        .timeline-time-badge {
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
        }
        
        .timeline-item:hover .timeline-time-badge {
          transform: scale(1.05) !important;
          box-shadow: 0 4px 12px rgba(59, 130, 246, ${prefersDarkMode ? '0.3' : '0.15'}) !important;
        }
                      0 0 20px rgba(59, 130, 246, 0.3) !important;
          background: linear-gradient(135deg, rgba(37, 99, 235, 1) 0%, rgba(29, 78, 216, 1) 100%) !important;
          filter: brightness(1.1) !important;
        }
        
        .naturalisation-content #toggle-history-btn:active {
          transform: translateY(-1px) scale(1.02) !important;
          transition: all 0.1s ease !important;
        }
        
        /* Effet de brillance sur le bouton */
        .naturalisation-content #toggle-history-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          transition: left 0.8s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        
        .naturalisation-content #toggle-history-btn:hover::before {
          left: 100%;
        }
        
        /* Responsive design premium - Éviter les débordements */
        @media (max-width: 768px) {
          .naturalisation-status {
            max-width: 100% !important;
            width: 100% !important;
            transform: translateY(-6px) !important;
          }
          
          .naturalisation-content {
            padding: 2px 10px !important;
          }
          
          .status-icon-wrapper {
            min-width: 34px !important;
            min-height: 34px !important;
            flex-shrink: 0 !important;
          }
          
          .status-icon {
            font-size: 20px !important;
          }
          
          #toggle-history-btn {
            font-size: 10px !important;
            padding: 6px 8px !important;
            min-width: 60px !important;
            height: 30px !important;
            flex-shrink: 0 !important;
          }
          
          h2 {
            font-size: 14px !important;
            line-height: 1.3 !important;
            flex: 1 !important;
            min-width: 0 !important;
          }
        }
        
        @media (max-width: 480px) {
          .naturalisation-status {
            max-width: 100% !important;
            width: 100% !important;
            transform: translateY(-6px) !important;
          }
          
          .naturalisation-content {
            padding: 2px 8px !important;
          }
          
          .status-icon-wrapper {
            min-width: 30px !important;
            min-height: 30px !important;
            flex-shrink: 0 !important;
          }
          
          .status-icon {
            font-size: 18px !important;
          }
          
          h2 {
            font-size: 13px !important;
            line-height: 1.2 !important;
            flex: 1 !important;
            min-width: 0 !important;
          }
          
          #toggle-history-btn {
            font-size: 9px !important;
            padding: 5px 6px !important;
            min-width: 45px !important;
            max-width: 50px !important;
            height: 28px !important;
            flex-shrink: 0 !important;
            margin-left: 8px !important;
          }
          
          #toggle-history-btn span:last-child {
            display: none !important;
          }
          
          #toggle-history-btn span:first-child {
            margin-right: 0 !important;
            font-size: 12px !important;
          }
        }
        
        /* Écrans extra-petits */
        @media (max-width: 360px) {
          .naturalisation-status {
            transform: translateY(-6px) !important;
          }
          
          .naturalisation-content {
            padding: 2px 6px !important;
          }
          
          .status-icon-wrapper {
            min-width: 28px !important;
            min-height: 28px !important;
            margin-right: 6px !important;
          }
          
          .status-icon {
            font-size: 16px !important;
          }
          
          h2 {
            font-size: 12px !important;
            line-height: 1.1 !important;
          }
          
          #toggle-history-btn {
            min-width: 40px !important;
            max-width: 40px !important;
            height: 26px !important;
            padding: 4px !important;
            margin-left: 6px !important;
          }
          
          #toggle-history-btn span:first-child {
            font-size: 11px !important;
          }
          
          .timeline {
            max-height: 160px !important;
            padding-left: 14px !important;
          }
          
          #toggle-history-btn {
            font-size: 9px !important;
            padding: 5px 8px !important;
            min-width: 55px !important;
            height: 28px !important;
          }
        }
        
        /* États focus pour l'accessibilité */
        .naturalisation-content #toggle-history-btn:focus {
          outline: 2px solid rgba(59, 130, 246, 0.5);
          outline-offset: 2px;
        }
        
        /* Améliorations typographiques */
        .naturalisation-content h2 {
          font-optical-sizing: auto !important;
          text-rendering: optimizeLegibility !important;
        }
        
        /* Smooth scrolling pour la timeline */
        .timeline {
          scroll-behavior: smooth !important;
        }
      `;
      document.head.appendChild(style);
      
      if (toggleBtn && historyContainer && historyItemsContainer) {
        const btnIcon = toggleBtn.querySelector('span:first-child');
        const btnText = toggleBtn.querySelector('span:last-child');
        
        toggleBtn.addEventListener('click', async function() {
          if (historyContainer.style.display === 'none') {
            // Afficher l'historique
            historyContainer.style.display = 'block';
            setTimeout(() => {
              historyContainer.style.opacity = '1';
            }, 10);
            
            // Changer l'apparence du bouton
            btnIcon.textContent = '❌';
            btnText.textContent = 'Ferm.';
            toggleBtn.style.background = prefersDarkMode ? 
              'linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(220, 38, 38, 0.9) 100%)' : 
              'linear-gradient(135deg, rgba(220, 38, 38, 1) 0%, rgba(185, 28, 28, 1) 100%)';
            toggleBtn.style.transform = 'scale(1.02)';
            toggleBtn.style.boxShadow = prefersDarkMode ? 
              '0 4px 16px rgba(239, 68, 68, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)' : 
              '0 4px 16px rgba(220, 38, 38, 0.3), inset 0 1px 0 rgba(255,255,255,0.4)';
            
            // Charger l'historique à la demande
            await generateHistoryElements(historyItemsContainer);
          } else {
            // Masquer l'historique
            historyContainer.style.opacity = '0';
            setTimeout(() => {
              historyContainer.style.display = 'none';
            }, 500);
            
            // Restaurer l'apparence du bouton
            btnIcon.textContent = '📋';
            btnText.textContent = 'Hist.';
            toggleBtn.style.background = prefersDarkMode ? 
              'linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(37, 99, 235, 0.9) 100%)' : 
              'linear-gradient(135deg, rgba(59, 130, 246, 1) 0%, rgba(37, 99, 235, 1) 100%)';
            toggleBtn.style.transform = 'scale(1)';
            toggleBtn.style.boxShadow = prefersDarkMode ? 
              '0 4px 12px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)' : 
              '0 4px 12px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255,255,255,0.4)';
          }
        });
        
        // Précharger l'historique après un court délai
        setTimeout(async () => {
          await generateHistoryElements(historyItemsContainer);
          
          // Vérification des IDs dupliqués pour le debugging
          if (utils.domUtils && utils.domUtils.checkForDuplicateIds) {
            const duplicates = utils.domUtils.checkForDuplicateIds();
            if (duplicates.length > 0) {
              console.error('Extension API Naturalisation: IDs dupliqués détectés:', duplicates);
            }
          }
        }, 1000);
      }
    }, 500);
  } catch (error) {
    console.log(
      "Extension API Naturalisation : Erreur d'initialisation:",
      error
    );
  }
})();
