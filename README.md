# LLM Trivia Game :game_die:

Welcome to **LLM Trivia Game**, an exciting real-time trivia challenge that lets you test your knowledge across a range of categories. Compete against others, accumulate points with every correct response, and strive to dominate the leaderboard! What's more? The game utilizes the capabilities of LLM (currently GPT) to generate new questions whenever our database is running low.

## Features & Roadmap

### Current Features

- Real-time multiplayer trivia challenges.
- Dynamic question generation using LLM.
- Multiple categories and difficulties.
- Player leaderboard and scoring system.

### Planned Enhancements & Fixes

- [ ] **Player Profile Page:** Incorporate a Profile page displaying stats (with charts).
- [ ] **Game Handling:** Pause/stop game if host exits.
- [ ] **Game Handling:** Update `requiredPlayers` array when a new player joins an ongoing game.
- [ ] **Game Handling:** Table for questions with errors and a mechanism for reporting them.
- [ ] **Game Handling:** Introduce lifelines.
- [ ] **Game Handling:** Category: All.
- [ ] **Game Handling:** Fix timed questions.
- [ ] **Game Handling:** Feature for question streaks.
- [ ] **Game Handling:** Socket-based "polling from AI" indicator for enhanced feedback.
- [ ] **Game Handling:** User challenge feature.
- [ ] **Game Handling:** Mechanism to end/stop a game.
- [ ] **Content:** Content about the Author.
- [ ] **Content:** Information about the Game and its rules.
- [!] **Core:** Fix JSON issues without retrying the question-fetching process.
- [ ] **Visuals:** Resolve fade-in-out animations in the GamePage.
- [ ] **Visuals:** Intuitive game creation wizard.
- [!] **Core:** During inference, generate a hint for questions.
- [!] **Core:** Automatic script to correct questions based on reports.
- [!] **Extra:** Code refactoring and cleanup.
- [!] **Extra:** Deployment.

> **Note:** Features & fixes marked with ![!] are of higher priority.

## Technical Stack

- **Backend**: Python with Flask
- **Frontend**: React

## Database Schema

The game utilizes a robust database schema to manage questions, players, games, categories, translations, and much more. Please refer to the DB schema provided in the repository for a comprehensive overview.

## Setup & Installation

### Dependencies

- **Frontend**: Check the `package.json` file for a detailed list of frontend dependencies.
- **Backend**: Refer to the `requirements.txt` file for the necessary Python packages.

### Quick Start

#### Running Locally

For macOS and Linux:

1. Clone the repository:
```bash
git clone https://github.com/<your_username>/llm-trivia-game.git
cd llm-trivia-game
```

2. Utilize the Makefile for an easy setup:
```bash
make setup
```

This command streamlines the backend & frontend dependencies, database configuration, environment variable setup, and also constructs the frontend for development.

## Using Docker

If you have Docker installed, you can run the game using:

```
make build
make up
```

## Advanced Makefile Commands

For a more detailed setup and individual command execution, the Makefile provides a plethora of commands:

```
make install_all                  - Install both backend and frontend dependencies.
make setup                        - Full project setup (including installation, DB, and environment).
make start_backend_server         - Initiate the backend server.
make start_frontend_server_dev    - Launch the frontend server in development mode.
... [see the Makefile for a complete list of commands]
```

## Deployment

This project supports deployment to live servers. The deployment script and detailed instructions are currently under development (WIP).

## Contributing

1. Fork the repository.
2. Create your feature branch: `git checkout -b feature/AmazingFeature`.
3. Commit your changes: `git commit -m 'Add AmazingFeature'`.
4. Push to the branch: `git push origin feature/AmazingFeature`.
5. Open a pull request.

For a deeper insight into the game state management, review `gameReducer.js`. This file facilitates numerous actions to govern the game's state, from defining categories, toggling difficulty, handling player interactions, to administering the game's state and progression.

## License

This project is distributed under the MIT License.

## Author

Piotr Chrusciel

