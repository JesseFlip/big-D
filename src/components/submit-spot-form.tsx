"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { locationSchema, LocationFormValues } from "@/lib/validations/location";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { submitLocation } from "@/lib/actions";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export function SubmitSpotForm({ onSuccess }: { onSuccess: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      category: "Food & Drink",
    },
  });

  async function onSubmit(data: LocationFormValues) {
    setIsLoading(true);
    setError(null);
    try {
      const result = await submitLocation(data);
      if (result.success) {
        reset();
        onSuccess();
      } else {
        setError(result.error || "Something went wrong.");
      }
    } catch (e) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Spot Name</Label>
        <Input
          id="title"
          placeholder="e.g. Pecan Lodge"
          {...register("title")}
          className={errors.title ? "border-destructive" : ""}
        />
        {errors.title && (
          <p className="text-xs text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <select
          id="category"
          {...register("category")}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="Food & Drink">Food & Drink</option>
          <option value="Nightlife">Nightlife</option>
          <option value="Outdoors">Outdoors</option>
          <option value="Culture">Culture</option>
          <option value="Hidden Gems">Hidden Gems</option>
        </select>
        {errors.category && (
          <p className="text-xs text-destructive">{errors.category.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Approximate Address / Neighborhood</Label>
        <Input
          id="address"
          placeholder="e.g. Deep Ellum, Dallas"
          {...register("address")}
          className={errors.address ? "border-destructive" : ""}
        />
        {errors.address && (
          <p className="text-xs text-destructive">{errors.address.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Why is it authentic? (Anti-Hogwash only)</Label>
        <Textarea
          id="description"
          placeholder="Tell us what makes this place real..."
          {...register("description")}
          className={errors.description ? "border-destructive" : ""}
        />
        {errors.description && (
          <p className="text-xs text-destructive">{errors.description.message}</p>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Submit Dallas Spot
      </Button>
    </form>
  );
}
