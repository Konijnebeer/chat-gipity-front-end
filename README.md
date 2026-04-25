# Chat Gipity

Multi agent chat application for Programming 8, period 4, CMGT, 2025-2026

## Install instructions

1. Clone the repository
2. Run `pnpm install` in both the `front-end` and `back-end` directories
3. Copy the `.env.example` in the `back-end` directory to `.env` and fill in the required environment variables (e.g. OpenAI API key)
4. Start the back-end server by running `pnpm dev` in the `back-end` directory
5. Start the front-end development server by running `pnpm dev` in the `front-end` directory
6. Seed the database with initial agents by sending a post request to `http://localhost:8000/api/agent/seed`
7. Open your browser and navigate to `http://localhost:3000` to see the application in action

## Usage

- Start a chat from the index ping agents to make them interact with each other, you can later add more.
- Go to the agents tab to see all agents, click on an agent to see its details and edit its name, description, and personality. You can also Create new agents manually or with the agent maker who will flesh out the agent based on a prompt you give it.
- Go to the chats tab to see all chats, click on a chat to see the messages and the agents involved in the chat in the header.
