/**
 * Email sending utility.
 *
 * Supports two providers (configured via NEXT_PUBLIC_EMAIL_PROVIDER env var):
 * - "resend"  — uses the Resend API (set RESEND_API_KEY)
 * - "supabase" — uses a Supabase Edge Function named "send-email"
 *
 * Falls back to console logging in development when no provider is configured.
 */

const EMAIL_PROVIDER = process.env.NEXT_PUBLIC_EMAIL_PROVIDER || ""
const RESEND_API_KEY = process.env.RESEND_API_KEY || ""
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
const FROM_EMAIL = process.env.EMAIL_FROM || "JNV Alumni Network <noreply@jnvalumni.org>"

interface SendEmailParams {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: SendEmailParams): Promise<{ success: boolean; error?: string }> {
  if (EMAIL_PROVIDER === "resend") {
    return sendViaResend({ to, subject, html })
  }

  if (EMAIL_PROVIDER === "supabase") {
    return sendViaSupabaseEdgeFunction({ to, subject, html })
  }

  // Development fallback — log to console
  if (process.env.NODE_ENV === "development") {
    console.log(`[Email] To: ${to} | Subject: ${subject}`)
    return { success: true }
  }

  return { success: false, error: "No email provider configured. Set NEXT_PUBLIC_EMAIL_PROVIDER to 'resend' or 'supabase'." }
}

async function sendViaResend({ to, subject, html }: SendEmailParams) {
  if (!RESEND_API_KEY) {
    return { success: false, error: "RESEND_API_KEY not set" }
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
    })

    if (!res.ok) {
      const body = await res.text()
      return { success: false, error: `Resend error ${res.status}: ${body}` }
    }

    return { success: true }
  } catch (err) {
    return { success: false, error: `Resend request failed: ${err instanceof Error ? err.message : String(err)}` }
  }
}

async function sendViaSupabaseEdgeFunction({ to, subject, html }: SendEmailParams) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return { success: false, error: "Supabase URL or service key not set" }
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/send-email`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ to, subject, html, from: FROM_EMAIL }),
    })

    if (!res.ok) {
      const body = await res.text()
      return { success: false, error: `Edge Function error ${res.status}: ${body}` }
    }

    return { success: true }
  } catch (err) {
    return { success: false, error: `Edge Function request failed: ${err instanceof Error ? err.message : String(err)}` }
  }
}

/**
 * Send email without awaiting — fire and forget.
 * Logs errors but never throws.
 */
export function sendEmailAsync(params: SendEmailParams) {
  sendEmail(params).catch((err) => {
    console.error("[Email] Fire-and-forget failed:", err)
  })
}
