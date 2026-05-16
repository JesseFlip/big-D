import { getLocations } from "@/lib/actions";
import { MapView } from "@/components/map-view";

export const dynamic = "force-dynamic";

export default async function MapPage() {
  const locations = await getLocations();

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="container mx-auto px-4 py-8 flex-1 flex flex-col">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tighter mb-2 uppercase">Gems on the Map</h1>
            <p className="text-muted-foreground max-w-xl text-sm">
              Explore the DFW metroplex through the eyes of locals. Navigate the markers to find your next authentic destination.
            </p>
          </div>
        </div>

        <div className="flex-1 min-h-[500px]">
          <MapView locations={locations.map(l => ({
            id: l.id,
            title: l.title,
            category: l.category,
            latitude: l.latitude,
            longitude: l.longitude
          }))} />
        </div>
      </div>
    </div>
  );
}
