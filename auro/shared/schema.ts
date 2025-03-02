import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const polls = pgTable("polls", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  options: text("options").array().notNull(),
});

export const votes = pgTable("votes", {
  id: serial("id").primaryKey(),
  pollId: integer("poll_id").notNull(),
  optionIndex: integer("option_index").notNull(),
});

export const insertPollSchema = createInsertSchema(polls).pick({
  question: true,
  options: true,
}).extend({
  question: z.string().min(5, "Question must be at least 5 characters"),
  options: z.array(z.string().min(1, "Option cannot be empty"))
    .min(2, "At least 2 options are required")
    .refine((options) => options.every(opt => opt.trim().length > 0), {
      message: "All options must contain non-empty text"
    }),
});

export const voteSchema = createInsertSchema(votes).pick({
  pollId: true,
  optionIndex: true,
});

export type Poll = typeof polls.$inferSelect;
export type InsertPoll = z.infer<typeof insertPollSchema>;
export type Vote = typeof votes.$inferSelect;
export type InsertVote = z.infer<typeof voteSchema>;