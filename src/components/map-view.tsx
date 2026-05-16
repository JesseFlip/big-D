"use client";

import * as React from "react";
import Map, { Marker, Popup, NavigationControl } from "react-map-gl/mapbox";
import { MapPin, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

interface Location {
  id: string;
  title: string;
  category: string;
  latitude: number;
  longitude: number;
}

interface MapViewProps {
  locations: Location[];
}

export function MapView({ locations }: MapViewProps) {
  const { theme } = useTheme();
  const [popupInfo, setPopupInfo] = React.useState<Location | null>(null);

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  // Modern Map Styles
  const darkStyle = "mapbox://styles/mapbox/dark-v11";
  const lightStyle = "mapbox://styles/mapbox/light-v11";

  if (!mapboxToken) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-secondary/5 rounded-3xl border-2 border-dashed">
        <MapPin className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
        <h3 className="text-xl font-bold uppercase tracking-tight mb-2">Mapbox Access Token Missing</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Please add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to your .env file to enable the interactive map.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative rounded-3xl overflow-hidden border shadow-2xl">
      <Map
        initialViewState={{
          longitude: -96.797,
          latitude: 32.7767,
          zoom: 11,
        }}
        mapStyle={theme === "dark" ? darkStyle : lightStyle}
        mapboxAccessToken={mapboxToken}
        style={{ width: "100%", height: "100%" }}
      >
        <NavigationControl position="top-right" />

        {locations.map((location) => (
          <Marker
            key={location.id}
            longitude={location.longitude}
            latitude={location.latitude}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setPopupInfo(location);
            }}
          >
            <div className="cursor-pointer transition-transform hover:scale-125">
              <MapPin className="h-8 w-8 text-primary fill-primary/20 stroke-[3px]" />
            </div>
          </Marker>
        ))}

        {popupInfo && (
          <Popup
            anchor="top"
            longitude={popupInfo.longitude}
            latitude={popupInfo.latitude}
            onClose={() => setPopupInfo(null)}
            className="z-50"
          >
            <div className="p-2 min-w-[150px]">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1 block">
                {popupInfo.category}
              </span>
              <h4 className="font-bold text-sm mb-2">{popupInfo.title}</h4>
              <Link href={`/spot/${popupInfo.id}`}>
                <Button size="sm" variant="outline" className="w-full h-7 text-[10px] gap-1">
                  View Full Details
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
