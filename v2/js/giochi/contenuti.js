// Contenuti dei giochi che non nascono dalle domande dei quiz: sequenze, frasi da completare,
// abbinamenti, casi clinici e punti di anatomia.
//
// Ogni elemento ha:
//   id   identificativo stabile (finisce nelle statistiche: NON cambiarlo una volta pubblicato,
//        se il contenuto cambia molto conviene creare un id nuovo)
//   cat  argomenti a cui appartiene, in ordine di preferenza. Il gioco usa il primo argomento
//        presente nel corso del volontario; gli errori finiscono nelle statistiche di quell'argomento.
//
// Riferimenti: linee guida ERC/IRC 2021 per BLS-D e PBLS, algoritmo START per il triage.
// TUTTI i contenuti vanno validati dagli istruttori (Pannello → Contenuti giochi).

const SALVAVITA = ['base_salvavita', 'tssa_cardio', 'tssa_adulto', 'squadra'];

// ---------------------------------------------------------------------------
// METTI IN ORDINE — i passi sono già nell'ordine corretto (il gioco li mescola)
// ---------------------------------------------------------------------------
export const SEQUENZE = [
  { id: 'seq_bls_adulto', cat: SALVAVITA, titolo: 'BLS-D nell\'adulto',
    consegna: 'Una persona si accascia a terra davanti a te. Metti in ordine le azioni.',
    passi: [
      'Verifica la sicurezza della scena',
      'Valuta la coscienza: chiama e scuoti le spalle',
      'Chiedi aiuto alle persone vicine',
      'Apri le vie aeree: iperestensione del capo e sollevamento del mento',
      'Valuta il respiro (Guardo, Ascolto, Sento) per massimo 10 secondi',
      'Allerta il 112/118 e fai portare il DAE',
      'Inizia 30 compressioni toraciche',
      'Esegui 2 ventilazioni',
      'Appena arriva, accendi il DAE e segui le sue istruzioni'
    ] },
  { id: 'seq_dae', cat: SALVAVITA, titolo: 'Uso del DAE',
    consegna: 'Il DAE è arrivato mentre stai facendo la RCP. In che ordine procedi?',
    passi: [
      'Accendi il DAE',
      'Scopri il torace e asciugalo se bagnato',
      'Applica le piastre: sotto la clavicola destra e sul fianco sinistro',
      'Durante l\'analisi nessuno tocca il paziente',
      'Se lo shock è indicato, allontana tutti e premi il pulsante',
      'Riprendi subito la RCP per 2 minuti, fino alla nuova analisi'
    ] },
  { id: 'seq_ostruzione_adulto', cat: ['base_salvavita', 'tssa_adulto', 'squadra'], titolo: 'Ostruzione grave delle vie aeree (adulto)',
    consegna: 'Un adulto cosciente non riesce più a parlare né a tossire. Metti in ordine.',
    passi: [
      'Riconosci l\'ostruzione grave: non parla, non tossisce efficacemente',
      'Posizionati di lato e un po\' dietro, sostienigli il torace e inclinalo in avanti',
      'Dai fino a 5 colpi tra le scapole',
      'Se non si risolve, esegui fino a 5 compressioni addominali',
      'Continua ad alternare 5 colpi e 5 compressioni',
      'Se perde coscienza: adagialo a terra, allerta il 112/118 e inizia la RCP'
    ] },
  { id: 'seq_pbls', cat: ['tssa_pediatrico', 'base_salvavita'], titolo: 'BLS pediatrico',
    consegna: 'Un bambino non risponde. Metti in ordine le azioni del soccorritore.',
    passi: [
      'Verifica la sicurezza della scena',
      'Valuta la coscienza con stimolo verbale e tattile',
      'Chiedi aiuto',
      'Apri le vie aeree',
      'Valuta il respiro per massimo 10 secondi',
      'Esegui 5 ventilazioni iniziali',
      'Valuta i segni vitali',
      'Inizia 15 compressioni alternate a 2 ventilazioni',
      'Se sei solo, allerta il 112/118 dopo circa 1 minuto di RCP'
    ] },
  { id: 'seq_abcde', cat: ['tssa_adulto', 'tssa_trauma', 'tssa_resp', 'squadra'], titolo: 'Valutazione primaria ABCDE',
    consegna: 'Arrivi sul paziente. Metti in ordine la valutazione primaria.',
    passi: [
      'Sicurezza della scena e autoprotezione',
      'A — Pervietà delle vie aeree',
      'B — Respiro: frequenza, qualità, SpO2',
      'C — Circolo: polso, cute, emorragie',
      'D — Stato neurologico: AVPU e pupille',
      'E — Esposizione e protezione dall\'ipotermia'
    ] },
  { id: 'seq_ossigeno', cat: ['tssa_ossigeno', 'squadra'], titolo: 'Preparare l\'ossigenoterapia',
    consegna: 'Devi somministrare ossigeno con maschera con reservoir. In che ordine?',
    passi: [
      'Controlla il manometro: quanto ossigeno c\'è nella bombola',
      'Collega il flussimetro alla bombola',
      'Apri lentamente la valvola della bombola',
      'Imposta il flusso indicato sul flussimetro',
      'Riempi il reservoir tappando la valvola della maschera',
      'Posiziona la maschera sul volto del paziente',
      'Monitora SpO2 e condizioni del paziente'
    ] },
  { id: 'seq_emorragia', cat: ['tssa_trauma', 'base_salvavita', 'squadra'], titolo: 'Emorragia grave di un arto',
    consegna: 'Un ferito perde molto sangue da una gamba. Metti in ordine.',
    passi: [
      'Indossa i dispositivi di protezione individuale',
      'Esponi la ferita',
      'Comprimi direttamente la ferita con garze',
      'Se il sanguinamento non si ferma, applica il tourniquet a monte della ferita',
      'Annota l\'orario di applicazione del tourniquet',
      'Comunica alla centrale e rivaluta il paziente'
    ] },
  { id: 'seq_fast', cat: ['tssa_neuro'], titolo: 'Sospetto ictus',
    consegna: 'Una signora parla in modo strano. Metti in ordine la valutazione.',
    passi: [
      'Chiedi di sorridere: cerca l\'asimmetria del volto',
      'Chiedi di alzare entrambe le braccia: una cade?',
      'Chiedi di ripetere una frase semplice',
      'Stabilisci l\'ora esatta di inizio dei sintomi',
      'Comunica subito alla centrale il sospetto ictus'
    ] }
];

