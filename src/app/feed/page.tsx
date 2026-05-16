import { getLocations } from "@/lib/actions";
import { LocationCard } from "@/components/location-card";

export const dynamic = "force-dynamic";

export default async function FeedPage() {
  const locations = await getLocations();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tighter mb-2 uppercase">Authentic Spots</h1>
          <p className="text-muted-foreground max-w-xl">
            Ranked by the community. These are the real gems of the DFW metroplex, vetted by locals who actually live here.
          </p>
        </div>
        
        <div className="flex space-x-2">
          {/* Filters could go here later */}
        </div>
      </div>

      {locations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center border rounded-3xl bg-secondary/5">
          <p className="text-lg font-medium mb-2">No spots submitted yet.</p>
          <p className="text-sm text-muted-foreground">Be the first to share a hidden gem in Dallas!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {locations.map((location: any) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </div>
      )}
    </div>
  );
}
