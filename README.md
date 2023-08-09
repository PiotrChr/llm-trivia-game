# LLM Trivia Game :game_die:

Welcome to **LLM Trivia Game**, an exciting real-time trivia challenge that lets you test your wits across a variety of categories. Compete against others, earn points with each correct answer, and see if you can top the leaderboard!

This game taps into the power of LLM (currently GPT) to generate fresh questions whenever there's a shortage in our database.

## Technical Stack

- **Backend**: Python with Flask
- **Frontend**: React

## Setup & Installation

### Dependencies

- **Frontend**: Refer to the `package.json` for a comprehensive list of frontend dependencies.
- **Backend**: Check out the `requirements.txt` for required Python packages.

### Quick Start

1. Clone the repository:
```bash
git clone https://github.com/<your_username>/llm-trivia-game.git
cd llm-trivia-game
```

2. Use the Makefile for an effortless setup:
```bash
make setup
```

This command will take care of backend & frontend dependencies, database setup, environment variables, and even build the frontend for development.

For more granular control, you can use specific commands from the Makefile. Here's a breakdown:

```plaintext
make install_all                 - Install backend and frontend dependencies
make setup                       - Setup the project (incl. installation, DB, and env)
make start_backend_server        - Start the backend server
make start_frontend_server_dev   - Start the frontend server in dev mode
make start_frontend_server       - Start the frontend server in production mode
... [refer to the given Makefile for more commands]
```

## Contributing

1. Fork the repository.
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a pull request.

## Game Reducer

A peek into how the game state is managed can be found in `gameReducer.js`. It provides various actions to control the game's state, from setting categories, adjusting difficulty, handling player interactions, to managing the game's state and flow.

## License

This project is licensed under the MIT License.

## Author

Piotr Chrusciel

---

Challenge your trivia knowledge and enjoy the game! :tada: