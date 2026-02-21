import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/prisma";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "harsh.141615@gmail.com";

// GET: Fetch the about section image
export async function GET() {
  try {
    const aboutImage = await db.aboutImage.findFirst();
    
    if (!aboutImage) {
      // Return a default placeholder if no image exists
      return NextResponse.json({
        imageUrl: null,
        message: "No image found",
      });
    }

    return NextResponse.json({ imageUrl: aboutImage.imageUrl });
  } catch (error) {
    console.error("Error fetching about image:", error);
    return NextResponse.json(
      { error: "Failed to fetch about image" },
      { status: 500 }
    );
  }
}

// POST: Upload or update the about section image
export async function POST(req: NextRequest) {
  try {
    // Check if user is admin
    const adminEmail = req.headers.get("x-admin-email");
    
    if (adminEmail !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    // Delete existing image and create a new one
    await db.aboutImage.deleteMany();
    
    const aboutImage = await db.aboutImage.create({
      data: {
        imageUrl,
      },
    });

    return NextResponse.json({
      success: true,
      imageUrl: aboutImage.imageUrl,
    });
  } catch (error) {
    console.error("Error uploading about image:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}

// DELETE: Delete the about section image
export async function DELETE(req: NextRequest) {
  try {
    // Check if user is admin
    const adminEmail = req.headers.get("x-admin-email");
    
    if (adminEmail !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await db.aboutImage.deleteMany();

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting about image:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