// ---------------------------------------------------------------------------
// COMPLETA LA FRASE — [[parola]] = spazio da riempire; distrattori = parole sbagliate
// ---------------------------------------------------------------------------
export const FRASI = [
  { id: 'fr_compressioni', cat: SALVAVITA,
    testo: 'Nell\'adulto le compressioni toraciche si eseguono a una frequenza di [[100-120]] al minuto e a una profondità di [[5-6 cm]].',
    distrattori: ['60-80', '140-160', '2-3 cm', '8-10 cm'] },
  { id: 'fr_rapporto', cat: SALVAVITA,
    testo: 'Nel BLS dell\'adulto il rapporto tra compressioni e ventilazioni è [[30:2]].',
    distrattori: ['15:2', '5:1', '30:1'] },
  { id: 'fr_gas', cat: SALVAVITA,
    testo: 'La valutazione del respiro dura al massimo [[10]] secondi; il respiro agonico (gasping) va considerato [[assenza di respiro]].',
    distrattori: ['30', '60', 'respiro normale', 'segno di ripresa'] },
  { id: 'fr_dae', cat: SALVAVITA,
    testo: 'Una piastra del DAE va sotto la clavicola [[destra]], l\'altra sul fianco [[sinistro]] lungo la linea ascellare media.',
    distrattori: ['sinistra', 'destro'] },
  { id: 'fr_pbls', cat: ['tssa_pediatrico'],
    testo: 'Nel BLS pediatrico si iniziano con [[5]] ventilazioni e si prosegue con un rapporto di [[15:2]].',
    distrattori: ['2', '10', '30:2', '5:1'] },
  { id: 'fr_avpu', cat: ['tssa_neuro', 'tssa_adulto'],
    testo: 'Nella scala AVPU, V significa che il paziente risponde allo stimolo [[verbale]], P che risponde solo allo stimolo [[doloroso]].',
    distrattori: ['visivo', 'pressorio', 'luminoso'] },
  { id: 'fr_cincinnati', cat: ['tssa_neuro'],
    testo: 'La scala di Cincinnati valuta [[mimica del volto]], [[forza delle braccia]] e [[linguaggio]].',
    distrattori: ['pupille', 'glicemia', 'frequenza cardiaca'] },
  { id: 'fr_parametri', cat: ['tssa_adulto', 'tssa_anatomia', 'tssa_resp'],
    testo: 'Nell\'adulto a riposo la frequenza respiratoria normale è di [[12-20]] atti al minuto e la frequenza cardiaca di [[60-100]] battiti al minuto.',
    distrattori: ['25-35', '6-10', '40-50', '110-130'] },
  { id: 'fr_ipoglicemia', cat: ['tssa_adulto', 'tssa_neuro'],
    testo: 'Si parla di ipoglicemia quando la glicemia scende sotto i [[70]] mg/dl.',
    distrattori: ['120', '180', '250'] },
  { id: 'fr_reservoir', cat: ['tssa_ossigeno'],
    testo: 'La maschera con reservoir permette concentrazioni di ossigeno [[elevate]] e si usa con flussi di [[10-15]] litri al minuto.',
    distrattori: ['basse', '1-2', '3-5'] },
  { id: 'fr_tourniquet', cat: ['tssa_trauma'],
    testo: 'Il tourniquet si applica [[a monte]] della ferita, cioè tra la ferita e il [[cuore]], annotando l\'[[orario]] di applicazione.',
    distrattori: ['a valle', 'piede', 'nome del farmaco'] },
  { id: 'fr_principi', cat: ['base_principi'],
    testo: 'I Principi Fondamentali del Movimento sono [[sette]] e furono proclamati a [[Vienna]] nel [[1965]].',
    distrattori: ['cinque', 'dieci', 'Ginevra', '1863', '1949'] },
  { id: 'fr_convenzioni', cat: ['base_diu'],
    testo: 'Le Convenzioni di Ginevra del 1949 sono [[quattro]]; i Protocolli aggiuntivi del 1977 sono [[due]].',
    distrattori: ['tre', 'sei', 'cinque'] },
  { id: 'fr_dunant', cat: ['base_movimento'],
    testo: 'L\'idea della Croce Rossa nacque da [[Henry Dunant]] dopo la battaglia di [[Solferino]] del 1859.',
    distrattori: ['Florence Nightingale', 'Magenta', 'Custoza'] },
  { id: 'fr_cri', cat: ['base_movimento'],
    testo: 'La Croce Rossa Italiana nacque a [[Milano]] nel [[1864]].',
    distrattori: ['Torino', 'Roma', '1859', '1946'] },
  { id: 'fr_emblemi', cat: ['base_principi', 'base_diu'],
    testo: 'Gli emblemi riconosciuti sono la croce rossa, la [[mezzaluna rossa]] e il [[cristallo rosso]].',
    distrattori: ['stella rossa', 'cerchio rosso', 'scudo rosso'] }
];

