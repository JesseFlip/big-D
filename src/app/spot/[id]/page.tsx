import { getLocationById } from "@/lib/actions";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, User, Star } from "lucide-react";
import { format } from "date-fns";
import { CommentSection } from "@/components/comment-section";

export default async function SpotPage({ params }: { params: { id: string } }) {
  const location = await getLocationById(params.id);

  if (!location) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <Badge className="mb-4 uppercase tracking-tighter font-bold">
              {location.category}
            </Badge>
            <h1 className="text-5xl font-black tracking-tight mb-4 uppercase leading-none">
              {location.title}
            </h1>
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-primary" />
                {location.address}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {format(new Date(location.createdAt), "MMMM d, yyyy")}
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Shared by {location.author.name || "Anonymous"}
              </div>
            </div>
          </div>

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <h2 className="text-2xl font-bold uppercase tracking-tight mb-4 border-b pb-2">Why it's Authentic</h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              {location.description}
            </p>
          </div>

          {/* Map placeholder for Phase 5 */}
          <div className="aspect-video w-full bg-secondary/20 rounded-3xl border-2 border-dashed flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <MapPin className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p className="font-medium">Interactive Map Integration coming in Phase 5</p>
            </div>
          </div>

          <CommentSection locationId={location.id} initialComments={location.comments} />
        </div>

        {/* Right Column: Sidebar Stats */}
        <div className="space-y-6">
          <div className="p-8 rounded-3xl bg-primary text-primary-foreground shadow-2xl shadow-primary/20">
            <div className="flex items-center justify-between mb-4">
              <Star className="h-6 w-6" />
              <span className="text-xs font-mono uppercase tracking-widest opacity-80">Community Rating</span>
            </div>
            <div className="text-6xl font-black mb-2">{location._count.upvotes}</div>
            <p className="text-sm font-medium opacity-90 uppercase tracking-tight">Authenticity Upvotes</p>
          </div>
          
          <div className="p-6 rounded-3xl border bg-card/50 backdrop-blur-sm">
            <h3 className="font-bold mb-4 uppercase text-xs tracking-widest text-muted-foreground">About the Contributor</h3>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-sm">{location.author.name || "Anonymous User"}</p>
                <p className="text-xs text-muted-foreground">Dallas Local</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
