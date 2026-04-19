import { neon } from "@neondatabase/serverless";
import { sendEmail } from "@/lib/email";
import { getConfirmationEmailHTML } from "@/lib/email-template";
import { getAdminNotificationEmailHTML } from "@/lib/admin-template";

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return Response.json({ error: "All fields are required" }, { status: 400 });
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json({ error: "Invalid email address" }, { status: 400 });
    }

    // Save to Neon DB
    const sql = neon(process.env.DATABASE_URL!);
    const result = await sql.query(
      "INSERT INTO contact_messages (name, email, message, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id, created_at",
      [name.trim(), email.trim().toLowerCase(), message.trim()]
    );

    if (!result || result.length === 0) {
      return Response.json({ error: "Failed to save message" }, { status: 500 });
    }

    // Send both emails in parallel (non-blocking — don't fail the request if email fails)
    await Promise.allSettled([
      // Confirmation to the person who contacted
      sendEmail({
        to: email,
        subject: `Hey ${name}, thanks for reaching out!`,
        html: getConfirmationEmailHTML(name, message),
      }),
      // Admin notification to Vaibhav
      sendEmail({
        to: process.env.GMAIL_USER!,
        subject: `📬 New message from ${name} — Portfolio Contact`,
        html: getAdminNotificationEmailHTML(name, email, message),
      }),
    ]);

    return Response.json(
      {
        success: true,
        message: "Message sent successfully",
        id: result[0].id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact API error:", error);
    return Response.json({ error: "Failed to send message" }, { status: 500 });
  }
}
