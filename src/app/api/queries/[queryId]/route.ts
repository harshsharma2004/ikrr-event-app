import { getAuthSession } from "@/auth";
import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "harsh.141615@gmail.com";

// GET all queries for admin / specific query details
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ queryId: string }> }
) {
  try {
    const session = await getAuthSession();
    const { queryId } = await params;

    // Check if user is admin
    if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: "Unauthorized: Admin access only" },
        { status: 401 }
      );
    }

    // If queryId is provided, get specific query
    if (queryId && queryId !== "all") {
      const query = await db.simpleQuery.findUnique({
        where: { id: queryId },
        include: {
          user: {
            select: { id: true, email: true, name: true },
          },
        },
      });

      if (!query) {
        return NextResponse.json(
          { error: "Query not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ query }, { status: 200 });
    }

    // Get all queries
    const queries = await db.simpleQuery.findMany({
      include: {
        user: {
          select: { id: true, email: true, name: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ queries }, { status: 200 });
  } catch (error) {
    console.error("Fetch admin queries error:", error);
    return NextResponse.json(
      { error: "Failed to fetch queries" },
      { status: 500 }
    );
  }
}

// UPDATE query (admin only)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ queryId: string }> }
) {
  try {
    const session = await getAuthSession();
    const { queryId } = await params;
    const body = await req.json();
    const { status, notes } = body;

    // Check if user is admin
    if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: "Unauthorized: Admin access only" },
        { status: 401 }
      );
    }

    // Validate queryId
    if (!queryId) {
      return NextResponse.json(
        { error: "Query ID is required" },
        { status: 400 }
      );
    }

    // Update query
    const updatedQuery = await db.simpleQuery.update({
      where: { id: queryId },
      data: {
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
      },
    });

    return NextResponse.json(
      { message: "Query updated successfully", query: updatedQuery },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update query error:", error);
    return NextResponse.json(
      { error: "Failed to update query" },
      { status: 500 }
    );
  }
}

// DELETE query (admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ queryId: string }> }
) {
  try {
    const session = await getAuthSession();
    const { queryId } = await params;

    // Check if user is admin
    if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: "Unauthorized: Admin access only" },
        { status: 401 }
      );
    }

    // Validate queryId
    if (!queryId) {
      return NextResponse.json(
        { error: "Query ID is required" },
        { status: 400 }
      );
    }

    // Delete query
    const deletedQuery = await db.simpleQuery.delete({
      where: { id: queryId },
    });

    return NextResponse.json(
      { message: "Query deleted successfully", query: deletedQuery },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete query error:", error);
    return NextResponse.json(
      { error: "Failed to delete query" },
      { status: 500 }
    );
  }
}
