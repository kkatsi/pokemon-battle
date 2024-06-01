# Pokémon Battle Simulator

Welcome to the Pokémon Battle Simulator! This project is a fun implementation of a Pokémon battle simulation using the public [PokeApi](https://pokeapi.co/). The simulation aims to include as many battle mechanics as possible, including Pokémon moves, animations, and side effects like paralysis, sleep, burn, freeze, and confusion.

## Live App

Check out the live app [here](https://pokemon-battle-react.netlify.app/).

## Features

- Simulates Pokémon battles with various moves and abilities.
- Pokémon moves are randomly generated through the move pool of each Pokémon.
- Implements generic move animations for physical, special, and status moves.
- Includes move side effects such as paralysis, sleep, burn, freeze, and confusion.
- Enemy Pokémon uses a basic Minimax algorithm logic for move selection.
- Aims to be as accurate as possible using the data from PokeApi.

## Technologies Used

- **React**: For building the user interface.
- **RTK Query**: For data fetching and state management.
- **TypeScript**: For type checking and enhancing code quality.
- **CSS**: For styling the app.
- **PokeApi**: The public API used for retrieving Pokémon data.

## Installation

To run this project locally, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/kkatsi/pokemon-battle.git
    cd pokemon-battle
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Start the development server:
    ```bash
    npm run dev
    ```

4. Open your browser and navigate to `http://localhost:5173`.

## Usage

1. Open the app.
2. Select your Pokémon and set up the battle.
3. Enjoy the simulation and experiment with different strategies!

---

This project is created for fun and educational purposes. It tries to implement as much battle mechanics as possible to provide an accurate and enjoyable Pokémon battle experience using the PokeApi.

Enjoy the simulation and happy battling!
