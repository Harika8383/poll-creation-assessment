import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Poll, Vote } from "@shared/schema";
import { ArrowLeft } from "lucide-react";
import PollResults from "@/components/poll-results";
import { useState } from "react";

export default function PollPage() {
  const { id } = useParams();
  const { toast } = useToast();
  const [hasVoted, setHasVoted] = useState(false);

  const { data: poll, isLoading: pollLoading } = useQuery<Poll>({
    queryKey: [`/api/polls/${id}`],
  });

  const { data: votes, isLoading: votesLoading } = useQuery<Vote[]>({
    queryKey: [`/api/polls/${id}/votes`],
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (optionIndex: number) => {
      const res = await apiRequest("POST", `/api/polls/${id}/vote`, { optionIndex });
      return res.json();
    },
    onSuccess: () => {
      setHasVoted(true);
      queryClient.invalidateQueries({ queryKey: [`/api/polls/${id}/votes`] });
      toast({ title: "Vote recorded!" });
    },
    onError: (error) => {
      toast({
        title: "Failed to vote",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (pollLoading || votesLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-2xl mx-auto">
          <div className="h-64 rounded-lg bg-muted animate-pulse" />
        </div>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Poll not found</h1>
          <Link href="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Polls
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>{poll.question}</CardTitle>
          </CardHeader>
          <CardContent>
            {hasVoted || votes?.length ? (
              <PollResults poll={poll} votes={votes || []} />
            ) : (
              <div className="space-y-2">
                {poll.options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start h-auto py-4 px-6"
                    onClick={() => mutate(index)}
                    disabled={isPending}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
