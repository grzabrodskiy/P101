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
  noneYet: string;
  trayPlaceholder: string;
  wordPoints: string;
  totalScore: string;
  round: string;
  timeLeft: string;
  flyingLetters: string;
  target: string;
  effects: string;
  noEffects: string;
  effectX2: string;
  effectFreeze: string;
  effectShield: string;
  effectSlow: string;
  effectMagnet: string;
  effectDoubleWord: string;
  effectLock: string;
  language: string;
  languageSetupTitle: string;
  roundDuration: string;
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
  helpPowerUpsTitle: string;
  closeHelp: string;
  pausedStatus: string;
  statusChecking: (word: string) => string;
  statusGreatWord: (word: string, points: number, suffix: string) => string;
  goalScore: (points: number) => string;
  goalLongWords: (count: number, minLength: number) => string;
  goalPowerUps: (count: number) => string;
  powerUpActivated: Record<PowerUpKind, string>;
  powerUpHelp: Record<PowerUpKind, string>;
};

export const UI_TEXT: Record<LanguageCode, Translations> = {
  en: {
    title: "Scrabble Bounce",
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
    goals: "Round Goals",
    noneYet: "None yet",
    trayPlaceholder: "Tap letters to build a word",
    wordPoints: "Word Points",
    totalScore: "Total Score",
    round: "Round",
    timeLeft: "Time Left",
    flyingLetters: "Flying Letters",
    target: "Target",
    effects: "Effects",
    noEffects: "None",
    effectX2: "x2",
    effectFreeze: "Freeze",
    effectShield: "Shield",
    effectSlow: "Slow",
    effectMagnet: "Magnet",
    effectDoubleWord: "Double Word",
    effectLock: "Lock",
    language: "Language",
    languageSetupTitle: "Choose language for this round",
    roundDuration: "Round Duration",
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
    helpPowerUpsTitle: "Power-Ups",
    closeHelp: "Close",
    pausedStatus: "Game paused.",
    statusChecking: (word) => `Checking "${word}"...`,
    statusGreatWord: (word, points, suffix) => `Great word: ${word} (+${points})${suffix}`,
    goalScore: (points) => `Score at least ${points}`,
    goalLongWords: (count, minLength) => `Make ${count} words of ${minLength}+ letters`,
    goalPowerUps: (count) => `Use ${count} power-ups`,
    powerUpActivated: {
      bomb: "Bomb triggered. Refreshing letters...",
      multiplier: "x2 activated.",
      freeze: "Freeze activated.",
      shield: "Shield activated.",
      wild: "Wildcard added to tray.",
      reroll: "Rerolled low-value letters.",
      slow: "Slow Time activated.",
      double: "Double Word ready for next valid submit.",
      magnet: "Magnet activated.",
      "extra-time": "+10 seconds added.",
      lock: "Lock charge added to next collected letter.",
      purge: "Purged rare letters."
    },
    powerUpHelp: {
      bomb: "Explodes all letters and refreshes the board.",
      multiplier: "Doubles active letters to 16.",
      freeze: "Freezes movement briefly.",
      shield: "Protects tray from backspace/clear.",
      wild: "Adds wildcard tile to tray.",
      reroll: "Rerolls low-value letters.",
      slow: "Slows all movement.",
      double: "Next valid word gets double points.",
      magnet: "Letters drift toward pointer.",
      "extra-time": "Adds 10 seconds.",
      lock: "Next collected letter is locked in tray.",
      purge: "Replaces high-value rare letters."
    }
  },
  de: {
    title: "Scrabble Bounce",
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
    goals: "Rundenziele",
    noneYet: "Noch keine",
    trayPlaceholder: "Tippe Buchstaben, um ein Wort zu bilden",
    wordPoints: "Wortpunkte",
    totalScore: "Gesamtpunkte",
    round: "Runde",
    timeLeft: "Restzeit",
    flyingLetters: "Fliegende Buchstaben",
    target: "Ziel",
    effects: "Effekte",
    noEffects: "Keine",
    effectX2: "x2",
    effectFreeze: "Einfrieren",
    effectShield: "Schild",
    effectSlow: "Zeitlupe",
    effectMagnet: "Magnet",
    effectDoubleWord: "Doppelwort",
    effectLock: "Sperre",
    language: "Sprache",
    languageSetupTitle: "Sprache fur diese Runde auswahlen",
    roundDuration: "Rundendauer",
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
    helpPowerUpsTitle: "Power-ups",
    closeHelp: "Schließen",
    pausedStatus: "Spiel pausiert.",
    statusChecking: (word) => `Prüfe "${word}"...`,
    statusGreatWord: (word, points, suffix) => `Starkes Wort: ${word} (+${points})${suffix}`,
    goalScore: (points) => `Mindestens ${points} Punkte`,
    goalLongWords: (count, minLength) => `${count} Wörter mit ${minLength}+ Buchstaben`,
    goalPowerUps: (count) => `${count} Power-ups nutzen`,
    powerUpActivated: {
      bomb: "Bombe ausgelöst. Buchstaben werden aktualisiert...",
      multiplier: "x2 aktiviert.",
      freeze: "Einfrieren aktiviert.",
      shield: "Schild aktiviert.",
      wild: "Joker zur Ablage hinzugefügt.",
      reroll: "Niedrige Buchstaben neu gewürfelt.",
      slow: "Zeitlupe aktiviert.",
      double: "Doppelwort für die nächste gültige Einreichung bereit.",
      magnet: "Magnet aktiviert.",
      "extra-time": "+10 Sekunden hinzugefügt.",
      lock: "Sperr-Ladung für den nächsten Buchstaben hinzugefügt.",
      purge: "Seltene Buchstaben entfernt."
    },
    powerUpHelp: {
      bomb: "Lässt alle Buchstaben explodieren und erneuert das Feld.",
      multiplier: "Verdoppelt aktive Buchstaben auf 16.",
      freeze: "Stoppt die Bewegung kurz.",
      shield: "Schützt die Ablage vor Löschen.",
      wild: "Fügt einen Joker zur Ablage hinzu.",
      reroll: "Würfelt Niedrigwert-Buchstaben neu.",
      slow: "Verlangsamt alle Bewegungen.",
      double: "Nächstes gültiges Wort zählt doppelt.",
      magnet: "Buchstaben bewegen sich zum Zeiger.",
      "extra-time": "Fügt 10 Sekunden hinzu.",
      lock: "Nächster gesammelter Buchstabe wird gesperrt.",
      purge: "Ersetzt seltene Hochwert-Buchstaben."
    }
  },
  fr: {
    title: "Scrabble Bounce",
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
    goals: "Objectifs du round",
    noneYet: "Aucun",
    trayPlaceholder: "Touchez des lettres pour former un mot",
    wordPoints: "Points du mot",
    totalScore: "Score total",
    round: "Manche",
    timeLeft: "Temps restant",
    flyingLetters: "Lettres volantes",
    target: "Cible",
    effects: "Effets",
    noEffects: "Aucun",
    effectX2: "x2",
    effectFreeze: "Gel",
    effectShield: "Bouclier",
    effectSlow: "Ralenti",
    effectMagnet: "Aimant",
    effectDoubleWord: "Mot double",
    effectLock: "Verrou",
    language: "Langue",
    languageSetupTitle: "Choisissez la langue pour ce tour",
    roundDuration: "Duree du tour",
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
    helpPowerUpsTitle: "Bonus",
    closeHelp: "Fermer",
    pausedStatus: "Jeu en pause.",
    statusChecking: (word) => `Vérification de "${word}"...`,
    statusGreatWord: (word, points, suffix) => `Excellent mot : ${word} (+${points})${suffix}`,
    goalScore: (points) => `Atteindre ${points} points`,
    goalLongWords: (count, minLength) => `Faire ${count} mots de ${minLength}+ lettres`,
    goalPowerUps: (count) => `Utiliser ${count} bonus`,
    powerUpActivated: {
      bomb: "Bombe activée. Rafraîchissement des lettres...",
      multiplier: "x2 activé.",
      freeze: "Gel activé.",
      shield: "Bouclier activé.",
      wild: "Joker ajouté au plateau.",
      reroll: "Lettres faibles relancées.",
      slow: "Ralenti activé.",
      double: "Mot double prêt pour la prochaine validation.",
      magnet: "Aimant activé.",
      "extra-time": "+10 secondes ajoutées.",
      lock: "Charge de verrou ajoutée pour la prochaine lettre.",
      purge: "Lettres rares purgées."
    },
    powerUpHelp: {
      bomb: "Fait exploser toutes les lettres et rafraîchit le plateau.",
      multiplier: "Double les lettres actives à 16.",
      freeze: "Fige brièvement les mouvements.",
      shield: "Protège le plateau de retour/effacer.",
      wild: "Ajoute un joker au plateau.",
      reroll: "Relance les lettres de faible valeur.",
      slow: "Ralentit tous les mouvements.",
      double: "Le prochain mot valide vaut le double.",
      magnet: "Les lettres dérivent vers le pointeur.",
      "extra-time": "Ajoute 10 secondes.",
      lock: "La prochaine lettre collectée est verrouillée.",
      purge: "Remplace les lettres rares de forte valeur."
    }
  },
  it: {
    title: "Scrabble Bounce",
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
    goals: "Obiettivi round",
    noneYet: "Nessuna",
    trayPlaceholder: "Tocca le lettere per formare una parola",
    wordPoints: "Punti parola",
    totalScore: "Punteggio totale",
    round: "Round",
    timeLeft: "Tempo rimasto",
    flyingLetters: "Lettere volanti",
    target: "Obiettivo",
    effects: "Effetti",
    noEffects: "Nessuno",
    effectX2: "x2",
    effectFreeze: "Congelamento",
    effectShield: "Scudo",
    effectSlow: "Rallentamento",
    effectMagnet: "Magnete",
    effectDoubleWord: "Parola doppia",
    effectLock: "Blocco",
    language: "Lingua",
    languageSetupTitle: "Scegli la lingua per questo round",
    roundDuration: "Durata round",
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
    helpPowerUpsTitle: "Power-up",
    closeHelp: "Chiudi",
    pausedStatus: "Gioco in pausa.",
    statusChecking: (word) => `Controllo "${word}"...`,
    statusGreatWord: (word, points, suffix) => `Ottima parola: ${word} (+${points})${suffix}`,
    goalScore: (points) => `Raggiungi ${points} punti`,
    goalLongWords: (count, minLength) => `Fai ${count} parole da ${minLength}+ lettere`,
    goalPowerUps: (count) => `Usa ${count} power-up`,
    powerUpActivated: {
      bomb: "Bomba attivata. Aggiornamento lettere...",
      multiplier: "x2 attivato.",
      freeze: "Congelamento attivato.",
      shield: "Scudo attivato.",
      wild: "Jolly aggiunto al vassoio.",
      reroll: "Lettere a basso valore rilanciate.",
      slow: "Rallentamento attivato.",
      double: "Parola doppia pronta per il prossimo invio valido.",
      magnet: "Magnete attivato.",
      "extra-time": "+10 secondi aggiunti.",
      lock: "Carica blocco aggiunta alla prossima lettera.",
      purge: "Lettere rare eliminate."
    },
    powerUpHelp: {
      bomb: "Fa esplodere tutte le lettere e aggiorna il campo.",
      multiplier: "Raddoppia le lettere attive a 16.",
      freeze: "Blocca i movimenti per poco.",
      shield: "Protegge il vassoio da indietro/cancella.",
      wild: "Aggiunge un jolly al vassoio.",
      reroll: "Rimescola lettere a basso valore.",
      slow: "Rallenta tutti i movimenti.",
      double: "La prossima parola valida vale doppio.",
      magnet: "Le lettere si avvicinano al puntatore.",
      "extra-time": "Aggiunge 10 secondi.",
      lock: "La prossima lettera raccolta viene bloccata.",
      purge: "Sostituisce lettere rare di alto valore."
    }
  },
  ru: {
    title: "Scrabble Bounce",
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
    goals: "Цели раунда",
    noneYet: "Пока нет",
    trayPlaceholder: "Нажимайте буквы, чтобы собрать слово",
    wordPoints: "Очки слова",
    totalScore: "Общий счёт",
    round: "Раунд",
    timeLeft: "Осталось",
    flyingLetters: "Летающие буквы",
    target: "Цель",
    effects: "Эффекты",
    noEffects: "Нет",
    effectX2: "x2",
    effectFreeze: "Заморозка",
    effectShield: "Щит",
    effectSlow: "Замедление",
    effectMagnet: "Магнит",
    effectDoubleWord: "Двойное слово",
    effectLock: "Блок",
    language: "Язык",
    languageSetupTitle: "Выберите язык для раунда",
    roundDuration: "Длительность раунда",
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
    helpPowerUpsTitle: "Бонусы",
    closeHelp: "Закрыть",
    pausedStatus: "Игра на паузе.",
    statusChecking: (word) => `Проверка "${word}"...`,
    statusGreatWord: (word, points, suffix) => `Отличное слово: ${word} (+${points})${suffix}`,
    goalScore: (points) => `Набрать минимум ${points} очков`,
    goalLongWords: (count, minLength) => `Собрать ${count} слов по ${minLength}+ букв`,
    goalPowerUps: (count) => `Использовать ${count} бонуса`,
    powerUpActivated: {
      bomb: "Бомба активирована. Обновляем буквы...",
      multiplier: "x2 активирован.",
      freeze: "Заморозка активирована.",
      shield: "Щит активирован.",
      wild: "Джокер добавлен в лоток.",
      reroll: "Буквы низкой ценности перемешаны.",
      slow: "Замедление активировано.",
      double: "Двойное слово готово для следующей валидной отправки.",
      magnet: "Магнит активирован.",
      "extra-time": "+10 секунд добавлено.",
      lock: "Заряд блокировки добавлен для следующей буквы.",
      purge: "Редкие буквы удалены."
    },
    powerUpHelp: {
      bomb: "Взрывает все буквы и обновляет поле.",
      multiplier: "Удваивает активные буквы до 16.",
      freeze: "Временно останавливает движение.",
      shield: "Защищает лоток от удаления и очистки.",
      wild: "Добавляет джокер в лоток.",
      reroll: "Перезапускает буквы с низкой ценностью.",
      slow: "Замедляет все движения.",
      double: "Следующее валидное слово даст двойные очки.",
      magnet: "Буквы тянутся к указателю.",
      "extra-time": "Добавляет 10 секунд.",
      lock: "Следующая собранная буква будет заблокирована.",
      purge: "Заменяет редкие дорогие буквы."
    }
  }
};

export function dictionaryLocale(language: LanguageCode): string {
  return language;
}
