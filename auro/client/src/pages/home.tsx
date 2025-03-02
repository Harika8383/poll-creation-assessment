import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import type { Poll } from "@shared/schema";
import PollCard from "@/components/poll-card";

export default function Home() {
  const { data: polls, isLoading } = useQuery<Poll[]>({ 
    queryKey: ["/api/polls"]
  });

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Community Polls
          </h1>
          <Link href="/create">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Poll
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {polls?.map((poll) => (
              <PollCard key={poll.id} poll={poll} />
            ))}
            {polls?.length === 0 && (
              <div className="col-span-2 text-center py-12 text-muted-foreground">
                No polls yet. Be the first to create one!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
