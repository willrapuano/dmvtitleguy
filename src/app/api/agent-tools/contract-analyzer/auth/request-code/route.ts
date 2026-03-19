import { NextRequest, NextResponse } from "next/server";
import { createLoginCode } from "@/lib/contract-analyzer/auth";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const { code } = await createLoginCode(email);

  // Send email with login code
  if (resend) {
    try {
      await resend.emails.send({
        from: "DMV Title Guy <noreply@dmvtitleguy.io>",
        to: email.trim().toLowerCase(),
        subject: "Your Contract Analyzer Login Code",
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="color: #1e293b; font-size: 24px; margin: 0;">DMV Title Guy</h1>
              <p style="color: #64748b; font-size: 14px; margin: 4px 0 0;">Contract Analyzer</p>
            </div>
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 32px; text-align: center;">
              <p style="color: #475569; font-size: 14px; margin: 0 0 16px;">Your login code is:</p>
              <div style="background: #1e293b; color: #ffffff; font-size: 32px; font-family: monospace; letter-spacing: 8px; padding: 16px 24px; border-radius: 8px; display: inline-block; font-weight: bold;">
                ${code}
              </div>
              <p style="color: #94a3b8; font-size: 12px; margin: 16px 0 0;">This code expires in 10 minutes.</p>
            </div>
            <p style="color: #94a3b8; font-size: 11px; text-align: center; margin: 24px 0 0;">
              If you didn't request this code, you can safely ignore this email.<br>
              Pruitt Title LLC · Northern Virginia
            </p>
          </div>
        `,
      });
    } catch (err) {
      console.error("[AUTH] Resend error:", err);
      // Fall through — still return success so user can retry
    }
  } else {
    console.log(`[AUTH] No RESEND_API_KEY — Login code for ${email}: ${code}`);
  }

  return NextResponse.json({
    ok: true,
    message: "Code sent. Check your email.",
  });
}
