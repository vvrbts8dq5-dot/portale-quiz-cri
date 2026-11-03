// Configurazione Firebase condivisa da tutte le pagine del portale v2.
// Unica versione dell'SDK per tutto il progetto: cambiarla solo qui.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { initializeFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export const firebaseConfig = {
  apiKey: "AIzaSyAQsAwG237CMsuqlNTvrGyfNphDSjlg4JM",
  authDomain: "portale-quiz-cri.firebaseapp.com",
  projectId: "portale-quiz-cri",
  storageBucket: "portale-quiz-cri.firebasestorage.app",
  messagingSenderId: "889294477843",
  appId: "1:889294477843:web:69a0e52a858a482becbde6"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
auth.languageCode = 'it';
// Long polling forzato: su alcune reti (proxy aziendali, firewall, antivirus) il canale continuo che Firestore
// usa di default resta bloccato per 10-20 secondi prima di ripartire. Con il long polling le letture e le
// scritture partono subito ovunque; per questo portale (letture e scritture puntuali) la differenza di velocità è trascurabile.
export const db = initializeFirestore(app, { experimentalForceLongPolling: true });

// Corsi disponibili (in fase 3 verranno letti dalla collezione `corsi`)
export const CORSI = {
  base:    { label: 'Corso Base',         icona: '🏥' },
  tssa:    { label: 'Corso TSSA',         icona: '🚑' },
  squadra: { label: 'Formazione Squadra', icona: '👥' }
};
