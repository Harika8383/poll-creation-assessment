import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPollSchema, voteSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/polls", async (_req, res) => {
    const polls = await storage.getPolls();
    res.json(polls);
  });

  app.get("/api/polls/:id", async (req, res) => {
    const poll = await storage.getPoll(Number(req.params.id));
    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }
    res.json(poll);
  });

  app.post("/api/polls", async (req, res) => {
    const result = insertPollSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: result.error.message });
    }
    const poll = await storage.createPoll(result.data);
    res.json(poll);
  });

  app.get("/api/polls/:id/votes", async (req, res) => {
    const votes = await storage.getPollVotes(Number(req.params.id));
    res.json(votes);
  });

  app.post("/api/polls/:id/vote", async (req, res) => {
    const result = voteSchema.safeParse({
      pollId: Number(req.params.id),
      optionIndex: req.body.optionIndex,
    });
    if (!result.success) {
      return res.status(400).json({ message: result.error.message });
    }
    const vote = await storage.addVote(result.data);
    res.json(vote);
  });

  const httpServer = createServer(app);
  return httpServer;
}