// ---------------------------------------------------------------------------
// ABBINA — coppie [sinistra, destra]
// ---------------------------------------------------------------------------
export const ABBINAMENTI = [
  { id: 'ab_principi', cat: ['base_principi'], titolo: 'I sette Principi Fondamentali',
    coppie: [
      ['Umanità', 'Prevenire e alleviare in ogni circostanza la sofferenza umana'],
      ['Imparzialità', 'Nessuna distinzione di nazionalità, razza, religione, classe o opinioni politiche'],
      ['Neutralità', 'Non prendere parte alle ostilità né alle controversie politiche, razziali o religiose'],
      ['Indipendenza', 'Autonomia dalle autorità, pur essendo ausiliari dei poteri pubblici'],
      ['Volontarietà', 'Soccorso prestato senza alcun desiderio di guadagno'],
      ['Unità', 'Una sola Società nazionale per Paese, aperta a tutti'],
      ['Universalità', 'Movimento mondiale in cui tutte le Società hanno uguali diritti e doveri']
    ] },
  { id: 'ab_convenzioni', cat: ['base_diu'], titolo: 'Chi proteggono le Convenzioni di Ginevra',
    coppie: [
      ['I Convenzione', 'Feriti e malati delle forze armate in campagna'],
      ['II Convenzione', 'Feriti, malati e naufraghi delle forze armate in mare'],
      ['III Convenzione', 'Prigionieri di guerra'],
      ['IV Convenzione', 'Popolazione civile in tempo di guerra']
    ] },
  { id: 'ab_avpu', cat: ['tssa_neuro', 'tssa_adulto'], titolo: 'Scala AVPU',
    coppie: [
      ['A', 'Sveglio e vigile'],
      ['V', 'Risponde allo stimolo verbale'],
      ['P', 'Risponde solo allo stimolo doloroso'],
      ['U', 'Non risponde a nessuno stimolo']
    ] },
  { id: 'ab_parametri', cat: ['tssa_adulto', 'tssa_anatomia'], titolo: 'Parametri vitali normali (adulto a riposo)',
    coppie: [
      ['Frequenza cardiaca', '60-100 battiti/min'],
      ['Frequenza respiratoria', '12-20 atti/min'],
      ['Saturazione (SpO2)', '95-100%'],
      ['Temperatura corporea', '36-37,5 °C'],
      ['Glicemia a digiuno', '70-100 mg/dl']
    ] },
  { id: 'ab_presidi', cat: ['tssa_trauma', 'squadra'], titolo: 'Presidi per il trauma',
    coppie: [
      ['Collare cervicale', 'Limita i movimenti del rachide cervicale'],
      ['Barella a cucchiaio', 'Raccoglie il paziente da terra muovendolo il meno possibile'],
      ['Estricatore (KED)', 'Estrae il paziente seduto, ad esempio da un veicolo'],
      ['Materasso a depressione', 'Immobilizza per il trasporto adattandosi al corpo'],
      ['Tavola spinale', 'Immobilizza e sposta il paziente traumatizzato'],
      ['Tourniquet', 'Ferma un\'emorragia massiva di un arto']
    ] },
  { id: 'ab_ossigeno', cat: ['tssa_ossigeno'], titolo: 'Presidi per l\'ossigeno e flussi',
    coppie: [
      ['Cannula nasale', 'Flussi bassi, circa 1-6 L/min'],
      ['Maschera semplice', 'Flussi intermedi, circa 5-10 L/min'],
      ['Maschera con reservoir', 'Flussi alti, 10-15 L/min'],
      ['Pallone autoespansibile', 'Ventilazione assistita del paziente che non respira adeguatamente']
    ] },
  { id: 'ab_apparati', cat: ['tssa_anatomia'], titolo: 'Organi e apparati',
    coppie: [
      ['Alveoli', 'Apparato respiratorio'],
      ['Miocardio', 'Apparato cardiocircolatorio'],
      ['Nefrone', 'Apparato urinario'],
      ['Midollo spinale', 'Sistema nervoso'],
      ['Fegato', 'Apparato digerente'],
      ['Tiroide', 'Sistema endocrino']
    ] },
  { id: 'ab_farmaci', cat: ['tssa_farmaci'], titolo: 'Farmaci e situazioni',
    coppie: [
      ['Adrenalina', 'Anafilassi'],
      ['Salbutamolo', 'Broncospasmo (asma)'],
      ['Nitroglicerina', 'Dolore toracico di origine cardiaca'],
      ['Glucosio', 'Ipoglicemia'],
      ['Naloxone', 'Intossicazione da oppioidi'],
      ['Acido acetilsalicilico', 'Sospetta sindrome coronarica acuta']
    ] }
];

