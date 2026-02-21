import { getAuthSession } from "@/auth";
import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "harsh.141615@gmail.com";

export async function DELETE(req: NextRequest) {
  try {
    const session = await getAuthSession();

    // Check if user is logged in and is admin
    if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: "Unauthorized: Only admin can delete images" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { imageId } = body;

    if (!imageId) {
      return NextResponse.json(
        { error: "Missing imageId" },
        { status: 400 }
      );
    }

    // Delete image from database
    const deletedImage = await db.galleryImage.delete({
      where: { id: imageId },
    });

    return NextResponse.json(
      { message: "Image deleted successfully", deletedImage },
      { status: 200 }
    );
  } catch (error) {
    console.error("Gallery delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
