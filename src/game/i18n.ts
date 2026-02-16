import type { PowerUpKind } from "./types";
import type { SpeedMultiplier } from "./constants";

export type LanguageCode = "en" | "de" | "fr" | "it" | "ru";

export const LANGUAGE_OPTIONS: Array<{ code: LanguageCode; label: string }> = [
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" },
  { code: "it", label: "Italiano" },
  { code: "ru", label: "Русский" }
];

type Translations = {
  title: string;
  initialStatus: string;
  timeUpStatus: string;
  bombRefreshComplete: string;
  wordMin4: string;
  trayInvalid: string;
  noValidWord: string;
  submitWord: string;
  checking: string;
  backspace: string;
  clear: string;
  restartRound: string;
  playAgain: string;
  acceptedWords: string;
  goals: string;
  required: string;
  optional: string;
  noneYet: string;
  trayPlaceholder: string;
  wordPoints: string;
  roundScore: string;
  totalScore: string;
  round: string;
  combo: string;
  timeLeft: string;
  flyingLetters: string;
  target: string;
  effects: string;
  noEffects: string;
  effectX2: string;
  effectFreeze: string;
  effectWall: string;
  effectSlow: string;
  language: string;
  languageSetupTitle: string;
  roundDuration: string;
  rounds: string;
  roundDurationOptionLabel: (seconds: 60 | 90 | 120) => string;
  speed: string;
  bounces: string;
  speedOptionLabel: (value: SpeedMultiplier) => string;
  difficulty: string;
  presetCasual: string;
  presetStandard: string;
  presetChaos: string;
  presetCustom: string;
  startRound: string;
  menuButton: string;
  menuTitle: string;
  options: string;
  help: string;
  lettersOnScreen: string;
  pause: string;
  resume: string;
  nextRound: string;
  matchComplete: string;
  finalScore: string;
  playMatchAgain: string;
  newGame: string;
  closeMenu: string;
  helpTitle: string;
  helpHowToTitle: string;
  helpLineBuildWords: string;
  helpLineTapLetters: string;
  helpLineSubmitValid: string;
  helpLinePowerUps: string;
  helpScoringTitle: string;
  helpLineBonusTiles: string;
  helpLineWordMultiplierStack: string;
  helpRoundsTitle: string;
  helpLineRoundsGoal: string;
  helpLineRoundsEnd: string;
  helpPowerUpsTitle: string;
  closeHelp: string;
  pausedStatus: string;
  statusChecking: (word: string) => string;
  comboSuffix: (multiplier: number) => string;
  statusRoundBonus: (completed: number, total: number, bonus: number) => string;
  statusScoreRequired: (points: number) => string;
  statusGreatWord: (word: string, points: number, suffix: string) => string;
  goalScore: (points: number) => string;
  goalLongWords: (count: number, minLength: number) => string;
  goalPowerUps: (count: number) => string;
  powerUpActivated: Record<PowerUpKind, string>;
  powerUpHelp: Record<PowerUpKind, string>;
};