// ---------------------------------------------------------------------------
// CASI CLINICI A BIVI — ogni tappa ha una situazione e delle scelte (una è la migliore).
// Con una scelta sbagliata il caso prosegue comunque, ma il volontario vede le conseguenze.
// ---------------------------------------------------------------------------
export const CASI = [
  { id: 'caso_acc', cat: SALVAVITA, titolo: 'Malore al supermercato', icona: '🛒',
    intro: 'Sei di turno in ambulanza. Un uomo sui 60 anni si è accasciato tra le corsie di un supermercato. Arrivate in 6 minuti.',
    tappe: [
      { id: 't1', testo: 'Entri nel supermercato. Ci sono persone attorno all\'uomo, un carrello rovesciato e del liquido sul pavimento. Cosa fai per prima cosa?',
        scelte: [
          { t: 'Valuto la sicurezza: faccio spostare il carrello e allontano i curiosi', ok: true, fb: 'Corretto: prima la sicurezza tua, della squadra e del paziente.' },
          { t: 'Corro subito dal paziente e inizio le compressioni', fb: 'Rischioso: il liquido a terra può farti scivolare. La sicurezza viene sempre per prima.' },
          { t: 'Chiedo ai presenti cosa è successo prima di avvicinarmi', fb: 'Le informazioni sono utili, ma non devono ritardare la valutazione della scena e del paziente.' }
        ] },
      { id: 't2', testo: 'L\'uomo non risponde quando lo chiami e lo scuoti. Respira in modo lento e rumoroso, a boccate irregolari.',
        scelte: [
          { t: 'È un respiro agonico: lo considero arresto cardiaco', ok: true, fb: 'Esatto: il gasping non è un respiro normale e indica arresto cardiaco.' },
          { t: 'Respira: lo metto in posizione laterale di sicurezza', fb: 'Errore pericoloso: il respiro agonico non è respiro normale. Così si perde tempo prezioso.' },
          { t: 'Aspetto qualche minuto per vedere se migliora', fb: 'Ogni minuto senza RCP riduce molto la probabilità di sopravvivenza.' }
        ] },
      { id: 't3', testo: 'Avete confermato l\'arresto cardiaco. Siete in tre. Come vi organizzate?',
        scelte: [
          { t: 'Uno inizia subito le compressioni, uno prepara il DAE, uno comunica con la centrale', ok: true, fb: 'Perfetto: compressioni senza ritardi e DAE il prima possibile.' },
          { t: 'Prima prendiamo i parametri vitali completi, poi decidiamo', fb: 'In arresto cardiaco non si perde tempo con i parametri: compressioni e DAE subito.' },
          { t: 'Carichiamo subito il paziente in ambulanza', fb: 'La RCP durante il trasporto è poco efficace: si inizia sul posto.' }
        ] },
      { id: 't4', testo: 'Il DAE è collegato e dice: "Shock consigliato".',
        scelte: [
          { t: 'Mi assicuro che nessuno tocchi il paziente, erogo lo shock e riprendo subito le compressioni', ok: true, fb: 'Esatto: dopo lo shock si riprende subito la RCP, senza controllare il polso.' },
          { t: 'Erogo lo shock e controllo subito il polso', fb: 'Dopo lo shock si riprende immediatamente la RCP per 2 minuti: sarà il DAE a ri-analizzare.' },
          { t: 'Continuo le compressioni mentre il DAE eroga lo shock', fb: 'Pericoloso: durante lo shock nessuno deve toccare il paziente.' }
        ] },
      { id: 't5', testo: 'Dopo 2 minuti il DAE analizza di nuovo: "Shock non consigliato". Il paziente non si muove e non respira normalmente.',
        scelte: [
          { t: 'Riprendo subito la RCP e seguo le istruzioni del DAE', ok: true, fb: 'Corretto: "shock non consigliato" non significa che il cuore sia ripartito.' },
          { t: 'Spengo il DAE: lo shock non serve più', fb: 'Il DAE deve restare collegato e acceso: ri-analizzerà ogni 2 minuti.' },
          { t: 'Smetto le compressioni e aspetto il medico', fb: 'Le compressioni non si interrompono finché il paziente non mostra segni di vita o arriva il supporto avanzato che subentra.' }
        ] }
    ] },
  { id: 'caso_ictus', cat: ['tssa_neuro'], titolo: 'La signora che non trova le parole', icona: '🧠',
    intro: 'Vi chiama il figlio di una signora di 72 anni: a pranzo ha iniziato a parlare in modo confuso.',
    tappe: [
      { id: 't1', testo: 'La signora è seduta, sveglia, ma fatica a parlare. Cosa valuti per primo dopo l\'ABC?',
        scelte: [
          { t: 'Faccio la scala di Cincinnati: volto, braccia, linguaggio', ok: true, fb: 'Corretto: è il modo rapido per riconoscere un sospetto ictus.' },
          { t: 'Le chiedo di camminare per vedere se perde l\'equilibrio', fb: 'Farla camminare è rischioso: potrebbe cadere. Usa la scala di Cincinnati.' },
          { t: 'Le misuro solo la temperatura', fb: 'La temperatura non aiuta a riconoscere un ictus.' }
        ] },
      { id: 't2', testo: 'La bocca è storta a destra e il braccio destro cade. Quale informazione è fondamentale raccogliere?',
        scelte: [
          { t: 'L\'ora esatta in cui sono comparsi i sintomi (o in cui era stata vista bene l\'ultima volta)', ok: true, fb: 'Esatto: decide quali terapie si possono fare in ospedale.' },
          { t: 'Che cosa ha mangiato a pranzo', fb: 'Non è l\'informazione chiave. Conta l\'ora di inizio dei sintomi.' },
          { t: 'Se ha già avuto febbre questa settimana', fb: 'Può essere utile, ma la priorità è l\'ora di insorgenza.' }
        ] },
      { id: 't3', testo: 'Il figlio dice che è diabetica. Cosa fai?',
        scelte: [
          { t: 'Misuro la glicemia: un\'ipoglicemia può dare sintomi simili all\'ictus', ok: true, fb: 'Corretto: l\'ipoglicemia va sempre esclusa.' },
          { t: 'Le do subito dello zucchero da sciogliere in bocca', fb: 'Con difficoltà a parlare può avere difficoltà a deglutire: rischio di soffocamento. Prima misura.' },
          { t: 'Non cambia nulla, proseguo', fb: 'Il diabete è un\'informazione importante: verifica la glicemia.' }
        ] },
      { id: 't4', testo: 'Glicemia 128 mg/dl. La signora chiede un bicchiere d\'acqua.',
        scelte: [
          { t: 'Non le do niente da bere né da mangiare', ok: true, fb: 'Corretto: la deglutizione può essere compromessa.' },
          { t: 'Le do un po\' d\'acqua a piccoli sorsi', fb: 'Rischio di inalazione: nel sospetto ictus niente per bocca.' },
          { t: 'Le do l\'acqua con le sue pastiglie della pressione', fb: 'Niente per bocca, compresi i farmaci.' }
        ] },
      { id: 't5', testo: 'Cosa comunichi alla centrale?',
        scelte: [
          { t: 'Sospetto ictus, Cincinnati positiva, ora di inizio dei sintomi e parametri', ok: true, fb: 'Perfetto: così la centrale può indirizzarvi all\'ospedale giusto.' },
          { t: 'Solo che la paziente è stabile', fb: 'Troppo poco: la centrale deve sapere che è un sospetto ictus e da quando.' },
          { t: 'Che la porterete al pronto soccorso più vicino a casa', fb: 'La destinazione la decide la centrale in base ai dati che fornisci.' }
        ] }
    ] },
  { id: 'caso_moto', cat: ['tssa_trauma', 'squadra'], titolo: 'Incidente in moto', icona: '🏍️',
    intro: 'Un motociclista è caduto da solo su una strada extraurbana. È a terra, a pancia in su, con il casco.',
    tappe: [
      { id: 't1', testo: 'Arrivate sul posto. Le auto passano ancora a velocità sostenuta.',
        scelte: [
          { t: 'Metto in sicurezza la scena: ambulanza posizionata a protezione, giubbotti ad alta visibilità', ok: true, fb: 'Corretto: senza sicurezza non c\'è soccorso.' },
          { t: 'Corro dal paziente, il traffico lo gestirà qualcun altro', fb: 'Rischi di diventare tu stesso una vittima.' },
          { t: 'Sposto subito il motociclista sul bordo strada', fb: 'Spostarlo senza immobilizzazione può aggravare una lesione spinale.' }
        ] },
      { id: 't2', testo: 'Il motociclista è cosciente e si lamenta. Cosa fa per primo un soccorritore?',
        scelte: [
          { t: 'Stabilizza manualmente il capo in posizione neutra', ok: true, fb: 'Corretto: nel trauma la protezione del rachide cervicale va con la A.' },
          { t: 'Gli chiede di muovere il collo per vedere se fa male', fb: 'Mai far muovere il collo a un traumatizzato.' },
          { t: 'Gli mette un cuscino sotto la testa', fb: 'Il capo va tenuto in posizione neutra, senza sollevarlo.' }
        ] },
      { id: 't3', testo: 'Dalla coscia sinistra esce molto sangue, in modo continuo. La compressione diretta non basta.',
        scelte: [
          { t: 'Applico il tourniquet a monte della ferita e annoto l\'orario', ok: true, fb: 'Corretto: l\'emorragia massiva di un arto va fermata subito.' },
          { t: 'Continuo a comprimere e aspetto l\'automedica', fb: 'Se la compressione non basta, il tempo perso costa sangue: tourniquet.' },
          { t: 'Sollevo la gamba e basta', fb: 'Sollevare l\'arto da solo non ferma un\'emorragia massiva.' }
        ] },
      { id: 't4', testo: 'L\'emorragia è controllata. Il paziente diventa pallido, sudato, con polso radiale debole e veloce.',
        scelte: [
          { t: 'Sospetto uno shock: lo proteggo dal freddo e comunico subito l\'aggravamento', ok: true, fb: 'Corretto: segni di shock emorragico, priorità al trasporto e all\'ipotermia.' },
          { t: 'Gli do da bere per reintegrare i liquidi', fb: 'Niente per bocca: potrebbe servire un intervento chirurgico.' },
          { t: 'È solo spaventato, proseguo con calma', fb: 'Pallore, sudore e polso debole e rapido sono segni di shock.' }
        ] },
      { id: 't5', testo: 'Bisogna immobilizzarlo per il trasporto.',
        scelte: [
          { t: 'Collare cervicale, raccolta con barella a cucchiaio e immobilizzazione su materasso a depressione o tavola', ok: true, fb: 'Corretto, secondo il protocollo locale.' },
          { t: 'Lo alziamo in due prendendolo per braccia e gambe', fb: 'Così si muove la colonna: servono i presidi.' },
          { t: 'Lo facciamo alzare e salire da solo, visto che è cosciente', fb: 'Un traumatizzato con dinamica importante non si fa alzare.' }
        ] }
    ] },
  { id: 'caso_soffoca', cat: ['tssa_pediatrico', 'base_salvavita'], titolo: 'Il bambino che soffoca', icona: '🧸',
    intro: 'Durante una festa un bambino di 3 anni porta le mani alla gola mentre mangia.',
    tappe: [
      { id: 't1', testo: 'Il bambino tossisce con forza e piange.',
        scelte: [
          { t: 'Lo incoraggio a tossire e lo tengo d\'occhio', ok: true, fb: 'Corretto: la tosse efficace è il modo migliore per liberarsi.' },
          { t: 'Gli do subito dei colpi sulla schiena', fb: 'Con la tosse efficace non si interviene: si incoraggia a tossire.' },
          { t: 'Provo a togliere il cibo con le dita', fb: 'Mai a mano cieca: si rischia di spingere il corpo estraneo più in fondo.' }
        ] },
      { id: 't2', testo: 'Ora la tosse è debole, non riesce più a piangere e diventa cianotico.',
        scelte: [
          { t: 'Fino a 5 colpi tra le scapole, poi fino a 5 compressioni addominali', ok: true, fb: 'Corretto per un bambino sopra l\'anno di età.' },
          { t: 'Solo compressioni toraciche', fb: 'Nel bambino cosciente sopra l\'anno: colpi interscapolari e compressioni addominali.' },
          { t: 'Gli do dell\'acqua per far scendere il boccone', fb: 'Mai dare da bere: peggiora l\'ostruzione.' }
        ] },
      { id: 't3', testo: 'Il bambino perde coscienza.',
        scelte: [
          { t: 'Lo metto a terra, allerto il 112/118 e inizio la RCP pediatrica con 5 ventilazioni', ok: true, fb: 'Corretto: nel bambino incosciente si passa alla RCP.' },
          { t: 'Continuo con i colpi tra le scapole tenendolo in braccio', fb: 'Con la perdita di coscienza si inizia la RCP.' },
          { t: 'Lo metto in posizione laterale di sicurezza', fb: 'Non respira adeguatamente: serve la RCP.' }
        ] }
    ] },
  { id: 'caso_asma', cat: ['tssa_resp'], titolo: 'Fiato corto', icona: '🫁',
    intro: 'Una ragazza di 19 anni, asmatica, ha difficoltà a respirare dopo una corsa al parco.',
    tappe: [
      { id: 't1', testo: 'È seduta, parla a fatica a frasi spezzate, senti dei sibili.',
        scelte: [
          { t: 'La lascio seduta, leggermente in avanti, e la tranquillizzo', ok: true, fb: 'Corretto: è la posizione che le facilita il respiro.' },
          { t: 'La faccio sdraiare supina', fb: 'Da supina respirerebbe peggio.' },
          { t: 'Le chiedo di camminare fino all\'ambulanza', fb: 'Lo sforzo aumenta il bisogno di ossigeno.' }
        ] },
      { id: 't2', testo: 'SpO2 88%, frequenza respiratoria 32 atti/min.',
        scelte: [
          { t: 'Somministro ossigeno secondo protocollo e comunico i parametri alla centrale', ok: true, fb: 'Corretto: saturazione bassa e respiro molto veloce richiedono ossigeno e informazione alla centrale.' },
          { t: 'Aspetto di vedere se migliora da sola', fb: 'Con 88% di saturazione non si aspetta.' },
          { t: 'Le faccio respirare in un sacchetto di carta', fb: 'Il sacchetto non è indicato: peggiora l\'ossigenazione.' }
        ] },
      { id: 't3', testo: 'Dopo qualche minuto diventa sonnolenta e i sibili quasi non si sentono più.',
        scelte: [
          { t: 'È un peggioramento grave: comunico subito alla centrale e mi preparo a ventilare', ok: true, fb: 'Esatto: il "torace silente" e la sonnolenza sono segni di esaurimento.' },
          { t: 'Sta meglio: i sibili sono spariti', fb: 'Attenzione: se i sibili spariscono e la paziente è sonnolenta, l\'aria non passa più.' },
          { t: 'La lascio riposare senza disturbarla', fb: 'La sonnolenza qui è un segno di gravità, non di miglioramento.' }
        ] }
    ] },
  { id: 'caso_torace', cat: ['tssa_cardio', 'tssa_adulto'], titolo: 'Peso sul petto', icona: '❤️',
    intro: 'Un uomo di 58 anni ha un dolore al petto da 20 minuti, mentre spalava neve.',
    tappe: [
      { id: 't1', testo: 'Descrive il dolore come un peso che va verso il braccio sinistro. È sudato.',
        scelte: [
          { t: 'Sospetto una sindrome coronarica: lo faccio stare a riposo, semiseduto', ok: true, fb: 'Corretto: riposo e posizione comoda riducono il lavoro del cuore.' },
          { t: 'Gli dico di camminare per vedere se il dolore passa', fb: 'Lo sforzo aumenta il lavoro del cuore: deve restare a riposo.' },
          { t: 'Probabilmente è muscolare per lo sforzo', fb: 'Dolore oppressivo irradiato e sudorazione fanno pensare al cuore.' }
        ] },
      { id: 't2', testo: 'Cosa chiedi per completare la raccolta di informazioni?',
        scelte: [
          { t: 'Quando è iniziato, com\'è, dove si irradia, malattie e farmaci', ok: true, fb: 'Corretto: sono le informazioni utili alla centrale e all\'ospedale.' },
          { t: 'Solo se ha mangiato', fb: 'Troppo poco: servono le caratteristiche del dolore e la storia clinica.' },
          { t: 'Nulla, lo carico subito', fb: 'Le informazioni si raccolgono mentre si valuta il paziente: sono importanti.' }
        ] },
      { id: 't3', testo: 'Durante il trasporto smette di rispondere e non respira normalmente.',
        scelte: [
          { t: 'Arresto cardiaco: inizio subito la RCP e collego il DAE', ok: true, fb: 'Corretto: tieni sempre il DAE pronto nel dolore toracico.' },
          { t: 'Lo metto in posizione laterale di sicurezza', fb: 'Se non respira normalmente è arresto cardiaco: RCP e DAE.' },
          { t: 'Aumento la velocità dell\'ambulanza', fb: 'Serve la RCP sul posto con il mezzo fermo e il DAE.' }
        ] }
    ] }
];

