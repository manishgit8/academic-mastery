
  # Academic Mastery Tracking System

  This is a code bundle for Academic Mastery Tracking System. The original project is available at https://www.figma.com/design/Jp8qfhX9oFQcL2jo3dvHQA/Academic-Mastery-Tracking-System.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## AI assistant (xAI / Grok)

  The Student Portal AI tab calls the backend at `POST /api/ai/student-assist`.

  1) Put your Grok key in `server/.env` as `XAI_API_KEY=...` (do not add it to the frontend)
  2) Start backend: `cd server` then `npm run dev`
  3) Start frontend: from project root `npm run dev`
  