export const UI_TEXT: Record<LanguageCode, Translations> = {
  en: {
    title: "Word Constructor",
    initialStatus: "Tap flying letters to build a word.",
    timeUpStatus: "Time is up. Submit again after restart.",
    bombRefreshComplete: "Bomb refresh complete.",
    wordMin4: "Word must have at least 4 letters.",
    trayInvalid: "Current tray is not a valid word.",
    noValidWord: "No valid dictionary word for this letter set.",
    submitWord: "Submit Word",
    checking: "Checking...",
    backspace: "Backspace",
    clear: "Clear",
    restartRound: "Restart Round",
    playAgain: "Play Again",
    acceptedWords: "Accepted Words",
    goals: "Goals",
    required: "Required",
    optional: "Optional",
    noneYet: "None yet",
    trayPlaceholder: "Tap letters to build a word",
    wordPoints: "Word Points",
    roundScore: "Round Score",
    totalScore: "Total Score",
    round: "Round",
    combo: "Combo",
    timeLeft: "Time Left",
    flyingLetters: "Active Letters",
    target: "Target",
    effects: "Effects",
    noEffects: "None",
    effectX2: "x2",
    effectFreeze: "Freeze",
    effectWall: "Wall",
    effectSlow: "Slow",
    language: "Language",
    languageSetupTitle: "Choose language for this round",
    roundDuration: "Round Duration",
    rounds: "Rounds",
    roundDurationOptionLabel: (seconds) =>
      ({ 60: "Quick", 90: "Standard", 120: "Long" })[seconds],
    speed: "Speed",
    bounces: "Bounces",
    speedOptionLabel: (value) => ({ 0.8: "Slow", 1: "Normal", 1.25: "Fast" })[value],
    difficulty: "Difficulty",
    presetCasual: "Casual",
    presetStandard: "Standard",
    presetChaos: "Chaos",
    presetCustom: "Custom",
    startRound: "Start Round",
    menuButton: "Menu",
    menuTitle: "Game Menu",
    options: "Options",
    lettersOnScreen: "Letters",
    help: "Help",
    pause: "Pause",
    resume: "Resume",
    nextRound: "Next Round",
    matchComplete: "Match Complete",
    finalScore: "Final Score",
    playMatchAgain: "Play Match Again",
    newGame: "New Game",
    closeMenu: "Close",
    helpTitle: "How To Play",
    helpHowToTitle: "Quick Instructions",
    helpLineBuildWords: "Build words by tapping flying letters.",
    helpLineTapLetters: "Each tile bounces off walls 3 times, then exits.",
    helpLineSubmitValid: "Submit words with at least 4 letters.",
    helpLinePowerUps: "Tap moving round power-ups to activate effects.",
    helpScoringTitle: "Scoring",
    helpLineBonusTiles: "DL/TL multiply letter value first; DW/TW multiply the whole word.",
    helpLineWordMultiplierStack: "Multiple DW/TW tiles stack (for example DW + DW = x4).",
    helpRoundsTitle: "Rounds",
    helpLineRoundsGoal: "Each round has a score target (45, 60, 75, ...).",
    helpLineRoundsEnd: "If you miss the target when time ends, the run is over.",
    helpPowerUpsTitle: "Power-Ups",
    closeHelp: "Close",
    pausedStatus: "Game paused.",
    statusChecking: (word) => `Checking "${word}"...`,
    comboSuffix: (multiplier) => ` x${multiplier.toFixed(2)}`,
    statusRoundBonus: (completed, total, bonus) =>
      `Goals completed ${completed}/${total}. Bonus +${bonus}.`,
    statusScoreRequired: (points) => `Reach ${points} score this round to advance.`,
    statusGreatWord: (word, points, suffix) => `Great word: ${word} (+${points})${suffix}`,
    goalScore: (points) => `Score at least ${points}`,
    goalLongWords: (count, minLength) => `Make ${count} words of ${minLength}+ letters`,
    goalPowerUps: (count) => `Use ${count} power-ups`,
    powerUpActivated: {
      bomb: "Bomb triggered. Removed one letter.",
      multiplier: "x2 activated.",
      freeze: "Freeze activated.",
      wall: "Wall activated.",
      slow: "Slow Time activated.",
      "extra-time": "+10 seconds added.",
      "extra-time-15": "+15 seconds added."
    },
    powerUpHelp: {
      bomb: "Destroys one current flying letter.",
      multiplier: "Doubles active letters (base x2).",
      freeze: "Freezes movement briefly.",
      wall: "Prevents letters from leaving for 15 seconds.",
      slow: "Slows all movement.",
      "extra-time": "Adds 10 seconds.",
      "extra-time-15": "Adds 15 seconds."
    }
  },
  de: {
    title: "Word Constructor",
    initialStatus: "Tippe auf fliegende Buchstaben, um ein Wort zu bilden.",
    timeUpStatus: "Zeit ist abgelaufen. Nach Neustart erneut einreichen.",
    bombRefreshComplete: "Bomben-Aktualisierung abgeschlossen.",
    wordMin4: "Das Wort muss mindestens 4 Buchstaben haben.",
    trayInvalid: "Die aktuelle Buchstabenreihe ist kein gültiges Wort.",
    noValidWord: "Kein gültiges Wörterbuchwort für diese Buchstaben.",
    submitWord: "Wort senden",
    checking: "Prüfe...",
    backspace: "Löschen",
    clear: "Leeren",
    restartRound: "Runde neu starten",
    playAgain: "Nochmal spielen",
    acceptedWords: "Akzeptierte Wörter",
    goals: "Ziele",
    required: "Pflicht",
    optional: "Optional",
    noneYet: "Noch keine",
    trayPlaceholder: "Tippe Buchstaben, um ein Wort zu bilden",
    wordPoints: "Wortpunkte",
    roundScore: "Rundenpunkte",
    totalScore: "Gesamtpunkte",
    round: "Runde",
    combo: "Combo",
    timeLeft: "Restzeit",
    flyingLetters: "Aktive Buchstaben",
    target: "Ziel",
    effects: "Effekte",
    noEffects: "Keine",
    effectX2: "x2",
    effectFreeze: "Einfrieren",
    effectWall: "Mauer",
    effectSlow: "Zeitlupe",
    language: "Sprache",
    languageSetupTitle: "Sprache fur diese Runde auswahlen",
    roundDuration: "Rundendauer",
    rounds: "Runden",
    roundDurationOptionLabel: (seconds) =>
      ({ 60: "Kurz", 90: "Standard", 120: "Lang" })[seconds],
    speed: "Tempo",
    bounces: "Abpraller",
    speedOptionLabel: (value) => ({ 0.8: "Langsam", 1: "Normal", 1.25: "Schnell" })[value],
    difficulty: "Schwierigkeit",
    presetCasual: "Locker",
    presetStandard: "Standard",
    presetChaos: "Chaos",
    presetCustom: "Benutzerdefiniert",
    startRound: "Runde starten",
    menuButton: "Menü",
    menuTitle: "Spielmenü",
    options: "Optionen",
    lettersOnScreen: "Buchstaben",
    help: "Hilfe",
    pause: "Pause",
    resume: "Fortsetzen",
    nextRound: "Nächste Runde",
    matchComplete: "Match beendet",
    finalScore: "Endpunktzahl",
    playMatchAgain: "Match neu starten",
    newGame: "Neues Spiel",
    closeMenu: "Schließen",
    helpTitle: "Spielhilfe",
    helpHowToTitle: "Kurzanleitung",
    helpLineBuildWords: "Bilde Wörter durch Tippen auf fliegende Buchstaben.",
    helpLineTapLetters: "Jeder Stein prallt 3-mal ab und verlässt dann das Feld.",
    helpLineSubmitValid: "Reiche Wörter mit mindestens 4 Buchstaben ein.",
    helpLinePowerUps: "Tippe auf runde Power-ups, um Effekte zu aktivieren.",
    helpScoringTitle: "Punkte",
    helpLineBonusTiles: "DL/TL multiplizieren zuerst den Buchstabenwert; DW/TW multiplizieren das ganze Wort.",
    helpLineWordMultiplierStack: "Mehrere DW/TW-Felder stapeln sich (z. B. DW + DW = x4).",
    helpRoundsTitle: "Runden",
    helpLineRoundsGoal: "Jede Runde hat ein Punkteziel (45, 60, 75, ...).",
    helpLineRoundsEnd: "Wenn das Ziel bei Zeitablauf verfehlt wird, ist der Lauf vorbei.",
    helpPowerUpsTitle: "Power-ups",
    closeHelp: "Schließen",
    pausedStatus: "Spiel pausiert.",
    statusChecking: (word) => `Prüfe "${word}"...`,
    comboSuffix: (multiplier) => ` x${multiplier.toFixed(2)}`,
    statusRoundBonus: (completed, total, bonus) =>
      `Ziele erreicht ${completed}/${total}. Bonus +${bonus}.`,
    statusScoreRequired: (points) => `Erreiche ${points} Punkte in dieser Runde zum Weiterkommen.`,
    statusGreatWord: (word, points, suffix) => `Starkes Wort: ${word} (+${points})${suffix}`,
    goalScore: (points) => `Mindestens ${points} Punkte`,
    goalLongWords: (count, minLength) => `${count} Wörter mit ${minLength}+ Buchstaben`,
    goalPowerUps: (count) => `${count} Power-ups nutzen`,
    powerUpActivated: {
      bomb: "Bombe ausgelöst. Ein Buchstabe entfernt.",
      multiplier: "x2 aktiviert.",
      freeze: "Einfrieren aktiviert.",
      wall: "Mauer aktiviert.",
      slow: "Zeitlupe aktiviert.",
      "extra-time": "+10 Sekunden hinzugefügt.",
      "extra-time-15": "+15 Sekunden hinzugefügt."
    },
    powerUpHelp: {
      bomb: "Entfernt einen aktuellen fliegenden Buchstaben.",
      multiplier: "Verdoppelt aktive Buchstaben (Basis x2).",
      freeze: "Stoppt die Bewegung kurz.",
      wall: "Verhindert 15 Sekunden lang, dass Buchstaben das Feld verlassen.",
      slow: "Verlangsamt alle Bewegungen.",
      "extra-time": "Fügt 10 Sekunden hinzu.",
      "extra-time-15": "Fügt 15 Sekunden hinzu."
    }
  },
  fr: {
    title: "Word Constructor",
    initialStatus: "Touchez les lettres volantes pour former un mot.",
    timeUpStatus: "Le temps est écoulé. Recommencez puis soumettez.",
    bombRefreshComplete: "Rafraîchissement de la bombe terminé.",
    wordMin4: "Le mot doit contenir au moins 4 lettres.",
    trayInvalid: "La sélection actuelle n'est pas un mot valide.",
    noValidWord: "Aucun mot valide du dictionnaire pour ces lettres.",
    submitWord: "Valider",
    checking: "Vérification...",
    backspace: "Retour",
    clear: "Effacer",
    restartRound: "Relancer",
    playAgain: "Rejouer",
    acceptedWords: "Mots acceptés",
    goals: "Objectifs",
    required: "Requis",
    optional: "Optionnel",
    noneYet: "Aucun",
    trayPlaceholder: "Touchez des lettres pour former un mot",
    wordPoints: "Points du mot",
    roundScore: "Score manche",
    totalScore: "Score total",
    round: "Manche",
    combo: "Combo",
    timeLeft: "Temps restant",
    flyingLetters: "Lettres actives",
    target: "Cible",
    effects: "Effets",
    noEffects: "Aucun",
    effectX2: "x2",
    effectFreeze: "Gel",
    effectWall: "Mur",
    effectSlow: "Ralenti",
    language: "Langue",
    languageSetupTitle: "Choisissez la langue pour ce tour",
    roundDuration: "Duree du tour",
    rounds: "Manches",
    roundDurationOptionLabel: (seconds) =>
      ({ 60: "Rapide", 90: "Standard", 120: "Long" })[seconds],
    speed: "Vitesse",
    bounces: "Rebonds",
    speedOptionLabel: (value) => ({ 0.8: "Lent", 1: "Normal", 1.25: "Rapide" })[value],
    difficulty: "Difficulte",
    presetCasual: "Detente",
    presetStandard: "Standard",
    presetChaos: "Chaos",
    presetCustom: "Personnalise",
    startRound: "Demarrer le tour",
    menuButton: "Menu",
    menuTitle: "Menu du jeu",
    options: "Options",
    lettersOnScreen: "Lettres",
    help: "Aide",
    pause: "Pause",
    resume: "Reprendre",
    nextRound: "Manche suivante",
    matchComplete: "Match terminé",
    finalScore: "Score final",
    playMatchAgain: "Rejouer le match",
    newGame: "Nouveau jeu",
    closeMenu: "Fermer",
    helpTitle: "Aide du jeu",
    helpHowToTitle: "Instructions rapides",
    helpLineBuildWords: "Formez des mots en touchant les lettres volantes.",
    helpLineTapLetters: "Chaque tuile rebondit 3 fois puis sort.",
    helpLineSubmitValid: "Validez des mots d'au moins 4 lettres.",
    helpLinePowerUps: "Touchez les bonus ronds en mouvement pour activer les effets.",
    helpScoringTitle: "Score",
    helpLineBonusTiles: "DL/TL multiplient d'abord la lettre; DW/TW multiplient le mot entier.",
    helpLineWordMultiplierStack: "Plusieurs DW/TW se cumulent (par ex. DW + DW = x4).",
    helpRoundsTitle: "Manches",
    helpLineRoundsGoal: "Chaque manche a un objectif de score (45, 60, 75, ...).",
    helpLineRoundsEnd: "Si l'objectif n'est pas atteint à la fin du temps, la partie se termine.",
    helpPowerUpsTitle: "Bonus",
    closeHelp: "Fermer",
    pausedStatus: "Jeu en pause.",
    statusChecking: (word) => `Vérification de "${word}"...`,
    comboSuffix: (multiplier) => ` x${multiplier.toFixed(2)}`,
    statusRoundBonus: (completed, total, bonus) =>
      `Objectifs atteints ${completed}/${total}. Bonus +${bonus}.`,
    statusScoreRequired: (points) => `Atteins ${points} points ce round pour avancer.`,
    statusGreatWord: (word, points, suffix) => `Excellent mot : ${word} (+${points})${suffix}`,
    goalScore: (points) => `Atteindre ${points} points`,
    goalLongWords: (count, minLength) => `Faire ${count} mots de ${minLength}+ lettres`,
    goalPowerUps: (count) => `Utiliser ${count} bonus`,
    powerUpActivated: {
      bomb: "Bombe activée. Une lettre supprimée.",
      multiplier: "x2 activé.",
      freeze: "Gel activé.",
      wall: "Mur activé.",
      slow: "Ralenti activé.",
      "extra-time": "+10 secondes ajoutées.",
      "extra-time-15": "+15 secondes ajoutées."
    },
    powerUpHelp: {
      bomb: "Supprime une lettre volante actuelle.",
      multiplier: "Double les lettres actives (base x2).",
      freeze: "Fige brièvement les mouvements.",
      wall: "Empêche les lettres de sortir pendant 15 secondes.",
      slow: "Ralentit tous les mouvements.",
      "extra-time": "Ajoute 10 secondes.",
      "extra-time-15": "Ajoute 15 secondes."
    }
  },
  it: {
    title: "Word Constructor",
    initialStatus: "Tocca le lettere volanti per formare una parola.",
    timeUpStatus: "Tempo scaduto. Riavvia e invia di nuovo.",
    bombRefreshComplete: "Aggiornamento bomba completato.",
    wordMin4: "La parola deve avere almeno 4 lettere.",
    trayInvalid: "Il set corrente non è una parola valida.",
    noValidWord: "Nessuna parola valida del dizionario per queste lettere.",
    submitWord: "Invia",
    checking: "Controllo...",
    backspace: "Indietro",
    clear: "Cancella",
    restartRound: "Ricomincia",
    playAgain: "Gioca ancora",
    acceptedWords: "Parole accettate",
    goals: "Obiettivi",
    required: "Richiesto",
    optional: "Opzionale",
    noneYet: "Nessuna",
    trayPlaceholder: "Tocca le lettere per formare una parola",
    wordPoints: "Punti parola",
    roundScore: "Punteggio round",
    totalScore: "Punteggio totale",
    round: "Round",
    combo: "Combo",
    timeLeft: "Tempo rimasto",
    flyingLetters: "Lettere attive",
    target: "Obiettivo",
    effects: "Effetti",
    noEffects: "Nessuno",
    effectX2: "x2",
    effectFreeze: "Congelamento",
    effectWall: "Muro",
    effectSlow: "Rallentamento",
    language: "Lingua",
    languageSetupTitle: "Scegli la lingua per questo round",
    roundDuration: "Durata round",
    rounds: "Round",
    roundDurationOptionLabel: (seconds) =>
      ({ 60: "Veloce", 90: "Standard", 120: "Lungo" })[seconds],
    speed: "Velocita",
    bounces: "Rimbalzi",
    speedOptionLabel: (value) => ({ 0.8: "Lento", 1: "Normale", 1.25: "Veloce" })[value],
    difficulty: "Difficolta",
    presetCasual: "Facile",
    presetStandard: "Standard",
    presetChaos: "Caos",
    presetCustom: "Personalizzato",
    startRound: "Avvia round",
    menuButton: "Menu",
    menuTitle: "Menu gioco",
    options: "Opzioni",
    lettersOnScreen: "Lettere",
    help: "Aiuto",
    pause: "Pausa",
    resume: "Riprendi",
    nextRound: "Round successivo",
    matchComplete: "Partita conclusa",
    finalScore: "Punteggio finale",
    playMatchAgain: "Rigioca partita",
    newGame: "Nuova partita",
    closeMenu: "Chiudi",
    helpTitle: "Guida gioco",
    helpHowToTitle: "Istruzioni rapide",
    helpLineBuildWords: "Forma parole toccando le lettere volanti.",
    helpLineTapLetters: "Ogni tessera rimbalza 3 volte e poi esce.",
    helpLineSubmitValid: "Invia parole con almeno 4 lettere.",
    helpLinePowerUps: "Tocca i power-up rotondi in movimento per attivare gli effetti.",
    helpScoringTitle: "Punteggio",
    helpLineBonusTiles: "DL/TL moltiplicano prima la lettera; DW/TW moltiplicano l'intera parola.",
    helpLineWordMultiplierStack: "Più caselle DW/TW si combinano (es. DW + DW = x4).",
    helpRoundsTitle: "Round",
    helpLineRoundsGoal: "Ogni round ha un obiettivo punteggio (45, 60, 75, ...).",
    helpLineRoundsEnd: "Se non raggiungi l'obiettivo allo scadere del tempo, la partita finisce.",
    helpPowerUpsTitle: "Power-up",
    closeHelp: "Chiudi",
    pausedStatus: "Gioco in pausa.",
    statusChecking: (word) => `Controllo "${word}"...`,
    comboSuffix: (multiplier) => ` x${multiplier.toFixed(2)}`,
    statusRoundBonus: (completed, total, bonus) =>
      `Obiettivi completati ${completed}/${total}. Bonus +${bonus}.`,
    statusScoreRequired: (points) => `Raggiungi ${points} punti in questo round per avanzare.`,
    statusGreatWord: (word, points, suffix) => `Ottima parola: ${word} (+${points})${suffix}`,
    goalScore: (points) => `Raggiungi ${points} punti`,
    goalLongWords: (count, minLength) => `Fai ${count} parole da ${minLength}+ lettere`,
    goalPowerUps: (count) => `Usa ${count} power-up`,
    powerUpActivated: {
      bomb: "Bomba attivata. Una lettera rimossa.",
      multiplier: "x2 attivato.",
      freeze: "Congelamento attivato.",
      wall: "Muro attivato.",
      slow: "Rallentamento attivato.",
      "extra-time": "+10 secondi aggiunti.",
      "extra-time-15": "+15 secondi aggiunti."
    },
    powerUpHelp: {
      bomb: "Rimuove una lettera volante corrente.",
      multiplier: "Raddoppia le lettere attive (base x2).",
      freeze: "Blocca i movimenti per poco.",
      wall: "Impedisce alle lettere di uscire per 15 secondi.",
      slow: "Rallenta tutti i movimenti.",
      "extra-time": "Aggiunge 10 secondi.",
      "extra-time-15": "Aggiunge 15 secondi."
    }
  },
  ru: {
    title: "Word Constructor",
    initialStatus: "Нажимайте на летающие буквы, чтобы собрать слово.",
    timeUpStatus: "Время вышло. Перезапустите и отправьте снова.",
    bombRefreshComplete: "Обновление после бомбы завершено.",
    wordMin4: "Слово должно содержать минимум 4 буквы.",
    trayInvalid: "Текущий набор букв не образует валидное слово.",
    noValidWord: "Для этого набора нет валидного словарного слова.",
    submitWord: "Отправить",
    checking: "Проверка...",
    backspace: "Удалить",
    clear: "Очистить",
    restartRound: "Начать заново",
    playAgain: "Играть снова",
    acceptedWords: "Принятые слова",
    goals: "Цели",
    required: "Обязательно",
    optional: "Опционально",
    noneYet: "Пока нет",
    trayPlaceholder: "Нажимайте буквы, чтобы собрать слово",
    wordPoints: "Очки слова",
    roundScore: "Счёт раунда",
    totalScore: "Общий счёт",
    round: "Раунд",
    combo: "Комбо",
    timeLeft: "Осталось",
    flyingLetters: "Активные буквы",
    target: "Цель",
    effects: "Эффекты",
    noEffects: "Нет",
    effectX2: "x2",
    effectFreeze: "Заморозка",
    effectWall: "Стена",
    effectSlow: "Замедление",
    language: "Язык",
    languageSetupTitle: "Выберите язык для раунда",
    roundDuration: "Длительность раунда",
    rounds: "Раунды",
    roundDurationOptionLabel: (seconds) =>
      ({ 60: "Быстрый", 90: "Стандарт", 120: "Длинный" })[seconds],
    speed: "Скорость",
    bounces: "Отскоки",
    speedOptionLabel: (value) => ({ 0.8: "Медленно", 1: "Нормально", 1.25: "Быстро" })[value],
    difficulty: "Сложность",
    presetCasual: "Легко",
    presetStandard: "Стандарт",
    presetChaos: "Хаос",
    presetCustom: "Пользовательская",
    startRound: "Начать раунд",
    menuButton: "Меню",
    menuTitle: "Меню игры",
    options: "Опции",
    lettersOnScreen: "Буквы",
    help: "Помощь",
    pause: "Пауза",
    resume: "Продолжить",
    nextRound: "Следующий раунд",
    matchComplete: "Матч завершен",
    finalScore: "Итоговый счет",
    playMatchAgain: "Начать матч заново",
    newGame: "Новая игра",
    closeMenu: "Закрыть",
    helpTitle: "Справка",
    helpHowToTitle: "Краткие правила",
    helpLineBuildWords: "Собирайте слова, нажимая на летающие буквы.",
    helpLineTapLetters: "Каждая плитка отскакивает от стен 3 раза, затем уходит.",
    helpLineSubmitValid: "Отправляйте слова длиной не менее 4 букв.",
    helpLinePowerUps: "Нажимайте на круглые бонусы, чтобы активировать эффекты.",
    helpScoringTitle: "Подсчёт очков",
    helpLineBonusTiles: "DL/TL сначала умножают цену буквы; DW/TW умножают всё слово.",
    helpLineWordMultiplierStack: "Несколько DW/TW перемножаются (например, DW + DW = x4).",
    helpRoundsTitle: "Раунды",
    helpLineRoundsGoal: "В каждом раунде есть цель по очкам (45, 60, 75, ...).",
    helpLineRoundsEnd: "Если цель не достигнута к концу времени, забег заканчивается.",
    helpPowerUpsTitle: "Бонусы",
    closeHelp: "Закрыть",
    pausedStatus: "Игра на паузе.",
    statusChecking: (word) => `Проверка "${word}"...`,
    comboSuffix: (multiplier) => ` x${multiplier.toFixed(2)}`,
    statusRoundBonus: (completed, total, bonus) =>
      `Цели выполнены ${completed}/${total}. Бонус +${bonus}.`,
    statusScoreRequired: (points) => `Наберите ${points} очков в раунде, чтобы перейти дальше.`,
    statusGreatWord: (word, points, suffix) => `Отличное слово: ${word} (+${points})${suffix}`,
    goalScore: (points) => `Набрать минимум ${points} очков`,
    goalLongWords: (count, minLength) => `Собрать ${count} слов по ${minLength}+ букв`,
    goalPowerUps: (count) => `Использовать ${count} бонуса`,
    powerUpActivated: {
      bomb: "Бомба активирована. Одна буква удалена.",
      multiplier: "x2 активирован.",
      freeze: "Заморозка активирована.",
      wall: "Стена активирована.",
      slow: "Замедление активировано.",
      "extra-time": "+10 секунд добавлено.",
      "extra-time-15": "+15 секунд добавлено."
    },
    powerUpHelp: {
      bomb: "Удаляет одну текущую летающую букву.",
      multiplier: "Удваивает активные буквы (база x2).",
      freeze: "Временно останавливает движение.",
      wall: "Не даёт буквам покидать поле 15 секунд.",
      slow: "Замедляет все движения.",
      "extra-time": "Добавляет 10 секунд.",
      "extra-time-15": "Добавляет 15 секунд."
    }
  }
};

export function dictionaryLocale(language: LanguageCode): string {
  return language;
}