// ---------------------------------------------------------------------------
// TROVA IL PUNTO — coordinate nella figura (viewBox 240×500), figura vista DI FRONTE:
// la destra del paziente è alla sinistra di chi guarda.
// ---------------------------------------------------------------------------
export const PUNTI_ANATOMIA = [
  { id: 'pt_carotideo', cat: ['tssa_anatomia', 'tssa_cardio', 'base_salvavita'], nome: 'Polso carotideo', punti: [[110, 92], [130, 92]],
    nota: 'Ai lati del collo, nel solco tra trachea e muscolo.' },
  { id: 'pt_radiale', cat: ['tssa_anatomia', 'tssa_adulto'], nome: 'Polso radiale', punti: [[34, 268], [206, 268]],
    nota: 'Al polso, dal lato del pollice.' },
  { id: 'pt_brachiale', cat: ['tssa_anatomia', 'tssa_pediatrico'], nome: 'Polso brachiale', punti: [[68, 170], [172, 170]],
    nota: 'Faccia interna del braccio: è il polso da cercare nel lattante.' },
  { id: 'pt_femorale', cat: ['tssa_anatomia'], nome: 'Polso femorale', punti: [[100, 288], [140, 288]],
    nota: 'All\'inguine, a metà della piega inguinale.' },
  { id: 'pt_pedidio', cat: ['tssa_anatomia'], nome: 'Polso pedidio', punti: [[96, 482], [144, 482]],
    nota: 'Sul dorso del piede.' },
  { id: 'pt_compressioni', cat: ['base_salvavita', 'tssa_cardio', 'tssa_anatomia'], nome: 'Punto delle compressioni toraciche', punti: [[120, 160]],
    nota: 'Al centro del torace, sulla metà inferiore dello sterno.' },
  { id: 'pt_dae_dx', cat: ['base_salvavita', 'tssa_cardio'], nome: 'Piastra DAE "sotto la clavicola destra"', punti: [[96, 122]],
    nota: 'Destra del paziente: per te che lo guardi è a sinistra.' },
  { id: 'pt_dae_sx', cat: ['base_salvavita', 'tssa_cardio'], nome: 'Piastra DAE "sul fianco sinistro"', punti: [[158, 182]],
    nota: 'Sul fianco sinistro del paziente, lungo la linea ascellare media.' },
  { id: 'pt_fegato', cat: ['tssa_anatomia', 'tssa_trauma'], nome: 'Fegato (ipocondrio destro)', punti: [[98, 212]],
    nota: 'In alto a destra dell\'addome del paziente, sotto le coste.' },
  { id: 'pt_milza', cat: ['tssa_anatomia', 'tssa_trauma'], nome: 'Milza (ipocondrio sinistro)', punti: [[144, 212]],
    nota: 'In alto a sinistra dell\'addome del paziente, sotto le coste.' },
  { id: 'pt_appendice', cat: ['tssa_anatomia'], nome: 'Appendice (fossa iliaca destra)', punti: [[103, 252]],
    nota: 'In basso a destra dell\'addome del paziente.' },
  { id: 'pt_epigastrio', cat: ['tssa_anatomia', 'tssa_cardio'], nome: 'Epigastrio', punti: [[120, 192]],
    nota: 'Parte alta e centrale dell\'addome, sotto lo sterno.' }
];

