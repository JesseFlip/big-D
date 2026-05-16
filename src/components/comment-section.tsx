"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { addComment } from "@/lib/actions";
import { MessageSquare, Send, Loader2 } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  user: {
    name: string | null;
    image: string | null;
  };
}

interface CommentSectionProps {
  locationId: string;
  initialComments: any[];
}

export function CommentSection({ locationId, initialComments }: CommentSectionProps) {
  const { data: session } = useSession();
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session) {
      signIn();
      return;
    }
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      await addComment(locationId, comment);
      setComment("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mt-12 pt-8 border-t">
      <div className="flex items-center gap-2 mb-8">
        <MessageSquare className="h-6 w-6 text-primary" />
        <h3 className="text-2xl font-bold uppercase tracking-tight">Community Discussion</h3>
        <span className="text-muted-foreground ml-2">({initialComments.length})</span>
      </div>

      {session ? (
        <form onSubmit={handleSubmit} className="mb-10 space-y-4">
          <Textarea
            placeholder="Share your experience here... (Keep it real)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[100px] bg-card/50"
          />
          <div className="flex justify-end">
            <Button disabled={isSubmitting || !comment.trim()} className="gap-2">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Post Insight
            </Button>
          </div>
        </form>
      ) : (
        <div className="p-6 rounded-2xl border bg-secondary/5 text-center mb-10">
          <p className="text-sm text-muted-foreground mb-4">You must be logged in to join the discussion.</p>
          <Button variant="outline" onClick={() => signIn()}>Sign In to Comment</Button>
        </div>
      )}

      <div className="space-y-6">
        {initialComments.map((comment) => (
          <div key={comment.id} className="flex gap-4 p-4 rounded-2xl bg-card/30 border border-transparent hover:border-primary/10 transition-colors">
            <div className="h-10 w-10 rounded-full bg-secondary flex-shrink-0 flex items-center justify-center overflow-hidden">
              {comment.user.image ? (
                <img src={comment.user.image} alt={comment.user.name || "User"} />
              ) : (
                <span className="font-bold text-xs uppercase">{comment.user.name?.charAt(0) || "U"}</span>
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">{comment.user.name || "Anonymous User"}</span>
                <span className="text-[10px] text-muted-foreground italic">
                  {formatDistanceToNow(new Date(comment.createdAt))} ago
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {comment.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
