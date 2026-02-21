import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const resend = new Resend(RESEND_API_KEY);

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "harsh.141615@gmail.com";
const COMPANY_NAME = "IKRR Events";
const COMPANY_PHONE = "+91-XXXXXXXXXX";

// IMPORTANT: Use a verified domain email from https://resend.com/domains
// If your domain (ikrr.co.in) is not verified on Resend yet, you MUST use "onboarding@resend.dev"
// We are defaulting to "onboarding@resend.dev" to ensure emails work during development.
const NOREPLY_EMAIL = process.env.NOREPLY_EMAIL || "onboarding@resend.dev";

if (!RESEND_API_KEY) {
  console.warn("⚠️ RESEND_API_KEY is not configured. Emails will not be sent.");
} else {
  console.log("✓ Resend email service configured and ready");
}

export async function sendBookingConfirmationEmail(
  userEmail: string, 
  userName: string, 
  bookingDetails: any
) {
  try {
    if (!RESEND_API_KEY) {
      console.error("❌ Email Error: RESEND_API_KEY is not configured");
      return { success: false, error: "Email service not configured" };
    }

    // Step 1: Send detailed booking info to ADMIN
    console.log(`\n📧 Step 1: Sending booking details to admin...`);
    
    const adminEmailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f5f7;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #4B3C55; margin: 0;">✓ New Booking Received!</h1>
      </div>
      
      <div style="background-color: white; padding: 25px; border-radius: 12px;">
        <p style="color: #4B3C55; line-height: 1.6;">
          A new booking request has been submitted to <strong>${COMPANY_NAME}</strong>.
        </p>
        
        <div style="background-color: #f5f0f7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #D4AF37;">
          <h2 style="color: #4B3C55; margin-top: 0;">Customer & Booking Details</h2>
          
          <p style="color: #4B3C55; margin: 12px 0;">
            <strong>Customer Name:</strong> ${userName}
          </p>
          
          <p style="color: #4B3C55; margin: 12px 0;">
            <strong>Customer Email:</strong> ${userEmail}
          </p>
          
          <p style="color: #4B3C55; margin: 12px 0;">
            <strong>Booking Reference ID:</strong> ${bookingDetails.id}
          </p>
          
          <p style="color: #4B3C55; margin: 12px 0;">
            <strong>Event Type(s):</strong> ${bookingDetails.eventTypes.join(", ")}
          </p>
          
          <p style="color: #4B3C55; margin: 12px 0;">
            <strong>Preferred Date(s):</strong> ${bookingDetails.eventDates.join(", ")}
          </p>
          
          <p style="color: #4B3C55; margin: 12px 0;">
            <strong>Venue:</strong> ${bookingDetails.eventVenue}
          </p>
          
          <p style="color: #4B3C55; margin: 12px 0;">
            <strong>Number of Attendees:</strong> ${bookingDetails.attendeeCount}
          </p>
          
          <p style="color: #4B3C55; margin: 12px 0;">
            <strong>Budget Range:</strong> ${bookingDetails.budget}
          </p>
        </div>
        
        <p style="color: #4B3C55; line-height: 1.6;">
          <strong>Action Required:</strong> Contact the customer to discuss event requirements and provide a customized quote.
        </p>
        
        <div style="background-color: #D4AF37; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <p style="color: white; margin: 0; font-weight: bold;">📱 Contact Customer</p>
          <p style="color: white; margin: 8px 0; font-size: 14px;"><strong>Email:</strong> ${userEmail}</p>
        </div>
      </div>
    </div>
  `;

    const adminResponse = await resend.emails.send({
      from: NOREPLY_EMAIL,
      to: ADMIN_EMAIL,
      subject: `🎯 NEW BOOKING: ${bookingDetails.id} - ${userName}`,
      html: adminEmailContent
    });

    if (adminResponse.error) {
      console.error("❌ Admin email failed:", adminResponse.error.message);
    } else {
      console.log("✓ Admin email sent successfully");
    }

    // Step 2: Send simple confirmation email to CUSTOMER
    console.log(`📧 Step 2: Sending confirmation to customer (${userEmail})...`);
    
    const customerEmailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f5f7;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #4B3C55; margin: 0;">✓ Thank You for Your Booking!</h1>
      </div>
      
      <div style="background-color: white; padding: 25px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <p style="color: #4B3C55; font-size: 16px; margin-bottom: 20px;">Hi ${userName},</p>
        
        <p style="color: #4B3C55; line-height: 1.8; margin-bottom: 20px;">
          We have received your booking request at <strong>${COMPANY_NAME}</strong>. 
          <br/><br/>
          <strong>Thank you for choosing us!</strong> Our team will review your details and contact you shortly to discuss your event requirements and provide you with a customized proposal.
        </p>
        
        <div style="background-color: #f5f0f7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #D4AF37;">
          <h2 style="color: #4B3C55; margin-top: 0;">What's Next?</h2>
          
          <p style="color: #4B3C55; margin: 12px 0;">
            We will be in touch within <strong>24-48 hours</strong> to discuss your event in detail.
          </p>
          
          <p style="color: #4B3C55; margin: 12px 0;">
            <strong>Your Reference ID:</strong> <span style="background-color: #fff3cd; padding: 6px 12px; border-radius: 4px; font-family: monospace;">${bookingDetails.id}</span>
          </p>
          
          <p style="color: #4B3C55; margin: 12px 0;">
            Please save this ID for your records.
          </p>
        </div>
        
        <p style="color: #4B3C55; line-height: 1.6; margin-top: 20px;">
          If you have any urgent questions or need to reach us immediately, feel free to contact us:
        </p>
        
        <div style="background-color: #D4AF37; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <p style="color: white; margin: 0; font-weight: bold;">📞 Get in Touch</p>
          <p style="color: white; margin: 8px 0; font-size: 14px;">
            Email: ${ADMIN_EMAIL}<br/>
            Phone: ${COMPANY_PHONE}
          </p>
        </div>
        
        <p style="color: #4B3C55; line-height: 1.6; margin-top: 20px;">
          We look forward to creating an unforgettable event for you!
        </p>
        
        <p style="color: #4B3C55; margin-top: 30px;">
          Best regards,<br/>
          <strong>The ${COMPANY_NAME} Team</strong>
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
        <p>This is an automated confirmation message. Please keep this email for your records.</p>
      </div>
    </div>
  `;

    const customerResponse = await resend.emails.send({
      from: NOREPLY_EMAIL,
      to: userEmail,
      subject: `Booking Confirmation - Reference #${bookingDetails.id}`,
      html: customerEmailContent
    });

    if (customerResponse.error) {
      console.warn("⚠️ Customer email failed (this is expected with test domain)");
      console.warn(`   Note: To send to customer email, verify a domain at resend.com/domains`);
    } else {
      console.log("✓ Customer email sent successfully");
    }

    console.log(`\n✅ Booking emails process complete!\n`);
    return { success: true, messageId: 'sent' };

  } catch (error) {
    console.error("❌ Error sending booking emails:", error);
    return { success: false, error };
  }
}