// Primo argomento dell'elemento presente nel corso (null = non disponibile)
export const argomentoNelCorso = (el, categorieCorso) => el.cat.find(c => categorieCorso.includes(c)) || null;

// Tutti gli elementi di un tipo disponibili per un corso, con l'argomento risolto
export const perCorso = (lista, categorieCorso) => lista
  .map(el => ({ ...el, argomento: argomentoNelCorso(el, categorieCorso) }))
  .filter(el => el.argomento);

// Catalogo testuale di ogni elemento, per le statistiche degli istruttori (id statistico → descrizione)
export function descriviElemento(idStat) {
  const [, gioco, id, parte] = String(idStat).split(':'); // es. g:ordina:seq_bls_adulto
  const trova = (lista) => lista.find(x => x.id === id);
  switch (gioco) {
    case 'ordina': { const s = trova(SEQUENZE); return s ? `Sequenza: ${s.titolo}` : idStat; }
    case 'completa': { const f = trova(FRASI); return f ? `Frase: ${f.testo.replace(/\[\[(.+?)\]\]/g, '___')}` : idStat; }
    case 'abbina': { const a = trova(ABBINAMENTI); return a ? `Abbina: ${a.titolo}${parte ? ' · ' + (a.coppie[+parte]?.[0] || '') : ''}` : idStat; }
    case 'caso': { const c = trova(CASI); const t = c?.tappe.find(x => x.id === parte); return c ? `Caso "${c.titolo}"${t ? ': ' + t.testo : ''}` : idStat; }
    case 'anatomia': { const p = trova(PUNTI_ANATOMIA); return p ? `Trova il punto: ${p.nome}` : idStat; }
    case 'triage': return `Triage START: ${RAMI_START[id] || id}`;
    case 'rcp': return id === 'frequenza' ? 'Ritmo RCP: frequenza 100-120/min' : 'Ritmo RCP: regolarità del ritmo';
    default: return idStat;
  }
}

// Rami dell'algoritmo START: ogni paziente del gioco ha una regola decisiva
export const RAMI_START = {
  cammina: 'cammina da solo → VERDE',
  apnea: 'non respira nemmeno dopo l\'apertura delle vie aeree → NERO',
  respira_dopo_apertura: 'respira solo dopo l\'apertura delle vie aeree → ROSSO',
  fr_alta: 'frequenza respiratoria > 30 → ROSSO',
  perfusione: 'polso radiale assente o riempimento capillare > 2 s → ROSSO',
  ordini: 'non esegue ordini semplici → ROSSO',
  giallo: 'parametri nei limiti ma non cammina → GIALLO'
};
