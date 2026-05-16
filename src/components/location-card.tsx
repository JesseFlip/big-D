"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageSquare, MapPin, User, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useOptimistic, useTransition } from "react";
import { toggleUpvote } from "@/lib/actions";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LocationCardProps {
  location: {
    id: string;
    title: string;
    description: string;
    category: string;
    address: string | null;
    createdAt: Date;
    author: { name: string | null };
    _count: { upvotes: number };
    upvotes: { userId: string }[];
  };
}

export function LocationCard({ location }: LocationCardProps) {
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();
  
  const isUpvotedInitial = location.upvotes.some(v => v.userId === session?.user?.id);

  const [optimisticState, addOptimisticVote] = useOptimistic(
    { count: location._count.upvotes, isUpvoted: isUpvotedInitial },
    (state, action: { isUpvoted: boolean }) => ({
      count: action.isUpvoted ? state.count + 1 : state.count - 1,
      isUpvoted: action.isUpvoted
    })
  );

  async function handleUpvote(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    
    if (!session) {
      signIn();
      return;
    }

    startTransition(async () => {
      addOptimisticVote({ isUpvoted: !optimisticState.isUpvoted });
      await toggleUpvote(location.id);
    });
  }

  return (
    <Link href={`/spot/${location.id}`}>
      <Card className="overflow-hidden transition-all hover:shadow-lg border-primary/10 bg-card/50 backdrop-blur-sm h-full flex flex-col">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <Badge variant="secondary" className="mb-2 font-mono text-[10px] uppercase tracking-widest">
              {location.category}
            </Badge>
            <div className="flex items-center text-[10px] text-muted-foreground">
              <User className="h-3 w-3 mr-1" />
              {location.author.name || "Anonymous"}
            </div>
          </div>
          <CardTitle className="text-xl font-bold tracking-tight">{location.title}</CardTitle>
          <CardDescription className="flex items-center text-xs mt-1">
            <MapPin className="h-3 w-3 mr-1 text-primary" />
            {location.address || "Dallas, TX"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {location.description}
          </p>
        </CardContent>
        <CardFooter className="pt-2 border-t bg-secondary/5 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleUpvote}
              disabled={isPending}
              className={cn(
                "h-8 px-2 gap-1 transition-colors",
                optimisticState.isUpvoted ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary hover:bg-primary/5"
              )}
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ThumbsUp className={cn("h-4 w-4", optimisticState.isUpvoted && "fill-current")} />}
              <span className="text-xs font-bold">{optimisticState.count}</span>
            </Button>
            <div className="flex items-center space-x-1 text-muted-foreground">
              <MessageSquare className="h-4 w-4" />
              <span className="text-xs font-medium">0</span>
            </div>
          </div>
          <span className="text-[10px] text-muted-foreground italic">
            {formatDistanceToNow(new Date(location.createdAt))} ago
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