export async function sendQueryConfirmationEmail(
  userEmail: string, 
  userName: string, 
  queryDetails: any
) {
  try {
    if (!RESEND_API_KEY) {
      console.error("❌ Email Error: RESEND_API_KEY is not configured");
      return { success: false, error: "Email service not configured" };
    }

    // Step 1: Send query details to ADMIN
    console.log(`\n📧 Step 1: Sending query details to admin...`);
    
    const adminEmailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f5f7;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #4B3C55; margin: 0;">✓ New Query Received!</h1>
      </div>
      
      <div style="background-color: white; padding: 25px; border-radius: 12px;">
        <p style="color: #4B3C55; line-height: 1.6;">
          A new inquiry has been submitted to <strong>${COMPANY_NAME}</strong>.
        </p>
        
        <div style="background-color: #f5f0f7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #D4AF37;">
          <h2 style="color: #4B3C55; margin-top: 0;">Customer & Query Details</h2>
          
          <p style="color: #4B3C55; margin: 12px 0;">
            <strong>Customer Name:</strong> ${userName}
          </p>
          
          <p style="color: #4B3C55; margin: 12px 0;">
            <strong>Customer Email:</strong> ${userEmail}
          </p>
          
          <p style="color: #4B3C55; margin: 12px 0;">
            <strong>Query Reference ID:</strong> ${queryDetails.id}
          </p>
          
          ${queryDetails.phone ? `<p style="color: #4B3C55; margin: 12px 0;"><strong>Phone:</strong> ${queryDetails.phone}</p>` : ""}
          
          <p style="color: #4B3C55; margin: 12px 0;"><strong>Message:</strong></p>
          <p style="color: #4B3C55; background-color: white; padding: 12px; border-radius: 6px; margin: 8px 0; border: 1px solid #e0d6e4;">${queryDetails.message.replace(/\n/g, "<br/>")}</p>
        </div>
        
        <p style="color: #4B3C55; line-height: 1.6;">
          <strong>Action Required:</strong> Review the query details and follow up with the customer within 24-48 hours.
        </p>
        
        <div style="background-color: #D4AF37; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <p style="color: white; margin: 0; font-weight: bold;">📞 Contact Customer</p>
          <p style="color: white; margin: 8px 0; font-size: 14px;"><strong>Email:</strong> ${userEmail}</p>
        </div>
      </div>
    </div>
  `;

    const adminResponse = await resend.emails.send({
      from: NOREPLY_EMAIL,
      to: ADMIN_EMAIL,
      subject: `🎯 NEW QUERY: ${queryDetails.id} - ${userName}`,
      html: adminEmailContent
    });

    if (adminResponse.error) {
      console.error("❌ Admin email failed:", adminResponse.error.message);
    } else {
      console.log("✓ Admin email sent successfully");
    }

    // Step 2: Send simple confirmation to CUSTOMER
    console.log(`📧 Step 2: Sending confirmation to customer (${userEmail})...`);
    
    const customerEmailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f5f7;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #4B3C55; margin: 0;">✓ We've Received Your Query!</h1>
      </div>
      
      <div style="background-color: white; padding: 25px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <p style="color: #4B3C55; font-size: 16px; margin-bottom: 20px;">Hi ${userName},</p>
        
        <p style="color: #4B3C55; line-height: 1.8; margin-bottom: 20px;">
          Thank you for reaching out to <strong>${COMPANY_NAME}</strong>. 
          <br/><br/>
          We have received your query and will respond to you as soon as possible.
        </p>
        
        <div style="background-color: #f5f0f7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #D4AF37;">
          <h2 style="color: #4B3C55; margin-top: 0;">What's Next?</h2>
          
          <p style="color: #4B3C55; margin: 12px 0;">
            Our team will review your query and get back to you within <strong>24-48 hours</strong>.
          </p>
          
          <p style="color: #4B3C55; margin: 12px 0;">
            <strong>Your Reference ID:</strong> <span style="background-color: #fff3cd; padding: 6px 12px; border-radius: 4px; font-family: monospace;">${queryDetails.id}</span>
          </p>
        </div>
        
        <p style="color: #4B3C55; line-height: 1.6; margin-top: 20px;">
          If you need immediate assistance, feel free to contact us:
        </p>
        
        <div style="background-color: #D4AF37; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <p style="color: white; margin: 0; font-weight: bold;">📞 Get in Touch</p>
          <p style="color: white; margin: 8px 0; font-size: 14px;">
            Email: ${ADMIN_EMAIL}<br/>
            Phone: ${COMPANY_PHONE}
          </p>
        </div>
        
        <p style="color: #4B3C55; line-height: 1.6; margin-top: 20px;">
          Thank you for choosing us. We're excited to help you create an amazing event!
        </p>
        
        <p style="color: #4B3C55; margin-top: 30px;">
          Best regards,<br/>
          <strong>The ${COMPANY_NAME} Team</strong>
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
        <p>This is an automated confirmation message. Please keep this email for your records.</p>
      </div>
    </div>
  `;

    const customerResponse = await resend.emails.send({
      from: NOREPLY_EMAIL,
      to: userEmail,
      subject: `Query Confirmation - Reference #${queryDetails.id}`,
      html: customerEmailContent
    });

    if (customerResponse.error) {
      console.warn("⚠️ Customer email failed (this is expected with test domain)");
      console.warn(`   Note: To send to customer email, verify a domain at resend.com/domains`);
    } else {
      console.log("✓ Customer email sent successfully");
    }

    console.log(`\n✅ Query emails process complete!\n`);
    return { success: true, messageId: 'sent' };

  } catch (error) {
    console.error("❌ Error sending query emails:", error);
    return { success: false, error };
  }
}
