import { getAuthSession } from "@/auth";
import { db } from "@/lib/prisma";
import { sendBookingConfirmationEmail } from "@/lib/email";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession();

    // Get logged-in user ID
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized: Please log in to book an event" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      eventTypes,
      otherEvent,
      eventDates,
      eventTimes,
      eventVenue,
      attendeeCount,
      setupDetails,
      themeDetails,
      avNeeds,
      foodNeeds,
      brandingNeeds,
      brandingFileUrl,
      budget,
      poc,
    } = body;

    // Validation
    if (!eventTypes || eventTypes.length === 0) {
      return NextResponse.json(
        { error: "Please select at least one event type" },
        { status: 400 }
      );
    }

    if (!eventVenue || !attendeeCount || !budget || !poc) {
      return NextResponse.json(
        { error: "Please fill in all required fields" },
        { status: 400 }
      );
    }

    if (!eventDates || eventDates.length === 0) {
      return NextResponse.json(
        { error: "Please select at least one event date" },
        { status: 400 }
      );
    }

    // Create event query in database
    const eventQuery = await db.eventQuery.create({
      data: {
        eventTypes,
        otherEvent: otherEvent || null,
        eventDates: eventDates || [],
        eventTimes: eventTimes || [],
        eventVenue,
        attendeeCount: parseInt(attendeeCount),
        setupDetails: setupDetails || null,
        themeDetails: themeDetails || null,
        avNeeds: avNeeds || null,
        foodNeeds: foodNeeds || null,
        brandingNeeds: brandingNeeds || null,
        brandingFileUrl: brandingFileUrl || null,
        budget,
        poc,
        status: "PENDING",
        userId: session.user.id,
      },
    });

    // Send confirmation email to user
    if (session.user.email && session.user.name) {
      try {
        console.log(`\n📧 Email Service: Attempting to send booking confirmation...`);
        console.log(`   Recipient: ${session.user.email}`);
        console.log(`   Name: ${session.user.name}`);
        
        const emailResult = await sendBookingConfirmationEmail(
          session.user.email,
          session.user.name,
          {
            id: eventQuery.id,
            eventTypes,
            eventDates,
            eventVenue,
            attendeeCount: parseInt(attendeeCount),
            budget,
          }
        );
        
        if (emailResult.success) {
          console.log(`   ✓ Email sent successfully with ID: ${emailResult.messageId}`);
        } else {
          console.error(`   ✗ Email failed: ${emailResult.error}`);
        }
      } catch (emailError) {
        console.error("❌ Error sending booking confirmation email:", emailError);
        // Don't fail the booking if email fails, just log it
      }
    } else {
      console.warn("⚠️  Cannot send email: User email or name missing");
    }

    return NextResponse.json(
      {
        message: "Booking submitted successfully! We will contact you soon.",
        booking: eventQuery,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Booking submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit booking request" },
      { status: 500 }
    );
  }
}

// GET user's own bookings
export async function GET() {
  try {
    const session = await getAuthSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized: Please log in" },
        { status: 401 }
      );
    }

    const bookings = await db.eventQuery.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ bookings }, { status: 200 });
  } catch (error) {
    console.error("Fetch bookings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
