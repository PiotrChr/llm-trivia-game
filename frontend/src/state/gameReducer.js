import { produce } from 'immer';

const initialState = {
  category: {
    id: 0,
    name: 'None'
  },
  difficulty: 1,
  question: null,
  players: [],
  requiredPlayers: [],
  allReady: false,
  allPresent: false,
  allAnswered: false,
  answerMissed: false,
  questionReady: false,
  gameMode: null,
  lifelines: [
    {
      count: 1,
      id: 1,
      name: 'fiftyFifty'
    }
  ],
  languages: [],
  pause: false,
  language: {
    iso_code: 'en',
    name: 'English'
  },
  isTimed: false,
  timeElapsed: 0,
  timeLimit: 0,
  timer: null,
  autoStart: false,
  isHost: false,
  drawing: false,
  game: null,
  gameStarted: false,
  countdown: 0,
  answers: [],
  selectedAnswerId: null,
  currentBackground: null,
  messages: []
};

const gameReducer = produce((draft, action) => {
  switch (action.type) {
    case 'SET_CATEGORY':
      draft.category = action.payload;
      break;

    case 'SET_DIFFICULTY':
      draft.difficulty = action.payload;
      break;

    case 'SET_QUESTION':
      draft.question = action.payload;
      break;

    case 'ADD_PLAYER': {
      const playerExists = draft.players.some(
        (player) => player.id === action.payload.player.id
      );
      if (!playerExists) {
        draft.players.push({
          ...action.payload.player,
          points: action.payload.player_points || 0,
          ready: false,
          answer: null,
          miss: false
        });
      }

      draft.allPresent = draft.players.length === draft.requiredPlayers.length;
      break;
    }

    case 'REMOVE_PLAYER':
      draft.players = draft.players.filter(
        (player) => player.id !== action.payload.id
      );

      draft.allPresent = false;
      break;

    case 'SET_REQUIRED_PLAYERS':
      draft.requiredPlayers = action.payload;
      break;

    case 'ADD_REQUIRED_PLAYER':
      if (!draft.requiredPlayers.includes(action.payload)) {
        draft.requiredPlayers.push(action.payload);
      }
      break;

    case 'SET_PAUSE':
      draft.pause = action.payload;
      break;

    case 'SET_AUTO_START':
      draft.autoStart = action.payload;
      break;

    case 'SET_ALL_READY':
      draft.allReady = action.payload;
      break;

    case 'SET_ALL_ANSWERED':
      draft.allAnswered = action.payload;
      break;

    case 'SET_QUESTION_READY':
      draft.questionReady = true;
      break;

    case 'SET_LANGUAGES':
      draft.languages = action.payload;
      break;

    case 'SET_GAME_MODE':
      draft.gameMode = action.payload;
      break;

    case 'SET_LANGUAGE':
      draft.language = action.payload;
      break;

    case 'REMOVE_N_WRONG_QUESTION_ANSWERS': {
      const correctAnswer = draft.answers.find(
        (answer) => answer.is_correct === 1
      );
      const wrongAnswers = draft.answers.filter(
        (answer) => answer.is_correct === 0
      );

      // Randomly pick 'n' wrong answers
      let newAnswers = [];
      for (let i = 0; i < Math.min(action.payload, wrongAnswers.length); i++) {
        let randomIndex = Math.floor(Math.random() * wrongAnswers.length);
        wrongAnswers.splice(randomIndex, 1);
      }

      newAnswers.push(correctAnswer);
      newAnswers.push(...wrongAnswers);

      newAnswers = newAnswers.sort(() => Math.random() - 0.5);

      draft.answers = newAnswers;
      break;
    }

    case 'SET_PLAYER_READY':
      draft.players.forEach((player) => {
        if (player.id === action.payload) {
          player.ready = true;
        }
      });
      draft.allReady = draft.players.every((player) => player.ready);
      break;

    case 'SET_PLAYER_ANSWER':
      draft.players.forEach((player) => {
        if (player.id === action.payload.player.id) {
          player.answer = action.payload.answer_id;
        }
      });
      draft.allAnswered = draft.players.every(
        (player) => player.answer || player.miss
      );
      break;

    case 'SET_PLAYER_SCORE':
      action.payload.forEach((winner) => {
        const player = draft.players.find((p) => p.id === winner.id);
        if (player) {
          player.points += 1;
        }
      });
      break;

    case 'SET_IS_TIMED':
      draft.isTimed = action.payload;
      break;

    case 'SET_TIME_ELAPSED':
      draft.timeElapsed = action.payload;
      break;

    case 'SET_LIFELINES':
      draft.lifelines = action.payload;
      break;

    case 'USE_LIFELINE':
      draft.lifelines = draft.lifelines.map((lifeline) => {
        if (lifeline.name === action.payload) {
          lifeline.count -= 1;
        }
        return lifeline;
      });
      break;

    case 'SET_TIME_LIMIT':
      draft.timeLimit = action.payload;
      break;

    case 'SET_TIMER':
      draft.timer = action.payload;
      break;

    case 'DECREMENT_TIMER':
      draft.timer -= 1;
      break;

    case 'SET_IS_HOST':
      draft.isHost = action.payload;
      break;

    case 'SET_DRAWING':
      draft.drawing = action.payload;
      break;

    case 'SET_GAME':
      draft.game = action.payload;
      break;

    case 'START_GAME':
      draft.gameStarted = true;
      break;

    case 'STOP_GAME':
      draft.gameStarted = false;
      break;

    case 'SET_GAME_OVER':
      draft.gameOver = true;
      break;

    case 'SET_COUNTDOWN':
      draft.countdown = action.payload;
      break;

    case 'SET_ANSWERS':
      draft.answers = action.payload;
      break;

    case 'SELECT_ANSWER':
      draft.selectedAnswerId = action.payload;
      break;

    case 'MISS_ANSWER':
      draft.selectedAnswerId = 'miss';
      draft.players.forEach((player) => {
        if (player.id === action.payload) {
          player.answer = null;
          player.miss = true;
        }
      });
      draft.allAnswered = draft.players.every(
        (player) => player.answer || player.miss
      );
      break;

    case 'SET_CURRENT_BACKGROUND':
      draft.currentBackground = action.payload;
      break;

    case 'ADD_MESSAGE':
      if (draft.messages.length < 10) {
        draft.messages.push(action.payload);
      } else {
        draft.messages = [...draft.messages.slice(1), action.payload];
      }
      break;

    case 'RESET_ROUND':
      draft.allAnswered = false;
      draft.questionReady = false;
      draft.timeElapsed = 0;
      draft.answers = [];
      draft.timer = null;
      draft.selectedAnswerId = null;
      draft.players.forEach((player) => {
        player.answer = null;
        player.miss = false;
      });
      break;

    default:
      break;
  }
}, initialState);

export { gameReducer, initialState };
