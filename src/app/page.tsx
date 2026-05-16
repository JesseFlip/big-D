"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Map as MapIcon, Star, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SubmitSpotForm } from "@/components/submit-spot-form";
import { useState } from "react";

export default function Home() {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 bg-gradient-to-b from-background to-secondary/20 border-b overflow-hidden relative">
        <div className="container px-4 mx-auto relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground mb-6">
              Official Anti-Hogwash Travel
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 leading-tight">
              THE REAL DALLAS <br />
              <span className="text-primary italic font-serif">WITHOUT THE FLUFF.</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
              Stop visiting the tourist traps. Join a community of locals surfacing the true gems, dives, and legendary spots across the DFW metroplex. 
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/map">
                <Button size="lg" className="px-8 gap-2">
                  <MapIcon className="h-5 w-5" />
                  Explore the Map
                </Button>
              </Link>
              
              {session ? (
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogTrigger
                    render={
                      <Button variant="outline" size="lg" className="px-8 gap-2">
                        Submit a Spot
                        <ArrowRight className="h-5 w-5" />
                      </Button>
                    }
                  />
                  <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                      <DialogTitle>Submit a Hidden Gem</DialogTitle>
                      <DialogDescription>
                        Found somewhere authentic? Share it with the community. We'll handle the maps.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-6">
                      <SubmitSpotForm onSuccess={() => setIsModalOpen(false)} />
                    </div>
                  </DialogContent>
                </Dialog>
              ) : (
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="px-8 gap-2"
                  onClick={() => signIn()}
                >
                  Join to Submit
                  <ArrowRight className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Decorative element */}
        <div className="absolute top-1/2 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2" />
      </section>

      {/* Features Preview */}
      <section className="w-full py-20 bg-background">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-primary/10 rounded-2xl">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold uppercase tracking-tight">Curated by Locals</h3>
              <p className="text-muted-foreground">Every spot is vetted by real Dallasites who know the difference between a gem and a trap.</p>
            </div>
            
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-primary/10 rounded-2xl">
                <ThumbsUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold uppercase tracking-tight">Community Voted</h3>
              <p className="text-muted-foreground">Upvote the best spots to help travelers find the true heart of the city.</p>
            </div>

            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-primary/10 rounded-2xl">
                <MapIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold uppercase tracking-tight">Geo-Locked Data</h3>
              <p className="text-muted-foreground">Accurate Mapbox integration ensures you find the exact back alley where the magic happens.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
