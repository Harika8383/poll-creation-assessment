import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { type Poll } from "@shared/schema";
import { Link } from "wouter";

interface PollCardProps {
  poll: Poll;
}

export default function PollCard({ poll }: PollCardProps) {
  return (
    <Link href={`/poll/${poll.id}`}>
      <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
        <CardHeader>
          <CardTitle className="line-clamp-2">{poll.question}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {poll.options.length} options
          </p>
        </CardHeader>
      </Card>
    </Link>
  );
}
