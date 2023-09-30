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
  languages: [],
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

const gameReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_CATEGORY':
      return { ...state, category: action.payload };

    case 'SET_DIFFICULTY':
      return { ...state, difficulty: action.payload };

    case 'SET_QUESTION':
      return { ...state, question: action.payload };

    case 'ADD_PLAYER':
      if (
        state.players.some((player) => player.id === action.payload.player.id)
      ) {
        state = {
          ...state,
          players: state.players.map((player) => {
            if (player.id === action.payload.player.id) {
              return {
                ...player,
                points: action.payload.player_points,
                ready: false,
                answer: null
              };
            }
            return player;
          })
        };
      } else {
        state = {
          ...state,
          players: [
            ...state.players,
            {
              id: action.payload.player.id,
              name: action.payload.player.name,
              points: action.payload.player_points,
              ready: false,
              answer: null
            }
          ]
        };
      }

      state = {
        ...state,
        allPresent: state.requiredPlayers.every((player) =>
          state.players.some((p) => p.id === player)
        )
      };

      return state;

    case 'REMOVE_PLAYER':
      state = {
        ...state,
        players: state.players
          .filter((player) => player.id !== action.payload.id)
          .map((player) => {
            return { ...player, answer: null };
          })
      };

      state = {
        ...state,
        allPresent: state.requiredPlayers.every((player) =>
          state.players.some((p) => p.id === player)
        ),
        allReady: false,
        allAnswered: false,
        questionReady: false,
        gameStarted: false,
        timeElapsed: 0,
        selectedAnswerId: null
      };

      return state;

    case 'SET_REQUIRED_PLAYERS':
      return { ...state, requiredPlayers: action.payload };

    case 'ADD_REQUIRED_PLAYER':
      if (!state.requiredPlayers.includes(action.payload)) {
        return {
          ...state,
          requiredPlayers: [...state.requiredPlayers, action.payload]
        };
      }
      return state;

    case 'SET_AUTO_START':
      return { ...state, autoStart: action.payload };

    case 'SET_ALL_READY':
      return { ...state, allReady: action.payload };

    case 'SET_ALL_ANSWERED':
      return { ...state, allAnswered: action.payload };

    case 'SET_QUESTION_READY':
      return { ...state, questionReady: true };

    case 'SET_LANGUAGES':
      return { ...state, languages: action.payload };

    case 'SET_LANGUAGE':
      return {
        ...state,
        language: action.payload
      };

    case 'SET_PLAYER_READY':
      state = {
        ...state,
        players: state.players.map((player) => {
          if (player.id === action.payload) {
            return { ...player, ready: true };
          }
          return player;
        })
      };

      return {
        ...state,
        allReady: state.players.every((player) => player.ready)
      };

    case 'SET_PLAYER_ANSWER':
      state = {
        ...state,
        players: state.players.map((player) => {
          if (player.id === action.payload.player.id) {
            return { ...player, answer: action.payload.answer_id };
          }
          return player;
        })
      };

      return {
        ...state,
        allAnswered: state.players.every(
          (player) => player.answer || player.miss
        )
      };

    case 'SET_PLAYER_SCORE':
      return {
        ...state,
        players: state.players.map((player) => {
          if (action.payload.some((winner) => winner.id === player.id)) {
            return { ...player, points: player.points + 1 };
          }
          return player;
        })
      };

    case 'SET_IS_TIMED':
      return { ...state, isTimed: action.payload };

    case 'SET_TIME_ELAPSED':
      return { ...state, timeElapsed: action.payload };

    case 'SET_TIME_LIMIT':
      return { ...state, timeLimit: action.payload };

    case 'DECREMENT_TIMER':
      return { ...state, timer: state.timer - 1 };

    case 'SET_IS_HOST':
      return { ...state, isHost: action.payload };

    case 'SET_DRAWING':
      return { ...state, drawing: action.payload };

    case 'SET_GAME':
      return { ...state, game: action.payload };

    case 'START_GAME':
      return { ...state, gameStarted: true };

    case 'STOP_GAME':
      return { ...state, gameStarted: false };

    case 'SET_COUNTDOWN':
      return {
        ...state,
        countdown: {
          remaining_time: action.payload.remaining_time,
          total_time: action.payload.total_time
        }
      };

    case 'SET_ANSWERS':
      return { ...state, answers: action.payload };

    case 'SELECT_ANSWER':
      return { ...state, selectedAnswerId: action.payload };

    case 'MISS_ANSWER':
      return {
        ...state,
        players: state.players.map((player) => {
          if (player.id === action.payload) {
            return { ...player, answer: null, miss: true };
          }
          return player;
        })
      };

    case 'SET_CURRENT_BACKGROUND':
      return { ...state, currentBackground: action.payload };

    case 'ADD_MESSAGE':
      if (state.messages.length < 10) {
        return { ...state, messages: [...state.messages, action.payload] };
      }
      return {
        ...state,
        messages: [...state.messages.slice(1), action.payload]
      };

    case 'RESET_ROUND':
      return {
        ...state,
        allAnswered: false,
        questionReady: false,
        timeElapsed: 0,
        answers: [],
        selectedAnswerId: null,
        players: state.players.map((player) => {
          return { ...player, answer: null };
        })
      };

    default:
      return state;
  }
};

export { initialState, gameReducer };
