
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const adminEmail = Deno.env.get("ADMIN_EMAIL");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SupportRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
  urgent: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, subject, message, urgent }: SupportRequest = await req.json();

    // Use the verified domain email as the from address
    const fromEmail = "support@leveragedconsultants.com";
    const fromName = "SonicStories Support";

    // Send email to admin
    const adminEmailResponse = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: [adminEmail],
      subject: `${urgent ? "[URGENT] " : ""}New Support Request: ${subject}`,
      html: `
        <h1>New Support Request</h1>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Urgent:</strong> ${urgent ? "Yes" : "No"}</p>
        <h2>Message:</h2>
        <p>${message}</p>
      `,
    });

    console.log("Admin email response:", adminEmailResponse);

    // Send confirmation to user
    let userEmailResponse;
    try {
      userEmailResponse = await resend.emails.send({
        from: `${fromName} <${fromEmail}>`,
        to: [email],
        subject: "We received your support request",
        html: `
          <h1>Thank you for contacting us, ${name}!</h1>
          <p>We have received your support request regarding: "${subject}"</p>
          <p>We'll get back to you as soon as possible.</p>
          <h2>Your message:</h2>
          <p>${message}</p>
          <p>Best regards,<br>The SonicStories Support Team</p>
        `,
      });
      console.log("User confirmation email response:", userEmailResponse);
    } catch (emailError: any) {
      console.error("Error sending confirmation to user:", emailError);
      userEmailResponse = { 
        error: emailError.message, 
        note: "Unable to send confirmation email to user but admin was notified" 
      };
      
      // Don't fail the whole request if just the confirmation email fails
      // The admin still got notified about the support request
    }

    return new Response(
      JSON.stringify({ 
        message: "Support request sent successfully",
        adminEmail: adminEmailResponse,
        userEmail: userEmailResponse 
      }), 
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-support-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
