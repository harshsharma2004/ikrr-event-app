import { getAuthSession } from "@/auth";
import { db } from "@/lib/prisma";
import { sendQueryConfirmationEmail } from "@/lib/email";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, message } = body;

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Get user session if logged in
    const session = await getAuthSession();
    const userId = session?.user?.id || null;

    // Create query in database
    const query = await db.simpleQuery.create({
      data: {
        name,
        email,
        phone: phone || null,
        message,
        status: "NEW",
        userId,
      },
    });

    // Send confirmation email to user
    try {
      console.log(`\n📧 Email Service: Attempting to send query confirmation...`);
      console.log(`   Recipient: ${email}`);
      console.log(`   Name: ${name}`);
      
      const emailResult = await sendQueryConfirmationEmail(email, name, {
        id: query.id,
        message,
        phone: phone || undefined,
      });
      
      if (emailResult.success) {
        console.log(`   ✓ Email sent successfully with ID: ${emailResult.messageId}`);
      } else {
        console.error(`   ✗ Email failed: ${emailResult.error}`);
      }
    } catch (emailError) {
      console.error("❌ Error sending query confirmation email:", emailError);
      // Don't fail the query submission if email fails, just log it
    }

    return NextResponse.json(
      { message: "Query submitted successfully", query },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to submit query" },
      { status: 500 }
    );
  }
}

// GET user's own queries
export async function GET() {
  try {
    const session = await getAuthSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized: Please log in" },
        { status: 401 }
      );
    }

    // Get queries for logged-in user
    const queries = await db.simpleQuery.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ queries }, { status: 200 });
  } catch (error) {
    console.error("Fetch queries error:", error);
    return NextResponse.json(
      { error: "Failed to fetch queries" },
      { status: 500 }
    );
  }
}
