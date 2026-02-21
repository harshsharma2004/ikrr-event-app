import { getAuthSession } from "@/auth";
import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "harsh.141615@gmail.com";

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession();

    // Check if user is logged in and is admin
    if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: "Unauthorized: Only admin can upload images" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { imageUrl, caption, eventId } = body;

    if (!imageUrl || !eventId) {
      return NextResponse.json(
        { error: "Missing required fields: imageUrl, eventId" },
        { status: 400 }
      );
    }

    // Get the max order for this eventId
    const lastImage = await db.galleryImage.findFirst({
      where: { eventId },
      orderBy: { order: "desc" },
    });

    const newOrder = (lastImage?.order ?? -1) + 1;

    // Add image to database
    const galleryImage = await db.galleryImage.create({
      data: {
        imageUrl,
        caption: caption || null,
        eventId,
        order: newOrder,
      },
    });

    return NextResponse.json(galleryImage, { status: 201 });
  } catch (error) {
    console.error("Gallery upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
