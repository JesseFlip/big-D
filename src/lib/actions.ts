"use server";

import { prisma } from "@/lib/prisma";
import { locationSchema, LocationFormValues } from "@/lib/validations/location";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function submitLocation(values: LocationFormValues) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("You must be logged in to submit a spot.");
  }

  const validatedFields = locationSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error("Invalid fields.");
  }

  const { title, description, category, address } = validatedFields.data;

  // Mocking coordinates for now (would use geocoding in Phase 5)
  const latitude = 32.7767;
  const longitude = -96.7970;

  try {
    await prisma.location.create({
      data: {
        title,
        description,
        category,
        address,
        latitude,
        longitude,
        authorId: session.user.id,
      },
    });

    revalidatePath("/feed");
    return { success: true };
  } catch (error) {
    console.error("Database Error:", error);
    return { error: "Failed to create location." };
  }
}

export async function getLocations() {
  try {
    const locations = await prisma.location.findMany({
      include: {
        _count: {
          select: { upvotes: true },
        },
        author: {
          select: { name: true },
        },
        upvotes: {
          select: { userId: true },
        },
      },
      orderBy: {
        upvotes: {
          _count: "desc",
        },
      },
    });

    return locations;
  } catch (error) {
    console.error("Database Error:", error);
    return [];
  }
}

export async function toggleUpvote(locationId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("You must be logged in to upvote.");
  }

  const userId = session.user.id;

  try {
    const existingUpvote = await prisma.upvote.findUnique({
      where: {
        userId_locationId: {
          userId,
          locationId,
        },
      },
    });

    if (existingUpvote) {
      await prisma.upvote.delete({
        where: {
          userId_locationId: {
            userId,
            locationId,
          },
        },
      });
    } else {
      await prisma.upvote.create({
        data: {
          userId,
          locationId,
        },
      });
    }

    revalidatePath("/feed");
    revalidatePath(`/spot/${locationId}`);
    return { success: true };
  } catch (error) {
    console.error("Upvote Error:", error);
    return { error: "Failed to update upvote." };
  }
}

export async function addComment(locationId: string, content: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("You must be logged in to comment.");
  }

  if (!content.trim()) {
    throw new Error("Comment cannot be empty.");
  }

  try {
    await prisma.comment.create({
      data: {
        content,
        userId: session.user.id,
        locationId,
      },
    });

    revalidatePath(`/spot/${locationId}`);
    return { success: true };
  } catch (error) {
    console.error("Comment Error:", error);
    return { error: "Failed to post comment." };
  }
}

export async function getLocationById(id: string) {
  try {
    const location = await prisma.location.findUnique({
      where: { id },
      include: {
        author: {
          select: { name: true, image: true },
        },
        _count: {
          select: { upvotes: true },
        },
        comments: {
          include: {
            user: {
              select: { name: true, image: true },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        upvotes: {
          select: { userId: true }
        },
      },
    });

    return location;
  } catch (error) {
    console.error("Fetch Error:", error);
    return null;
  }
}

