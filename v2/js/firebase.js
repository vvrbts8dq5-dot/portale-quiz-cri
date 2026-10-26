// Configurazione Firebase condivisa da tutte le pagine del portale v2.
// Unica versione dell'SDK per tutto il progetto: cambiarla solo qui.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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
export const db = getFirestore(app);

// Corsi disponibili (in fase 3 verranno letti dalla collezione `corsi`)
export const CORSI = {
  base:    { label: 'Corso Base',         icona: '🏥' },
  tssa:    { label: 'Corso TSSA',         icona: '🚑' },
  squadra: { label: 'Formazione Squadra', icona: '👥' }
};
