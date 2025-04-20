import "dotenv/config";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import { clerkMiddleware } from '@clerk/express'

import tutor_router from "./routes/tutors";
import tutee_router from "./routes/tutees";
import approved_matches_router from "./routes/approvedMatches";
import match_suggestions_router from "./routes/matchSuggestions";
import form_router from "./routes/form";
import user_router from "./routes/users";
import elist_router from "./routes/mailingList"

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());
app.use(
  tutor_router,
  tutee_router,
  approved_matches_router,
  match_suggestions_router,
  form_router,
  user_router,
  elist_router,
);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

// Only start the server when running locally, not in production/Vercel
if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

// Export the Express app for serverless use
export default app;
