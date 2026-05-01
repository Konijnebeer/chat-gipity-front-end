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
- See all tools available on the Tools page and add them to agents, on the agent edit page.
- See all skills and add new Skill on the skills tab, you can then add these skills to agents on the agent edit page as well.

## Features

### Persistent Memory
Agents store and retrieve memories using a **FAISS vector store**. When an agent saves a memory, it is embedded and indexed so that relevant information can be retrieved later through semantic similarity search, meaning the agent finds the *most relevant* memories for the current context, not just exact matches.

### Chat History via RAG
Agents can search through previous conversations using **Retrieval-Augmented Generation (RAG)**, also backed by a FAISS store. Rather than loading the full chat history into context.

### Skills
Agents can be extended with **skills** - markdown-defined capabilities that provide extra instructions and examples, allowing agents to be tailored for specific tasks or domains.

## Tools

### General Information

| Tool | Description |
|------|-------------|
| `search` | Search for information using the Brave AI search engine. |
| `search_chat_history` | Query the agent's chat history via RAG to retrieve relevant past messages. |
| `get_definition` | Look up word definitions, including pronunciation, meanings, and examples. |
| `get_current_date_time` | Get the current date and time. |

### Agent Management

| Tool | Description |
|------|-------------|
| `create_agent` | Create a new agent with specified properties. |
| `delete_agent` | Remove an existing agent. |
| `save_memory` | Store information in the agent's FAISS memory store. |
| `read_memory` | Retrieve relevant information from the agent's FAISS memory store. |

### Skills

| Tool | Description |
|------|-------------|
| `get_skill_info` | Retrieve skill documentation when an agent has skills configured. |

### Extras & Fun

| Tool | Description |
|------|-------------|
| `get_weather` | Get current weather for a specified city. *(dummy data)* |
| `get_random_cat_with_description` | Retrieve a random cat photo with a custom description. |
| `get_apod` | Fetch NASA's Astronomy Picture of the Day. |
| `search_documentation` | Search through technical documentation. |