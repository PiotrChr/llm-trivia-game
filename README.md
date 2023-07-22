# LLM Trivia Game

LLM Trivia Game is a real-time trivia game that allows you to answer challenging questions in various categories. With each correct answer, you earn points and climb up the leaderboard!

## Setup and usage

### Prerequisites

- Node.js and npm
- Python 3
- pip

### Installation

To install the backend and frontend dependencies, use the following command:

```
make install_all
```

Alternatively, you can install them separately:

```
make install_backend
make install_frontend
```

### Database

To create the database tables, use:

```
make create_db
```

To clear the database tables, use:

```
make clear_db
```

### Building the project

To build the frontend for production, use:

```
make build_frontend
```

To build the frontend for development, use:

```
make build_frontend_dev
```

### Running the project

To start the backend server, use:

```
make start_backend_server
```

To start the frontend server in development mode, use:

```
make start_frontend_server_dev
```

To start the frontend server, use:

```
make start_frontend_server
```

### Help

To display the help message, use:

```
make help
```

The help command will print a list of available recipes:

```
Available recipes:
make install_all                 - install backend and frontend dependencies
make install_backend             - install backend dependencies
make install_frontend            - install frontend dependencies
make create_db                   - create database tables
make clear_db                    - clear database tables
.
.
.
```