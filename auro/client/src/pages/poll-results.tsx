import { Progress } from "@/components/ui/progress";
import type { Poll, Vote } from "@shared/schema";

interface PollResultsProps {
  poll: Poll;
  votes: Vote[];
}

export default function PollResults({ poll, votes }: PollResultsProps) {
  const totalVotes = votes.length;
  const votesPerOption = poll.options.map((_, index) => 
    votes.filter(v => v.optionIndex === index).length
  );

  return (
    <div className="space-y-4">
      {poll.options.map((option, index) => {
        const optionVotes = votesPerOption[index];
        const percentage = totalVotes === 0 ? 0 : (optionVotes / totalVotes) * 100;

        return (
          <div key={index} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{option}</span>
              <span className="text-muted-foreground">
                {optionVotes} vote{optionVotes !== 1 ? "s" : ""} ({percentage.toFixed(1)}%)
              </span>
            </div>
            <Progress value={percentage} className="h-2" />
          </div>
        );
      })}

      <p className="text-center text-sm text-muted-foreground pt-4">
        Total votes: {totalVotes}
      </p>
    </div>
  );
}
