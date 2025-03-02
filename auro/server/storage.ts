import { type Poll, type InsertPoll, type Vote, type InsertVote } from "@shared/schema";

export interface IStorage {
  createPoll(poll: InsertPoll): Promise<Poll>;
  getPoll(id: number): Promise<Poll | undefined>;
  getPolls(): Promise<Poll[]>;
  addVote(vote: InsertVote): Promise<Vote>;
  getPollVotes(pollId: number): Promise<Vote[]>;
}

export class MemStorage implements IStorage {
  private polls: Map<number, Poll>;
  private votes: Map<number, Vote>;
  private pollId: number;
  private voteId: number;

  constructor() {
    this.polls = new Map();
    this.votes = new Map();
    this.pollId = 1;
    this.voteId = 1;
  }

  async createPoll(insertPoll: InsertPoll): Promise<Poll> {
    const id = this.pollId++;
    const poll: Poll = { ...insertPoll, id };
    this.polls.set(id, poll);
    return poll;
  }

  async getPoll(id: number): Promise<Poll | undefined> {
    return this.polls.get(id);
  }

  async getPolls(): Promise<Poll[]> {
    return Array.from(this.polls.values());
  }

  async addVote(insertVote: InsertVote): Promise<Vote> {
    const id = this.voteId++;
    const vote: Vote = { ...insertVote, id };
    this.votes.set(id, vote);
    return vote;
  }

  async getPollVotes(pollId: number): Promise<Vote[]> {
    return Array.from(this.votes.values()).filter(vote => vote.pollId === pollId);
  }
}

export const storage = new MemStorage();
