
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  name?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name }: WelcomeEmailRequest = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Sending welcome email to new user", { email, name });
    
    // Send welcome email to the new user
    const userEmailResponse = await resend.emails.send({
      from: "UserStory Scribe <welcome@leveragedconsultants.com>",
      to: [email],
      subject: "Welcome to UserStory Scribe!",
      html: `
        <h1>Welcome${name ? ` ${name}` : ""}!</h1>
        <p>Thank you for joining UserStory Scribe, your new home for creating user stories that power your development process.</p>
        <p><strong><a href="${Deno.env.get("APP_URL") || "https://userstory-scribe.lovable.app"}/dashboard">Click here to create your first story</a></strong></p>
        <p>With UserStory Scribe, you can:</p>
        <ul>
          <li>Create detailed user stories using our guided flow</li>
          <li>Generate multiple stories in bulk</li>
          <li>Organize stories into projects</li>
          <li>Export stories to your favorite project management tools</li>
        </ul>
        <p>If you have any questions, simply reply to this email and our team will be happy to help.</p>
        <p>Best regards,<br>The UserStory Scribe Team</p>
      `,
    });
    
    console.log("Welcome email sent to user:", userEmailResponse);

    // Send notification to admin
    const adminEmail = Deno.env.get("ADMIN_EMAIL") || "claude@leveragedconsultants.com";
    const adminEmailResponse = await resend.emails.send({
      from: "UserStory Scribe <notifications@leveragedconsultants.com>",
      to: [adminEmail],
      subject: "New User Registration",
      html: `
        <h1>New User Registration</h1>
        <p>A new user has registered for UserStory Scribe:</p>
        <p><strong>Email:</strong> ${email}</p>
        ${name ? `<p><strong>Name:</strong> ${name}</p>` : ''}
        <p><strong>Registration Time:</strong> ${new Date().toLocaleString()}</p>
      `,
    });
    
    console.log("Admin notification email sent:", adminEmailResponse);

    return new Response(JSON.stringify({ 
      success: true,
      userEmail: userEmailResponse,
      adminEmail: adminEmailResponse
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
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
