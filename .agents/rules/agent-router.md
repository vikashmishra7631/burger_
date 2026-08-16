# 🤖 Agent Roles & Delegation Router

This workspace is configured with two specialized agent roles:

## 1. 🎨 Frontend Agent
- **Focus:** User interface, responsive design, React components, animations, styles, and client state.
- **Root Directory:** `src/`
- **When to invoke:** Creating new pages, adjusting layouts, styling with Tailwind, adding Framer Motion animations, client form validation, and connecting UI to backend APIs.

## 2. ⚙️ Backend Agent
- **Focus:** Server endpoints, database queries, authentication (JWT/bcrypt), route security, rate limiting, and business logic.
- **Root Directory:** `server/`
- **When to invoke:** Adding new API endpoints, modifying database schema/JSON data, handling authentication/sessions, payment processing, and backend validation.

## 🔄 How to Invoke in Chat
- You can specify the agent directly in your prompt:
  - *"Frontend Agent: [your UI task]"*
  - *"Backend Agent: [your API/DB task]"*
  - Or ask for full-stack collaboration: *"Both: Build user wishlist feature end-to-end (backend API + frontend UI)"*
