(async function () {
  const CONFIG = {
    URL_PATTERN: "administration-etrangers-en-france",
    TAB_NAME: "Demande d'accès à la Nationalité Française",
    API_ENDPOINT:
      "https://administration-etrangers-en-france.interieur.gouv.fr/api/anf/dossier-stepper",
    WAIT_TIME: 100,
    STORAGE_KEY: "naturalisation_status_data",
    HISTORY_KEY: "naturalisation_status_history",
    HISTORY_MAX_ENTRIES: 30,
    NOTIFICATION_ID: "status_naturalisation_notification",
    NOTIFICATION_ICON: "icons/icon48.png",
  };

  // Stockage en mémoire pour fallback quand l'API storage n'est pas disponible
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

  // Détection du navigateur et utilisation de l'API appropriée avec vérification des capacités
  let browserAPI;
  if (typeof browser !== 'undefined') {
    browserAPI = browser;
  } else if (typeof chrome !== 'undefined') {
    browserAPI = chrome;
  } else {
    console.warn('Aucune API de navigateur détectée');
    browserAPI = {}; // Fallback pour éviter les erreurs
  }
  
  // Vérification des capacités disponibles
  const hasStorageAPI = browserAPI && browserAPI.storage && browserAPI.storage.local;
  const hasNotificationsAPI = browserAPI && browserAPI.notifications;
  
  console.log('Extension API Naturalisation : APIs disponibles :', {
    storage: hasStorageAPI ? 'oui' : 'non',
    notifications: hasNotificationsAPI ? 'oui' : 'non'
  });
  
  // Fonction pour sauvegarder les données dans le stockage local
  async function saveToStorage(data) {
    return new Promise((resolve) => {
      try {
        if (hasStorageAPI) {
          browserAPI.storage.local.set({ [CONFIG.STORAGE_KEY]: data }, () => {
            if (browserAPI.runtime && browserAPI.runtime.lastError) {
              console.warn('Erreur de sauvegarde (utilisation du fallback):', browserAPI.runtime.lastError);
              // Fallback sur stockage en mémoire
              memoryStorage[CONFIG.STORAGE_KEY] = data;
            }
            console.log('Données sauvegardées');
            resolve();
          });
        } else {
          // Utilisation du stockage en mémoire
          memoryStorage[CONFIG.STORAGE_KEY] = data;
          console.log('Données sauvegardées en mémoire (fallback)');
          resolve();
        }
      } catch (error) {
        console.warn('Erreur lors de la sauvegarde des données (utilisation du fallback):', error);
        // Fallback sur stockage en mémoire
        memoryStorage[CONFIG.STORAGE_KEY] = data;
        resolve();
      }
    });
  }
  
  // Fonction pour récupérer les données du stockage local
  async function getFromStorage() {
    return new Promise((resolve) => {
      try {
        if (hasStorageAPI) {
          browserAPI.storage.local.get([CONFIG.STORAGE_KEY], (result) => {
            if (browserAPI.runtime && browserAPI.runtime.lastError) {
              console.warn('Erreur de lecture (utilisation du fallback):', browserAPI.runtime.lastError);
              resolve(memoryStorage[CONFIG.STORAGE_KEY]);
            } else {
              console.log('Données récupérées avec succès');
              resolve(result[CONFIG.STORAGE_KEY] || null);
            }
          });
        } else {
          // Utilisation du stockage en mémoire
          console.log('Données récupérées depuis la mémoire (fallback)');
          resolve(memoryStorage[CONFIG.STORAGE_KEY]);
        }
      } catch (error) {
        console.warn('Erreur lors de la récupération des données (utilisation du fallback):', error);
        resolve(memoryStorage[CONFIG.STORAGE_KEY]);
      }
    });
  }
  
  // Fonction pour récupérer l'historique des statuts
  async function getStatusHistory() {
    return new Promise((resolve) => {
      try {
        if (hasStorageAPI) {
          browserAPI.storage.local.get([CONFIG.HISTORY_KEY], (result) => {
            if (browserAPI.runtime && browserAPI.runtime.lastError) {
              console.warn('Erreur de lecture de l\'historique (utilisation du fallback):', browserAPI.runtime.lastError);
              resolve(memoryStorage[CONFIG.HISTORY_KEY] || []);
            } else {
              console.log('Historique récupéré avec succès');
              resolve(result[CONFIG.HISTORY_KEY] || []);
            }
          });
        } else {
          // Utilisation du stockage en mémoire
          console.log('Historique récupéré depuis la mémoire (fallback)');
          resolve(memoryStorage[CONFIG.HISTORY_KEY] || []);
        }
      } catch (error) {
        console.warn('Erreur lors de la récupération de l\'historique (utilisation du fallback):', error);
        resolve(memoryStorage[CONFIG.HISTORY_KEY] || []);
      }
    });
  }
  
  // Fonction pour ajouter une entrée à l'historique des statuts
  async function addToStatusHistory(entry) {
    try {
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
        if (hasStorageAPI) {
          browserAPI.storage.local.set({ [CONFIG.HISTORY_KEY]: history }, () => {
            if (browserAPI.runtime && browserAPI.runtime.lastError) {
              console.warn('Erreur lors de la sauvegarde de l\'historique (utilisation du fallback)');
              memoryStorage[CONFIG.HISTORY_KEY] = history;
            }
          });
        } else {
          // Fallback sur stockage en mémoire
          memoryStorage[CONFIG.HISTORY_KEY] = history;
        }
        console.log('Entrée ajoutée à l\'historique avec succès');
      } else {
        console.log('Entrée déjà présente dans l\'historique, ignorée');
      }
    } catch (error) {
      console.warn('Erreur lors de l\'ajout à l\'historique (utilisation du fallback):', error);
      // En cas d'erreur, essayer d'utiliser le stockage en mémoire
      try {
        const history = memoryStorage[CONFIG.HISTORY_KEY] || [];
        history.unshift(entry);
        if (history.length > CONFIG.HISTORY_MAX_ENTRIES) {
          history.pop();
        }
        memoryStorage[CONFIG.HISTORY_KEY] = history;
      } catch (fallbackError) {
        console.error('Échec total de l\'ajout à l\'historique:', fallbackError);
      }
    }
  }
  
  // Fonction pour afficher une notification
  async function showNotification(title, message) {
    try {
      if (!hasNotificationsAPI) {
        console.warn('API de notifications non disponible');
        return;
      }
      
      // Vérifie si la permission de notification est accordée
      if (browserAPI.permissions && browserAPI.permissions.contains) {
        const permission = await browserAPI.permissions.contains({ permissions: ['notifications'] });
        if (!permission) {
          console.warn('Permission de notification non accordée');
          return;
        }
      }
      
      // Déterminer l'URL de l'icône (chemin relatif à l'extension)
      let iconUrl = 'icon128.png'; // Valeur par défaut
      if (browserAPI.runtime && browserAPI.runtime.getURL) {
        iconUrl = browserAPI.runtime.getURL(CONFIG.NOTIFICATION_ICON);
      }
      
      // Créer la notification
      browserAPI.notifications.create(CONFIG.NOTIFICATION_ID, {
        type: 'basic',
        iconUrl: iconUrl,
        title: title,
        message: message
      });
    } catch (error) {
      console.warn('Erreur lors de l\'affichage de la notification:', error);
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

    // Fonction pour calculer le nombre de jours écoulés
    function daysAgo(dateString) {
      const inputDate = new Date(dateString);
      const currentDate = new Date();
      const diffInDays = Math.floor(
        (currentDate - inputDate) / (1000 * 60 * 60 * 24)
      );

      if (diffInDays === 0) return "Aujourd'hui";
      if (diffInDays === 1) return "il y a 1 jr";
      if (diffInDays <= 30) return `il y a ${diffInDays} jrs`;

      const years = Math.floor(diffInDays / 365);
      const months = Math.floor((diffInDays % 365) / 30);
      const days = diffInDays % 30;

      if (years >= 1) {
        if (months === 0) {
          return `il y a ${years} ${years === 1 ? "an" : "ans"}`;
        }
        return `il y a ${years} ${
          years === 1 ? "an" : "ans"
        } et ${months} mois`;
      }

      if (months >= 1) {
        if (days === 0) {
          return `il y a ${months} ${months === 1 ? "mois" : "mois"}`;
        }
        return `il y a ${months} ${
          months === 1 ? "mois" : "mois"
        } et ${days} jrs`;
      }

      return `il y a ${months} mois`;
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
    
    // Fonction pour générer le code HTML de l'historique
    async function generateHistoryHtml() {
      try {
        const history = await getStatusHistory();
        if (!history || history.length === 0) {
          return '<div class="history-item">Aucun historique disponible</div>';
        }
        
        let historyHtml = '';
        history.forEach((entry, index) => {
          if (entry.noChange) {
            // C'est juste une vérification sans changement, on peut l'ignorer pour l'affichage
            return;
          }
          
          const date = formatDate(entry.detectedAt);
          let itemHtml = `
            <div class="history-item" style="padding: 10px; border-bottom: 1px solid #e0e0e0; margin-bottom: 10px;">
              <div style="font-weight: bold; color: #255a99;">${entry.status}</div>
              <div style="font-size: 0.9em; color: #666;">Détecté le ${date}</div>
          `;
          
          if (entry.previousStatus) {
            itemHtml += `<div style="font-size: 0.9em; margin-top: 5px; font-style: italic;">Précédent: ${entry.previousStatus}</div>`;
          }
          
          itemHtml += '</div>';
          historyHtml += itemHtml;
        });
        
        return historyHtml;
      } catch (error) {
        console.error("Erreur lors de la génération de l'historique:", error);
        return '<div class="history-item">Erreur lors du chargement de l\'historique</div>';
      }
    }

    // Création du nouvel élément avec le style et le format spécifiés
    const newElement = document.createElement("li");
    newElement.setAttribute(dynamicClass, "");
    newElement.className = "itemFrise active ng-star-inserted";
    newElement.setAttribute(
      "style",
      `
      background: linear-gradient(165deg, #dbe2e9, #ffffff);
      border: 2px solid #255a99;
      border-radius: 8px;
      box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.2), 5px 5px 15px rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: Arial, sans-serif;
      font-size: 18px;
      color: #080000;
      flex-wrap: wrap;
      cursor: pointer;
    `
    );
    newElement.innerHTML = `
      <div ${dynamicClass} class="itemFriseContent" style="width: 100%;">
        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
          <span ${dynamicClass} class="itemFriseIcon">
            <span ${dynamicClass} aria-hidden="true" class="fa fa-hourglass-start" style="color: #bf2626!important;"></span>
          </span>
          <p ${dynamicClass} style="flex-grow: 1;">
            ${dossierStatus} <span style="color: #bf2626;">(${daysAgo(
      data?.dossier?.date_statut
    )})</span>
          </p>
          <span id="toggle-history-btn" style="cursor: pointer; padding: 5px 10px; background: #255a99; color: white; border-radius: 4px; margin-left: 15px; font-size: 14px;">
            Historique
          </span>
        </div>
        <div id="status-history-container" style="display: none; width: 100%; margin-top: 15px; max-height: 300px; overflow-y: auto; padding: 10px; background-color: #f8f9fa; border-radius: 5px; border: 1px solid #dee2e6;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <h3 style="margin: 0; color: #255a99;">Historique des statuts</h3>
          </div>
          <div id="history-items-container" style="overflow-y: auto;">
            <div style="text-align: center; padding: 20px;">Chargement de l'historique...</div>
          </div>
        </div>
      </div>
    `;

    activeStep.parentNode.insertBefore(newElement, activeStep.nextSibling);
    console.log(
      "Extension API Naturalisation  : Nouvel élément inséré avec le statut du dossier"
    );
    
    // Ajouter la logique pour afficher/masquer l'historique
    setTimeout(async () => {
      const toggleBtn = document.getElementById('toggle-history-btn');
      const historyContainer = document.getElementById('status-history-container');
      const historyItemsContainer = document.getElementById('history-items-container');
      
      if (toggleBtn && historyContainer && historyItemsContainer) {
        toggleBtn.addEventListener('click', async function() {
          if (historyContainer.style.display === 'none') {
            historyContainer.style.display = 'block';
            toggleBtn.textContent = 'Masquer';
            toggleBtn.style.background = '#bf2626';
            
            // Charger l'historique à la demande
            historyItemsContainer.innerHTML = await generateHistoryHtml();
          } else {
            historyContainer.style.display = 'none';
            toggleBtn.textContent = 'Historique';
            toggleBtn.style.background = '#255a99';
          }
        });
        
        // Précharger l'historique après un court délai
        setTimeout(async () => {
          historyItemsContainer.innerHTML = await generateHistoryHtml();
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
