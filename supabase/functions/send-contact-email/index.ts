
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactFormRequest {
  name: string;
  email: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, message }: ContactFormRequest = await req.json();

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Sending email to admin and user", { name, email });

    // Send email to site owner
    const adminEmailResponse = await resend.emails.send({
      from: "Contact Form <contact@leveragedconsultants.com>",
      to: Deno.env.get("ADMIN_EMAIL") || "claude@leveragedconsultants.com",
      subject: `New Contact Form Message from ${name}`,
      html: `
        <h1>New Contact Form Submission</h1>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    console.log("Admin email sent", adminEmailResponse);

    // Send confirmation email to the user
    let userEmailResponse;
    try {
      userEmailResponse = await resend.emails.send({
        from: "User Stories <no-reply@leveragedconsultants.com>",
        to: [email],
        subject: "We received your message!",
        html: `
          <h1>Thank you for contacting User Stories!</h1>
          <p>Someone from our team will follow up as soon as possible.</p>
          <p>For your reference, here's a copy of your message:</p>
          <p>${message.replace(/\n/g, '<br>')}</p>
          <p>Best regards,<br>The User Stories Team</p>
        `,
      });
      console.log("User confirmation email sent", userEmailResponse);
    } catch (emailError: any) {
      console.error("Error sending confirmation to user:", emailError);
      userEmailResponse = { 
        error: emailError.message, 
        note: "Unable to send confirmation email to user" 
      };
    }

    return new Response(JSON.stringify({ 
      success: true,
      adminEmail: adminEmailResponse,
      userEmail: userEmailResponse
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
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
